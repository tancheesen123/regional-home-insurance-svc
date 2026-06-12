using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Application.SalesService.DTOs;
using ApplicationService.Core.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.SalesService.Features.Query
{
    /// <summary>
    /// Returns a filtered list of sales records plus an unfiltered period summary.
    /// Summary is always computed from the full date-range dataset (ignoring status/search filters).
    /// </summary>
    public class GetSalesRecordsQuery : IRequest<GetSalesRecordsResult>
    {
        public GetSalesRecordsRequest Request { get; set; } = new();

        public class GetSalesRecordsQueryHandler
            : IRequestHandler<GetSalesRecordsQuery, GetSalesRecordsResult>
        {
            private readonly ILogger<GetSalesRecordsQueryHandler> _logger;
            private readonly IProposalRepository _proposalRepository;

            public GetSalesRecordsQueryHandler(
                ILogger<GetSalesRecordsQueryHandler> logger,
                IProposalRepository proposalRepository)
            {
                _logger = logger;
                _proposalRepository = proposalRepository;
            }

            public async Task<GetSalesRecordsResult> Handle(
                GetSalesRecordsQuery query, CancellationToken cancellationToken)
            {
                var req = query.Request;

                _logger.LogInformation(
                    "=== GetSalesRecords | DateFrom={DateFrom} DateTo={DateTo} Status={Status} Search={Search} ===",
                    req.DateFrom, req.DateTo, req.Status, req.Search);

                // Load all proposals for the period (date filter only)
                var all = await _proposalRepository.GetSalesProposalsAsync(req.DateFrom, req.DateTo);

                // Load the immediately preceding period of the same length for growth comparison
                decimal? priorPeriodPremium = null;
                if (req.DateFrom.HasValue && req.DateTo.HasValue)
                {
                    var periodLength = req.DateTo.Value - req.DateFrom.Value;
                    var priorTo   = req.DateFrom.Value.AddTicks(-1);
                    var priorFrom = priorTo - periodLength;

                    var priorProposals = await _proposalRepository.GetSalesProposalsAsync(priorFrom, priorTo);
                    priorPeriodPremium = priorProposals.Select(GetPremium).Sum();
                }

                // Summary is computed from the unfiltered period dataset
                var summary = ComputeSummary(all, priorPeriodPremium);

                // Apply additional filters for the records list
                var filtered = all.AsEnumerable();

                if (!string.IsNullOrWhiteSpace(req.Status))
                    filtered = filtered.Where(p => MapStatus(p) == req.Status);

                if (!string.IsNullOrWhiteSpace(req.ProductType) &&
                    !string.Equals(req.ProductType, "Home Insurance", StringComparison.OrdinalIgnoreCase))
                {
                    filtered = Enumerable.Empty<Proposal>();
                }

                if (!string.IsNullOrWhiteSpace(req.Search))
                {
                    var s = req.Search.Trim().ToLower();
                    filtered = filtered.Where(p =>
                        (p.Name              ?? "").ToLower().Contains(s) ||
                        (p.Email             ?? "").ToLower().Contains(s) ||
                        (p.Policy?.PolicyNumber ?? "").ToLower().Contains(s));
                }

                var records = filtered
                    .Select(p => MapToRecord(p))
                    .ToList();

                _logger.LogInformation(
                    "GetSalesRecords | Returned {Count} record(s).", records.Count);

                return new GetSalesRecordsResult
                {
                    Records = records,
                    Summary = summary,
                };
            }

            // ── Mapping helpers ────────────────────────────────────────────────

            private static SalesRecord MapToRecord(Proposal p)
            {
                var payment  = LatestSuccessfulPayment(p);
                var premium  = GetPremium(p);
                var saleDate = payment?.PaymentDate ?? p.Policy?.IssuedAt ?? p.CreatedAt;

                return new SalesRecord
                {
                    Id            = p.ProposalId,
                    PolicyNumber  = p.Policy?.PolicyNumber  ?? string.Empty,
                    CustomerName  = p.Name                  ?? string.Empty,
                    CustomerEmail = p.Email                 ?? string.Empty,
                    ProductType   = "Home Insurance",
                    CoverageType  = MapCoverageType(p.Quotation?.PlanType),
                    Premium       = premium,
                    Commission    = Math.Round(premium * 0.10m, 2),
                    SaleDate      = saleDate,
                    EffectiveDate = p.Policy?.StartDate,
                    Status        = MapStatus(p),
                    PaymentMethod = MapPaymentMethod(payment?.PaymentMethod),
                    Region        = MapRegion(p.Quotation?.Region),
                    AgentName     = p.Policy?.IssuedBy ?? string.Empty,
                    AgentId       = p.Policy?.IssuedBy ?? string.Empty,
                    RenewalDate   = p.Policy?.EndDate,
                };
            }

            private static SalesSummary ComputeSummary(List<Proposal> proposals, decimal? priorPeriodPremium)
            {
                var now      = DateTime.UtcNow;
                var premiums = proposals.Select(GetPremium).ToList();
                var total    = premiums.Sum();
                var count    = proposals.Count;

                var inforced  = proposals.Count(p => p.Status == "INFORCED");
                var cancelled = proposals.Count(p => p.Status == "CANCELLED");
                var decided   = inforced + cancelled;

                decimal premiumGrowthPct;
                if (priorPeriodPremium.HasValue)
                {
                    premiumGrowthPct = priorPeriodPremium.Value > 0
                        ? Math.Round((total - priorPeriodPremium.Value) / priorPeriodPremium.Value * 100m, 1)
                        : (total > 0 ? 100m : 0m);
                }
                else
                {
                    premiumGrowthPct = 0m;
                }

                return new SalesSummary
                {
                    TotalSales       = count,
                    TotalPremium     = Math.Round(total, 2),
                    TotalCommission  = Math.Round(total * 0.10m, 2),
                    ActivePolicies   = proposals.Count(p => p.Status == "INFORCED" && p.Policy?.EndDate >= now),
                    PendingPolicies  = proposals.Count(p => p.Status == "PENDING"),
                    AveragePremium   = count > 0 ? Math.Round(total / count, 2) : 0m,
                    ConversionRate   = decided > 0 ? Math.Round((decimal)inforced / decided * 100m, 1) : 0m,
                    PremiumGrowthPct = premiumGrowthPct,
                };
            }

            private static decimal GetPremium(Proposal p)
                => p.Quotation?.Premium
                ?? p.Policy?.CoverageAmount
                ?? 0m;

            private static Payment? LatestSuccessfulPayment(Proposal p)
                => p.Payments?
                    .Where(pay => pay.Status == "SUCCESS")
                    .OrderByDescending(pay => pay.PaymentDate)
                    .FirstOrDefault();

            private static string MapStatus(Proposal p)
            {
                var now = DateTime.UtcNow;
                return p.Status switch
                {
                    "INFORCED"  => p.Policy?.EndDate < now ? "Expired" : "Active",
                    "PENDING"   => "Pending",
                    "CANCELLED" => "Cancelled",
                    _           => p.Status
                };
            }

            private static string MapCoverageType(string? planType)
                => planType?.ToLower() switch
                {
                    "building"          => "Building",
                    "contents"          => "Contents",
                    "building-contents" => "Building + Contents",
                    _                   => planType ?? string.Empty
                };

            private static string MapRegion(string? code)
                => code?.ToUpper() switch
                {
                    "PH" => "Philippines",
                    "ID" => "Indonesia",
                    "KH" => "Cambodia",
                    _    => code ?? string.Empty
                };

            private static string MapPaymentMethod(string? raw)
                => raw?.ToLower() switch
                {
                    "credit-card"    => "Credit Card",
                    "debit-card"     => "Debit Card",
                    "online-banking" => "Online Banking",
                    "fpx"            => "FPX",
                    _                => raw ?? string.Empty
                };
        }
    }

    // ── Result types ───────────────────────────────────────────────────────────

    public class GetSalesRecordsResult
    {
        public List<SalesRecord> Records { get; set; } = new();
        public SalesSummary Summary { get; set; } = new();
    }

    public class SalesRecord
    {
        /// <summary>ProposalId — use as recordId for GET /api/sales/{recordId}</summary>
        public string Id { get; set; } = string.Empty;
        public string PolicyNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string ProductType { get; set; } = string.Empty;
        public string CoverageType { get; set; } = string.Empty;
        public decimal Premium { get; set; }
        public decimal Commission { get; set; }
        public DateTime SaleDate { get; set; }
        public DateTime? EffectiveDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string AgentName { get; set; } = string.Empty;
        public string AgentId { get; set; } = string.Empty;
        public DateTime? RenewalDate { get; set; }
    }

    public class SalesSummary
    {
        public int TotalSales { get; set; }
        public decimal TotalPremium { get; set; }
        public decimal TotalCommission { get; set; }
        public int ActivePolicies { get; set; }
        public int PendingPolicies { get; set; }
        public decimal AveragePremium { get; set; }

        /// <summary>Percentage of decided proposals (INFORCED + CANCELLED) that were INFORCED.</summary>
        public decimal ConversionRate { get; set; }

        /// <summary>Percentage change in total premium vs. the immediately preceding period of the same length.</summary>
        public decimal PremiumGrowthPct { get; set; }
    }
}
