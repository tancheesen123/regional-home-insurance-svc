using ApplicationService.Core.Application.ProductService.DTOs;
using ApplicationService.Core.Application.ProductService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProductService.Interfaces.Services;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace ApplicationService.Core.Application.ProductService.Services
{
    public class ProductService : IProductService
    {
        private readonly ILogger<ProductService> _logger;
        private readonly IProductRepository _productRepository;

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

            // ── Load region config (replaces ProductPremiumRate + TaxConfig) ──
            var regionConfig = await _productRepository.GetRegionConfigAsync(region)
                ?? throw new InvalidOperationException(
                    $"No active region config found for region '{region}'. Please seed RegionConfig.");

            // ── Validate inputs ───────────────────────────────────────────────
            Validate(request);

            var buildingSi = request.BuildingSumInsured ?? 0m;
            var contentSi  = request.ContentSumInsured  ?? 0m;

            decimal buildingPremium = 0m;
            decimal contentPremium  = 0m;

            if (request.PlanType is 1 or 3)
                buildingPremium = buildingSi * regionConfig.BuildingRate;

            if (request.PlanType is 2 or 3)
                contentPremium = contentSi * regionConfig.ContentRate;

            decimal planPremium = buildingPremium + contentPremium;

            // ── Add-on premiums (rates now in AddOn.RatesJson) ────────────────
            var addOnBreakdowns = new List<AddOnBreakdown>();

            if (request.AddOnCodes.Count > 0)
            {
                var addOns = await _productRepository.GetAddOnsAsync(request.AddOnCodes);

                foreach (var addOn in addOns)
                {
                    var eligiblePlans = addOn.EligiblePlanTypes
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => int.TryParse(s.Trim(), out var n) ? n : 0)
                        .ToHashSet();

                    if (!eligiblePlans.Contains(request.PlanType))
                    {
                        _logger.LogDebug("Add-on {Code} not eligible for PlanType {PlanType} — skipped.",
                            addOn.Code, request.PlanType);
                        continue;
                    }

                    decimal sumInsured = addOn.SumInsuredBasis switch
                    {
                        "Content" => contentSi,
                        "Both"    => buildingSi + contentSi,
                        _         => buildingSi
                    };

                    // Read rate from JSON: { "PH": 0.001, "ID": 0.0012, "KH": 0.0008 }
                    var rates = JsonSerializer.Deserialize<Dictionary<string, decimal>>(
                        addOn.RatesJson ?? "{}", new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    decimal rate    = rates?.GetValueOrDefault(region.ToUpper(), 0m) ?? 0m;
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

            // ── Discount ──────────────────────────────────────────────────────
            decimal discountAmount = request.DiscountAmount;
            decimal netPremium     = Math.Max(0m, grossPremium - discountAmount);

            // ── Dates ─────────────────────────────────────────────────────────
            var startDate = request.StartDate.Date;
            var endDate   = startDate.AddYears(1).AddDays(-1);

            // ── Tax (from RegionConfig) ───────────────────────────────────────
            decimal serviceTaxAmount = netPremium * (regionConfig.ServiceTaxRate / 100m);

            decimal stampDutyAmount = 0m;
            if (netPremium > regionConfig.StampDutyWaiverEligiblePremium)
                stampDutyAmount = regionConfig.StampDutyAmount;

            decimal totalPremium = netPremium + serviceTaxAmount + stampDutyAmount;

            decimal serviceTaxBeforeDiscount = grossPremium * (regionConfig.ServiceTaxRate / 100m);
            decimal totalBeforeDiscount      = grossPremium + serviceTaxBeforeDiscount + stampDutyAmount;

            return new CalculatePremiumResponse
            {
                PlanType             = request.PlanType,
                BuildingSumInsured   = buildingSi,
                ContentSumInsured    = contentSi,
                BuildingRate         = regionConfig.BuildingRate,
                ContentRate          = regionConfig.ContentRate,
                BuildingPremium      = Round(buildingPremium),
                ContentPremium       = Round(contentPremium),
                PlanPremium          = Round(planPremium),
                AddOnBreakdowns      = addOnBreakdowns,
                TotalAddOnPremium    = Round(totalAddOnPremium),
                GrossPremium         = Round(grossPremium),
                DiscountAmount       = Round(discountAmount),
                NetPremium           = Round(netPremium),
                ServiceTaxRate       = regionConfig.ServiceTaxRate,
                ServiceTaxAmount     = Round(serviceTaxAmount),
                StampDutyAmount      = Round(stampDutyAmount),
                TotalPremium         = Round(totalPremium),
                TotalBeforeDiscount  = Round(totalBeforeDiscount),
                StartDate            = startDate.ToString("dd/MM/yyyy"),
                EndDate              = endDate.ToString("dd/MM/yyyy")
            };
        }

        private static void Validate(CalculatePremiumRequest request)
        {
            if (request.PlanType is not (1 or 2 or 3))
                throw new ArgumentException("PlanType must be 1 (Building), 2 (Content), or 3 (Both).");

            if (request.StartDate == default)
                throw new ArgumentException("StartDate is required.");

            if (request.DiscountAmount < 0)
                throw new ArgumentException("DiscountAmount cannot be negative.");
        }

        private static decimal Round(decimal value) => Math.Round(value, 2, MidpointRounding.AwayFromZero);
    }
}
