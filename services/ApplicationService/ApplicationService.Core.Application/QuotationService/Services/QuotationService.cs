using ApplicationService.Core.Application.Common.Constants;
using ApplicationService.Core.Application.Common.Enums;
using ApplicationService.Core.Application.ProductService.DTOs;
using ApplicationService.Core.Application.ProductService.Interfaces.Services;
using ApplicationService.Core.Application.QuotationService.DTOs;
using ApplicationService.Core.Application.QuotationService.Interfaces.Repositories;
using ApplicationService.Core.Application.QuotationService.Interfaces.Services;
using ApplicationService.Core.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.QuotationService.Services
{
    public class QuotationService : IQuotationService
    {
        private readonly ILogger<QuotationService> _logger;
        private readonly IQuotationRepository _quotationRepository;
        private readonly IProductService _productService;

        private const decimal BasePremium = 500m;

        public QuotationService(
            ILogger<QuotationService> logger,
            IQuotationRepository quotationRepository,
            IProductService productService)
        {
            _logger              = logger;
            _quotationRepository = quotationRepository;
            _productService      = productService;
        }

        // ── GetQuote ──────────────────────────────────────────────────────────

        public async Task<GetQuoteResponse> GetQuoteAsync(GetQuoteRequest request, string region)
        {
            _logger.LogInformation("=== QuotationService.GetQuoteAsync ===");

            var premium = CalculatePremium(request);

            var coverageStart = ParseDate(request.CoverageStartDate);
            // EndDate = StartDate + 1 year - 1 day so the purchase day is day 1 of coverage
            // e.g. start Jun 21 2025 → end Jun 20 2026 (365 days inclusive)
            var expiryDate    = coverageStart.AddYears(1).AddDays(-1);

            var quotation = new Quotation
            {
                QuotationId        = Guid.NewGuid().ToString(),
                Status             = "QUOTED",
                Premium            = premium,
                CoverageStartDate  = coverageStart,
                ExpiryDate         = expiryDate,
                Region             = region.ToUpper(),
                CustomerId         = request.CustomerId,
                ProductId          = null,
                OwnershipType      = request.OwnershipType,
                PropertyType       = request.PropertyType,
                PropertySubType    = request.PropertySubType,
                NumberOfStorey     = request.NumberOfStorey,
                ConstructionType   = request.ConstructionType,
                Postcode           = request.Postcode,
                CurrentFlooding    = request.CurrentFlooding.Equals("yes", StringComparison.OrdinalIgnoreCase),
                UnoccupiedProperty = request.UnoccupiedProperty.Equals("yes", StringComparison.OrdinalIgnoreCase),
                PreviousLoss       = request.PreviousLoss.Equals("yes", StringComparison.OrdinalIgnoreCase),
                IdType             = request.IdType,
                IdNumber           = request.IdNumber,
                Nationality        = request.Nationality,
                DateOfBirth        = request.DateOfBirth
            };

            await _quotationRepository.AddQuotationAsync(quotation);
            await _quotationRepository.SaveChangesAsync();

            return new GetQuoteResponse
            {
                QuotationId       = quotation.QuotationId,
                Status            = quotation.Status,
                Premium           = quotation.Premium,
                CoverageStartDate = quotation.CoverageStartDate.ToString("dd/MM/yyyy"),
                ExpiryDate        = quotation.ExpiryDate.ToString("dd/MM/yyyy"),
                OwnershipType     = quotation.OwnershipType,
                PropertyType      = quotation.PropertyType,
                PropertySubType   = quotation.PropertySubType,
                NumberOfStorey    = quotation.NumberOfStorey,
                ConstructionType  = quotation.ConstructionType,
                Postcode          = quotation.Postcode,
                Region            = quotation.Region
            };
        }

        // ── CustomizePlan ─────────────────────────────────────────────────────

        public async Task<CustomizePlanResponse> CustomizePlanAsync(CustomizePlanRequest request)
        {
            _logger.LogInformation("=== QuotationService.CustomizePlanAsync ===");

            var quotation = await _quotationRepository.GetByIdAsync(request.QuotationId);
            if (quotation == null)
                throw new KeyNotFoundException($"Quotation '{request.QuotationId}' not found.");

            if (quotation.Status != "QUOTED")
                throw new InvalidOperationException($"Quotation is in '{quotation.Status}' status and cannot be customised.");

            if (!PlanTypeParser.TryParse(request.PlanType, out var planTypeEnum))
                throw new ArgumentException(
                    $"Unknown PlanType '{request.PlanType}'. " +
                    $"Valid values: {string.Join(", ", PlanTypeParser.ValidValues)}.");

            var planTypeInt = (int)planTypeEnum;

            var addOns     = request.AddOns ?? new AddOnsDto();
            var addOnCodes = new List<string>();
            if (addOns.RiotStrike)               addOnCodes.Add(AddonCode.Map["RiotStrike"]);
            if (addOns.ExtendedTheft)            addOnCodes.Add(AddonCode.Map["ExtendedTheft"]);
            if (addOns.AlternativeAccommodation) addOnCodes.Add(AddonCode.Map["AlternativeAccommodation"]);
            if (addOns.PublicLiability)          addOnCodes.Add(AddonCode.Map["PublicLiability"]);


            var calcRequest = new CalculatePremiumRequest
            {
                PlanType           = planTypeInt,
                BuildingSumInsured = request.BuildingSum,
                ContentSumInsured  = request.ContentsSum,
                AddOnCodes         = addOnCodes,
                StartDate          = quotation.CoverageStartDate,
                DiscountAmount     = request.DiscountAmount
            };

            var calc = await _productService.CalculatePremiumAsync(calcRequest, quotation.Region);

            // ── Persist plan details onto the quotation ───────────────────────
            quotation.PlanType                    = request.PlanType;
            quotation.BuildingSum                 = request.BuildingSum;
            quotation.ContentsSum                 = request.ContentsSum;
            quotation.HasRiotStrike               = addOns.RiotStrike;
            quotation.HasExtendedTheft            = addOns.ExtendedTheft;
            quotation.HasAlternativeAccommodation = addOns.AlternativeAccommodation;
            quotation.HasPublicLiability          = addOns.PublicLiability;
            quotation.Premium                     = calc.TotalPremium;   // tax-inclusive payable amount
            quotation.UpdatedAt                   = DateTime.UtcNow;

            await _quotationRepository.UpdateQuotationPlanAsync(quotation);

            // ── Persist full premium breakdown ────────────────────────────────
            var quotationPremium = new QuotationPremium
            {
                QuotationId        = quotation.QuotationId,
                PlanPremium        = calc.PlanPremium,
                AddOnPremium       = calc.TotalAddOnPremium,
                GrossPremium       = calc.GrossPremium,
                DiscountAmount     = calc.DiscountAmount,
                NetPremium         = calc.NetPremium,
                TaxRate            = calc.ServiceTaxRate,
                TaxAmount          = calc.ServiceTaxAmount,
                StampDuty          = calc.StampDutyAmount,
                TotalPremium       = calc.TotalPremium,
                TotalBeforeDiscount = calc.TotalBeforeDiscount,
                CreatedAt          = DateTime.UtcNow
            };

            await _quotationRepository.UpsertQuotationPremiumAsync(quotationPremium);
            await _quotationRepository.SaveChangesAsync();

            return new CustomizePlanResponse
            {
                QuotationId          = quotation.QuotationId,
                PlanType             = quotation.PlanType,
                BuildingSum          = quotation.BuildingSum,
                ContentsSum          = quotation.ContentsSum,

                BuildingPremium      = calc.BuildingPremium,
                ContentPremium       = calc.ContentPremium,
                PlanPremium          = calc.PlanPremium,
                AddOnsPremium        = calc.TotalAddOnPremium,
                GrossPremium         = calc.GrossPremium,
                DiscountAmount       = calc.DiscountAmount,
                NetPremium           = calc.NetPremium,
                ServiceTaxRate       = calc.ServiceTaxRate,
                ServiceTaxAmount     = calc.ServiceTaxAmount,
                StampDutyAmount      = calc.StampDutyAmount,
                TotalPremium         = calc.TotalPremium,
                TotalBeforeDiscount  = calc.TotalBeforeDiscount,
                AnnualPremium        = calc.TotalPremium,
                MonthlyPremium       = Math.Round(calc.TotalPremium / 12, 2),
                StartDate            = calc.StartDate,
                EndDate              = calc.EndDate,

                AddOnBreakdown = calc.AddOnBreakdowns.Select(a => new AddOnBreakdownDto
                {
                    Code    = a.Code,
                    Name    = a.Name,
                    Premium = a.Premium
                }).ToList()
            };
        }

        // ── DeclareValuables ──────────────────────────────────────────────────

        public async Task<DeclareValuablesResponse> DeclareValuablesAsync(DeclareValuablesRequest request)
        {
            _logger.LogInformation("=== QuotationService.DeclareValuablesAsync ===");

            var quotation = await _quotationRepository.GetByIdAsync(request.QuotationId);
            if (quotation == null)
                throw new KeyNotFoundException($"Quotation '{request.QuotationId}' not found.");

            if (quotation.Status != "QUOTED")
                throw new InvalidOperationException($"Quotation is in '{quotation.Status}' status and cannot be modified.");

            if (string.IsNullOrEmpty(quotation.PlanType))
                throw new InvalidOperationException("Plan has not been customised yet. Call CustomizePlan before declaring valuables.");

            // ── Load regional category limits from DB ─────────────────────────
            var categoryRates = await _quotationRepository.GetValuableCategoryRatesAsync(quotation.Region);
            if (categoryRates.Count == 0)
                throw new InvalidOperationException(
                    $"No active valuable category rates are configured for region '{quotation.Region}'.");

            // ── Validate each item ────────────────────────────────────────────
            var categoryTotals = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase);

            foreach (var item in request.Items)
            {
                var key = item.Category.ToLower();
                if (!categoryRates.TryGetValue(key, out var limits))
                    throw new ArgumentException(
                        $"Unknown category '{item.Category}'. " +
                        $"Valid categories: {string.Join(", ", categoryRates.Keys)}.");

                if (item.Value <= 0)
                    throw new ArgumentException($"Item '{item.Description}' must have a value greater than zero.");

                if (item.Value > limits.MaxPerItem)
                    throw new ArgumentException(
                        $"'{item.Description}' ({item.Category}) declared value {item.Value:C} exceeds the per-item limit of {limits.MaxPerItem:C}.");

                categoryTotals[key] = categoryTotals.GetValueOrDefault(key) + item.Value;
            }

            // Validate category totals
            foreach (var (cat, total) in categoryTotals)
            {
                var limits = categoryRates[cat];
                if (total > limits.MaxTotal)
                    throw new ArgumentException(
                        $"Total declared value for '{cat}' ({total:C}) exceeds the category limit of {limits.MaxTotal:C}.");
            }

            // ── Build ValuableItem entities ───────────────────────────────────
            var now          = DateTime.UtcNow;
            var itemEntities = request.Items.Select(i => new ValuableItem
            {
                ItemId      = Guid.NewGuid().ToString(),
                Category    = i.Category.ToLower(),
                Description = i.Description,
                Value       = i.Value,
                QuotationId = request.QuotationId,
                CreatedAt   = now
            }).ToList();

            // ── Calculate valuables premium ───────────────────────────────────
            var itemResponses = itemEntities.Select(e =>
            {
                var rate    = categoryRates[e.Category].Rate;
                var premium = Math.Round(e.Value * rate, 2);
                return (Entity: e, Premium: premium);
            }).ToList();

            decimal totalDeclaredValue = itemResponses.Sum(x => x.Entity.Value);
            decimal valuablesPremium   = itemResponses.Sum(x => x.Premium);

            // ── Update quotation premium ──────────────────────────────────────
            // planPremium = whatever CustomizePlan last saved; valuables are additive
            decimal planPremium  = quotation.Premium;
            decimal totalPremium = Math.Round(planPremium + valuablesPremium, 2);
            decimal monthly      = Math.Round(totalPremium / 12, 2);

            quotation.Premium   = totalPremium;
            quotation.UpdatedAt = now;

            await _quotationRepository.ReplaceValuableItemsAsync(request.QuotationId, itemEntities);
            await _quotationRepository.UpdateQuotationPlanAsync(quotation);
            await _quotationRepository.SaveChangesAsync();

            return new DeclareValuablesResponse
            {
                QuotationId        = quotation.QuotationId,
                TotalDeclaredValue = totalDeclaredValue,
                ValuablesPremium   = valuablesPremium,
                PlanPremium        = planPremium,
                TotalPremium       = totalPremium,
                AnnualPremium      = totalPremium,
                MonthlyPremium     = monthly,
                Items = itemResponses.Select(x => new ValuableItemResponse
                {
                    ItemId      = x.Entity.ItemId,
                    Category    = x.Entity.Category,
                    Description = x.Entity.Description,
                    Value       = x.Entity.Value,
                    ItemPremium = x.Premium
                }).ToList()
            };
        }

        // ── SubmitPolicy ──────────────────────────────────────────────────────

        public async Task<SubmitPolicyResponse> SubmitPolicyAsync(SubmitPolicyRequest request)
        {
            _logger.LogInformation("=== QuotationService.SubmitPolicyAsync ===");

            var quotation = await _quotationRepository.GetByIdAsync(request.QuotationId);
            if (quotation == null)
                throw new KeyNotFoundException($"Quotation '{request.QuotationId}' not found.");

            if (quotation.Status != "QUOTED")
                throw new InvalidOperationException($"Quotation is already '{quotation.Status}' and cannot be submitted.");

            // Resolve mailing address
            var mailing = request.MailingAddress;
            var prop    = request.PropertyAddress;

            var proposal = new Proposal
            {
                ProposalId           = Guid.NewGuid().ToString(),
                Status               = "PENDING",
                CustomerId           = quotation.CustomerId,
                QuotationId          = quotation.QuotationId,
                Name                 = request.PersonalDetails.Name,
                IdType               = request.PersonalDetails.IdType,
                IdNumber             = request.PersonalDetails.IdNumber,
                Nationality          = request.PersonalDetails.Nationality,
                Race                 = request.PersonalDetails.Race,
                Gender               = request.PersonalDetails.Gender,
                DateOfBirth          = request.PersonalDetails.DateOfBirth,
                MobileNumber         = request.PersonalDetails.MobileNumber,
                Email                = request.PersonalDetails.Email,
                PropAddressLine1     = prop.AddressLine1,
                PropAddressLine2     = prop.AddressLine2,
                PropCity             = prop.City,
                PropPostcode         = prop.Postcode,
                PropState            = prop.State,
                PropCountry          = prop.Country,
                MailingSameAsProperty = mailing.SameAsPropertyAddress,
                MailAddressLine1     = mailing.SameAsPropertyAddress ? prop.AddressLine1 : mailing.AddressLine1,
                MailAddressLine2     = mailing.SameAsPropertyAddress ? prop.AddressLine2 : mailing.AddressLine2,
                MailCity             = mailing.SameAsPropertyAddress ? prop.City         : mailing.City,
                MailPostcode         = mailing.SameAsPropertyAddress ? prop.Postcode     : mailing.Postcode,
                MailState            = mailing.SameAsPropertyAddress ? prop.State        : mailing.State,
                MailCountry          = mailing.SameAsPropertyAddress ? prop.Country      : mailing.Country,
                BankName             = request.BankDetails.BankName,
                BankAccountNumber    = request.BankDetails.AccountNumber
            };

            var startDate = quotation.CoverageStartDate;
            // EndDate = StartDate + 1 year - 1 day so the purchase day is day 1 of coverage
            var endDate   = startDate.AddYears(1).AddDays(-1);

            var policy = new Policy
            {
                PolicyId        = Guid.NewGuid().ToString(),
                PolicyNumber    = GeneratePolicyNumber(quotation.Region),
                StartDate       = startDate,
                EndDate         = endDate,
                CoverageAmount  = quotation.Premium * 100,   // coverage = premium × 100
                IssuedAt        = DateTime.UtcNow,
                IssuedBy        = "SYSTEM",
                ProposalId      = proposal.ProposalId
            };

            await _quotationRepository.AddProposalAsync(proposal);
            await _quotationRepository.AddPolicyAsync(policy);
            await _quotationRepository.UpdateQuotationStatusAsync(quotation.QuotationId, "CONVERTED");
            await _quotationRepository.SaveChangesAsync();

            return new SubmitPolicyResponse
            {
                PolicyId    = policy.PolicyId,
                PolicyNumber = policy.PolicyNumber,
                ProposalId  = proposal.ProposalId,
                QuotationId = quotation.QuotationId,
                Premium     = quotation.Premium,
                StartDate   = policy.StartDate.ToString("dd/MM/yyyy"),
                EndDate     = policy.EndDate.ToString("dd/MM/yyyy"),
                Status      = proposal.Status,
                Message     = "Policy submitted successfully."
            };
        }

        // ── Premium Calculation ───────────────────────────────────────────────

        private decimal CalculatePremium(GetQuoteRequest request)
        {
            var premium = BasePremium;

            // Construction type
            premium *= request.ConstructionType.Equals("full-brick", StringComparison.OrdinalIgnoreCase)
                ? 1.0m : 1.3m;

            // Number of storeys
            premium *= request.NumberOfStorey switch
            {
                1 => 1.0m,
                2 => 1.1m,
                _ => 1.2m
            };

            // Risk factors
            if (request.CurrentFlooding.Equals("yes", StringComparison.OrdinalIgnoreCase))
                premium *= 1.25m;

            if (request.UnoccupiedProperty.Equals("yes", StringComparison.OrdinalIgnoreCase))
                premium *= 1.20m;

            if (request.PreviousLoss.Equals("yes", StringComparison.OrdinalIgnoreCase))
                premium *= 1.15m;

            return Math.Round(premium, 2);
        }

        private string GeneratePolicyNumber(string region)
        {
            var year     = DateTime.UtcNow.Year;
            var sequence = new Random().Next(100000, 999999);
            return $"HI-{region}-{year}-{sequence}";
        }

        private DateTime ParseDate(string date)
        {
            if (DateTime.TryParseExact(date, "dd/MM/yyyy",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var result))
                return result;

            return DateTime.UtcNow.Date;
        }
    }
}
