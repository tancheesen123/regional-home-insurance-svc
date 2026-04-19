using ApplicationService.Core.Application.ProductService.DTOs;
using ApplicationService.Core.Application.ProductService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProductService.Interfaces.Services;
using ApplicationService.Core.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProductService.Services
{
    public class ProductService : IProductService
    {
        private readonly ILogger<ProductService> _logger;
        private readonly IProductRepository _productRepository;

        private const decimal SumInsuredMultiple = 1_000m;

        public ProductService(ILogger<ProductService> logger, IProductRepository productRepository)
        {
            _logger            = logger;
            _productRepository = productRepository;
        }

        public async Task<CalculatePremiumResponse> CalculatePremiumAsync(
            CalculatePremiumRequest request, string region)
        {
            _logger.LogInformation("=== ProductService.CalculatePremiumAsync | Region={Region} PlanType={PlanType} ===",
                region, request.PlanType);

            // ── Step 3: Load base rates (needed for regional min/max validation) ─
            var premiumRate = await _productRepository.GetPremiumRateAsync(region)
                ?? throw new InvalidOperationException(
                    $"No active premium rate is configured for region '{region}'. " +
                    "Please seed a row in ProductPremiumRates.");

            // ── Step 1: Validate using regional limits from DB ────────────────
            Validate(request, premiumRate);

            // ── Step 3: Compute plan premium ──────────────────────────────────
            var buildingSi = request.BuildingSumInsured ?? 0m;
            var contentSi  = request.ContentSumInsured  ?? 0m;

            decimal buildingPremium = 0m;
            decimal contentPremium  = 0m;

            if (request.PlanType is 1 or 3)
                buildingPremium = buildingSi * premiumRate.BuildingRate;

            if (request.PlanType is 2 or 3)
                contentPremium = contentSi * premiumRate.ContentRate;

            decimal planPremium = buildingPremium + contentPremium;

            // ── Step 4: Add-on premiums ───────────────────────────────────────
            var addOnBreakdowns = new List<AddOnBreakdown>();

            if (request.AddOnCodes.Count > 0)
            {
                var addOns   = await _productRepository.GetAddOnsAsync(request.AddOnCodes);
                var rateMap  = await _productRepository.GetAddOnRatesAsync(region, request.AddOnCodes);

                foreach (var addOn in addOns)
                {
                    // Check plan eligibility
                    var eligiblePlans = addOn.EligiblePlanTypes
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => int.TryParse(s.Trim(), out var n) ? n : 0)
                        .ToHashSet();

                    if (!eligiblePlans.Contains(request.PlanType))
                    {
                        _logger.LogDebug("Add-on {Code} is not eligible for PlanType {PlanType} — skipped.",
                            addOn.Code, request.PlanType);
                        continue;
                    }

                    // Determine the sum insured basis for this add-on
                    decimal sumInsured = addOn.SumInsuredBasis switch
                    {
                        "Content" => contentSi,
                        "Both"    => buildingSi + contentSi,
                        _         => buildingSi   // default: Building
                    };

                    decimal rate    = rateMap.GetValueOrDefault(addOn.Code, 0m);
                    decimal premium = sumInsured * rate;

                    addOnBreakdowns.Add(new AddOnBreakdown
                    {
                        Code       = addOn.Code,
                        Name       = addOn.Name,
                        SumInsured = sumInsured,
                        Rate       = rate,
                        Premium    = Round(premium)
                    });
                }
            }

            decimal totalAddOnPremium = addOnBreakdowns.Sum(a => a.Premium);
            decimal grossPremium      = planPremium + totalAddOnPremium;

            // ── Step 5: Discount ──────────────────────────────────────────────
            decimal discountAmount = request.DiscountAmount;
            decimal netPremium     = Math.Max(0m, grossPremium - discountAmount);

            // ── Step 6: End date = StartDate + 1 year − 1 day ────────────────
            var startDate = request.StartDate.Date;
            var endDate   = startDate.AddYears(1).AddDays(-1);

            // ── Step 8: Service Tax ───────────────────────────────────────────
            var taxConfig = await _productRepository.GetTaxConfigAsync(region)
                ?? throw new InvalidOperationException(
                    $"No active tax config is configured for region '{region}'. " +
                    "Please seed a row in TaxConfigs.");

            decimal serviceTaxAmount = netPremium * (taxConfig.ServiceTaxRate / 100m);

            // ── Step 9: Stamp Duty ────────────────────────────────────────────
            decimal stampDutyAmount = 0m;
            if (netPremium > taxConfig.StampDutyWaiverEligiblePremium)
                stampDutyAmount = taxConfig.StampDutyAmount;

            // ── Final totals ──────────────────────────────────────────────────
            decimal totalPremium = netPremium + serviceTaxAmount + stampDutyAmount;

            // TotalBeforeDiscount: same formula but using grossPremium (no discount applied)
            decimal serviceTaxBeforeDiscount = grossPremium * (taxConfig.ServiceTaxRate / 100m);
            decimal totalBeforeDiscount      = grossPremium + serviceTaxBeforeDiscount + stampDutyAmount;

            return new CalculatePremiumResponse
            {
                PlanType             = request.PlanType,
                BuildingSumInsured   = buildingSi,
                ContentSumInsured    = contentSi,

                BuildingRate         = premiumRate.BuildingRate,
                ContentRate          = premiumRate.ContentRate,
                BuildingPremium      = Round(buildingPremium),
                ContentPremium       = Round(contentPremium),
                PlanPremium          = Round(planPremium),

                AddOnBreakdowns      = addOnBreakdowns,
                TotalAddOnPremium    = Round(totalAddOnPremium),

                GrossPremium         = Round(grossPremium),
                DiscountAmount       = Round(discountAmount),
                NetPremium           = Round(netPremium),

                ServiceTaxRate       = taxConfig.ServiceTaxRate,
                ServiceTaxAmount     = Round(serviceTaxAmount),
                StampDutyAmount      = Round(stampDutyAmount),

                TotalPremium         = Round(totalPremium),
                TotalBeforeDiscount  = Round(totalBeforeDiscount),

                StartDate            = startDate.ToString("dd/MM/yyyy"),
                EndDate              = endDate.ToString("dd/MM/yyyy")
            };
        }

        // ── Validation ────────────────────────────────────────────────────────

        private static void Validate(CalculatePremiumRequest request, ProductPremiumRate rate)
        {
            if (request.PlanType is not (1 or 2 or 3))
                throw new ArgumentException("PlanType must be 1 (Building), 2 (Content), or 3 (Both).");

            if (request.StartDate == default)
                throw new ArgumentException("StartDate is required.");

            //if (request.PlanType is 1 or 3)
            //{
            //    var bsi = request.BuildingSumInsured ?? 0m;

            //    if (bsi <= 0)
            //        throw new ArgumentException("BuildingSumInsured is required for PlanType Building or Both.");

            //    if (bsi % SumInsuredMultiple != 0)
            //        throw new ArgumentException("BuildingSumInsured must be a multiple of 1,000.");

            //    if (bsi < rate.MinBuildingSum)
            //        throw new ArgumentException(
            //            $"BuildingSumInsured minimum for this region is {rate.MinBuildingSum:N0}.");

            //    if (rate.MaxBuildingSum.HasValue && bsi > rate.MaxBuildingSum.Value)
            //        throw new ArgumentException(
            //            $"BuildingSumInsured maximum for this region is {rate.MaxBuildingSum.Value:N0}.");
            //}

            //if (request.PlanType is 2 or 3)
            //{
            //    var csi = request.ContentSumInsured ?? 0m;

            //    if (csi <= 0)
            //        throw new ArgumentException("ContentSumInsured is required for PlanType Content or Both.");

            //    if (csi % SumInsuredMultiple != 0)
            //        throw new ArgumentException("ContentSumInsured must be a multiple of 1,000.");

            //    if (csi < rate.MinContentSum)
            //        throw new ArgumentException(
            //            $"ContentSumInsured minimum for this region is {rate.MinContentSum:N0}.");

            //    if (rate.MaxContentSum.HasValue && csi > rate.MaxContentSum.Value)
            //        throw new ArgumentException(
            //            $"ContentSumInsured maximum for this region is {rate.MaxContentSum.Value:N0}.");
            //}

            if (request.DiscountAmount < 0)
                throw new ArgumentException("DiscountAmount cannot be negative.");
        }

        private static decimal Round(decimal value) => Math.Round(value, 2, MidpointRounding.AwayFromZero);
    }
}
