using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.SalesService.Features.Query
{
    /// <summary>
    /// Returns the full detail of a single sales record identified by its ProposalId.
    /// </summary>
    public class GetSalesRecordDetailQuery : IRequest<GetSalesRecordDetailResult>
    {
        /// <summary>ProposalId returned as "id" in the sales records list.</summary>
        public string RecordId { get; set; } = string.Empty;

        public class GetSalesRecordDetailQueryHandler
            : IRequestHandler<GetSalesRecordDetailQuery, GetSalesRecordDetailResult>
        {
            private readonly ILogger<GetSalesRecordDetailQueryHandler> _logger;
            private readonly IProposalRepository _proposalRepository;

            public GetSalesRecordDetailQueryHandler(
                ILogger<GetSalesRecordDetailQueryHandler> logger,
                IProposalRepository proposalRepository)
            {
                _logger = logger;
                _proposalRepository = proposalRepository;
            }

            public async Task<GetSalesRecordDetailResult> Handle(
                GetSalesRecordDetailQuery query, CancellationToken cancellationToken)
            {
                _logger.LogInformation(
                    "=== GetSalesRecordDetail | RecordId={RecordId} ===", query.RecordId);

                var p = await _proposalRepository.GetSalesRecordByProposalIdAsync(query.RecordId);
                if (p == null)
                    throw new KeyNotFoundException($"Sales record '{query.RecordId}' not found.");

                var payment  = LatestSuccessfulPayment(p);
                var premium  = GetPremium(p);
                var q        = p.Quotation;
                var now      = DateTime.UtcNow;

                // ── Customer info ──────────────────────────────────────────────
                var address = string.Join(", ", new[]
                {
                    p.PropAddressLine1,
                    p.PropAddressLine2,
                    p.PropCity,
                    p.PropState,
                    p.PropCountry,
                }.Where(s => !string.IsNullOrWhiteSpace(s)));

                var customerInfo = new SalesCustomerInfo
                {
                    Name        = p.Name         ?? string.Empty,
                    Email       = p.Email        ?? string.Empty,
                    Phone       = p.MobileNumber ?? string.Empty,
                    Address     = address,
                    DateOfBirth = p.DateOfBirth  ?? string.Empty,
                    IdNumber    = p.IdNumber     ?? string.Empty,
                    IdType      = p.IdType       ?? string.Empty,
                };

                // ── Policy details ─────────────────────────────────────────────
                var statusStr = p.Status switch
                {
                    "INFORCED"  => p.Policy?.EndDate < now ? "Expired" : "Active",
                    "PENDING"   => "Pending",
                    "CANCELLED" => "Cancelled",
                    _           => p.Status
                };

                var policyDetails = new SalesPolicyDetails
                {
                    ProductType    = "Home Insurance",
                    CoverageType   = MapCoverageType(p.Quotation?.PlanType),
                    BuildingAmount = p.Quotation?.BuildingSum ?? 0m,
                    ContentAmount  = p.Quotation?.ContentsSum ?? 0m,
                    EffectiveDate  = p.Policy?.StartDate.ToString("yyyy-MM-dd") ?? string.Empty,
                    ExpiryDate     = p.Policy?.EndDate.ToString("yyyy-MM-dd")   ?? string.Empty,
                    RenewalDate    = p.Policy?.EndDate.ToString("yyyy-MM-dd")   ?? string.Empty,
                    Status         = statusStr,
                };

                // ── Financial info ─────────────────────────────────────────────
                var commission = Math.Round(premium * 0.10m, 2);
                var taxes      = q?.TaxAmount  ?? 0m;
                var fees       = q?.StampDuty  ?? 0m;
                var totalAmt   = payment?.Amount ?? q?.Premium ?? premium;

                var paymentStatus = payment?.Status?.ToUpper() switch
                {
                    "SUCCESS" => "Paid",
                    "FAILED"  => "Failed",
                    "PENDING" => "Pending",
                    _         => payment?.Status ?? "Pending"
                };

                var financialInfo = new SalesFinancialInfo
                {
                    Premium        = premium,
                    Commission     = commission,
                    CommissionRate = 10,
                    Taxes          = Math.Round(taxes, 2),
                    Fees           = Math.Round(fees, 2),
                    TotalAmount    = Math.Round(totalAmt, 2),
                    PaymentMethod  = MapPaymentMethod(payment?.PaymentMethod),
                    PaymentStatus  = paymentStatus,
                    PaymentDate    = payment?.PaymentDate.ToString("yyyy-MM-dd") ?? string.Empty,
                    TransactionId  = payment?.TransactionId ?? payment?.ReferenceNumber ?? string.Empty,
                };

                // ── Sales info ─────────────────────────────────────────────────
                var saleDate = payment?.PaymentDate ?? p.Policy?.IssuedAt ?? p.CreatedAt;

                var salesInfo = new SalesSalesInfo
                {
                    SaleDate   = saleDate.ToString("yyyy-MM-dd"),
                    AgentName  = p.Policy?.IssuedBy ?? string.Empty,
                    AgentId    = p.Policy?.IssuedBy ?? string.Empty,
                    AgentEmail = string.Empty,   // not stored — extend Agent entity if needed
                    AgentPhone = string.Empty,   // not stored — extend Agent entity if needed
                    Region     = MapRegion(p.Quotation?.Region),
                    Branch     = string.Empty,   // not stored — extend if needed
                    Channel    = "Online",
                };

                // ── Documents ──────────────────────────────────────────────────
                var documents = DeserializeDocuments(p.Policy?.DocumentsJson)
                    .Select(d => new SalesDocument
                    {
                        Id         = d.DocumentId,
                        Name       = MapDocumentName(d.FileType),
                        FileType   = d.FileType,
                        FileName   = d.FileName,
                        UploadedAt = d.UploadedAt,
                    })
                    .ToList();

                // ── Timeline ───────────────────────────────────────────────────
                var timeline = BuildTimeline(p, payment);

                _logger.LogInformation(
                    "GetSalesRecordDetail | RecordId={RecordId} PolicyNumber={PolicyNumber}",
                    query.RecordId, p.Policy?.PolicyNumber ?? "N/A");

                return new GetSalesRecordDetailResult
                {
                    Id            = p.ProposalId,
                    PolicyNumber  = p.Policy?.PolicyNumber ?? string.Empty,
                    CustomerInfo  = customerInfo,
                    PolicyDetails = policyDetails,
                    FinancialInfo = financialInfo,
                    SalesInfo     = salesInfo,
                    Documents     = documents,
                    Timeline      = timeline,
                };
            }

            // ── Helpers ────────────────────────────────────────────────────────

            private static List<SalesTimelineEvent> BuildTimeline(Proposal p, Payment? payment)
            {
                var events = new List<SalesTimelineEvent>
                {
                    new()
                    {
                        Date        = p.CreatedAt,
                        Event       = "Application Submitted",
                        Description = "Customer submitted online application",
                        Status      = "completed",
                    }
                };

                if (payment != null)
                {
                    events.Add(new SalesTimelineEvent
                    {
                        Date        = payment.PaymentDate,
                        Event       = "Payment Received",
                        Description = $"Payment of {payment.Currency} {payment.Amount:N2} confirmed",
                        Status      = payment.Status == "SUCCESS" ? "completed" : "pending",
                    });
                }

                if (p.Policy != null)
                {
                    events.Add(new SalesTimelineEvent
                    {
                        Date        = p.Policy.IssuedAt,
                        Event       = "Policy Issued",
                        Description = "Policy certificate generated and sent",
                        Status      = "completed",
                    });

                    if (p.Policy.HasFullDocument)
                    {
                        events.Add(new SalesTimelineEvent
                        {
                            Date        = p.Policy.IssuedAt,
                            Event       = "Documents Ready",
                            Description = "All policy documents (PDS, ePolicy, Tax Invoice) generated",
                            Status      = "completed",
                        });
                    }
                }

                return events.OrderBy(e => e.Date).ToList();
            }

            private static decimal GetPremium(Proposal p)
                => p.Quotation?.Premium
                ?? p.Policy?.CoverageAmount
                ?? 0m;

            private static List<DocEntry> DeserializeDocuments(string? json)
            {
                if (string.IsNullOrWhiteSpace(json)) return new List<DocEntry>();
                try { return System.Text.Json.JsonSerializer.Deserialize<List<DocEntry>>(json, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new(); }
                catch { return new List<DocEntry>(); }
            }

            private class DocEntry
            {
                public string   DocumentId { get; set; } = string.Empty;
                public string   FileType   { get; set; } = string.Empty;
                public string   FileName   { get; set; } = string.Empty;
                public DateTime UploadedAt { get; set; }
            }

            private static Payment? LatestSuccessfulPayment(Proposal p)
                => p.Payments?
                    .Where(pay => pay.Status == "SUCCESS")
                    .OrderByDescending(pay => pay.PaymentDate)
                    .FirstOrDefault();

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

            private static string MapDocumentName(string? fileType)
                => fileType?.ToUpper() switch
                {
                    "PDS"         => "Product Disclosure Sheet",
                    "EPOLICY"     => "Policy Certificate",
                    "TAXINVOICE"  => "Tax Invoice",
                    "PDS_LOCAL"   => "Product Disclosure Sheet (Local)",
                    "EPOLICY_LOCAL"    => "Policy Certificate (Local)",
                    "TAXINVOICE_LOCAL" => "Tax Invoice (Local)",
                    _             => fileType ?? string.Empty
                };
        }
    }

    // ── Result types ───────────────────────────────────────────────────────────

    public class GetSalesRecordDetailResult
    {
        public string Id { get; set; } = string.Empty;
        public string PolicyNumber { get; set; } = string.Empty;
        public SalesCustomerInfo CustomerInfo { get; set; } = new();
        public SalesPolicyDetails PolicyDetails { get; set; } = new();
        public SalesFinancialInfo FinancialInfo { get; set; } = new();
        public SalesSalesInfo SalesInfo { get; set; } = new();
        public List<SalesDocument> Documents { get; set; } = new();
        public List<SalesTimelineEvent> Timeline { get; set; } = new();
    }

    public class SalesCustomerInfo
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string DateOfBirth { get; set; } = string.Empty;
        public string IdNumber { get; set; } = string.Empty;
        public string IdType { get; set; } = string.Empty;
    }

    public class SalesPolicyDetails
    {
        public string ProductType { get; set; } = string.Empty;
        public string CoverageType { get; set; } = string.Empty;
        public decimal BuildingAmount { get; set; }
        public decimal ContentAmount { get; set; }
        public string EffectiveDate { get; set; } = string.Empty;
        public string ExpiryDate { get; set; } = string.Empty;
        public string RenewalDate { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class SalesFinancialInfo
    {
        public decimal Premium { get; set; }
        public decimal Commission { get; set; }
        public int CommissionRate { get; set; }
        public decimal Taxes { get; set; }
        public decimal Fees { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string PaymentDate { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
    }

    public class SalesSalesInfo
    {
        public string SaleDate { get; set; } = string.Empty;
        public string AgentName { get; set; } = string.Empty;
        public string AgentId { get; set; } = string.Empty;
        public string AgentEmail { get; set; } = string.Empty;
        public string AgentPhone { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string Branch { get; set; } = string.Empty;
        public string Channel { get; set; } = string.Empty;
    }

    public class SalesDocument
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
    }

    public class SalesTimelineEvent
    {
        public DateTime Date { get; set; }
        public string Event { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        /// <summary>"completed" | "pending"</summary>
        public string Status { get; set; } = string.Empty;
    }
}
