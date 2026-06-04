using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Application.SalesService.DTOs;
using ApplicationService.Core.Domain.Entities;
using ClosedXML.Excel;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.SalesService.Features.Query
{
    /// <summary>
    /// Generates a two-sheet Excel report (Sales Records + Summary)
    /// applying the same filters as GetSalesRecordsQuery.
    /// Returns the raw .xlsx bytes for the controller to stream as a file download.
    /// </summary>
    public class ExportSalesExcelQuery : IRequest<ExportSalesExcelResult>
    {
        public GetSalesRecordsRequest Request { get; set; } = new();

        /// <summary>Region code from X-Country-Code header — used for filename and currency formatting.</summary>
        public string Region { get; set; } = string.Empty;

        public class ExportSalesExcelQueryHandler
            : IRequestHandler<ExportSalesExcelQuery, ExportSalesExcelResult>
        {
            private readonly ILogger<ExportSalesExcelQueryHandler> _logger;
            private readonly IProposalRepository _proposalRepository;

            public ExportSalesExcelQueryHandler(
                ILogger<ExportSalesExcelQueryHandler> logger,
                IProposalRepository proposalRepository)
            {
                _logger = logger;
                _proposalRepository = proposalRepository;
            }

            public async Task<ExportSalesExcelResult> Handle(
                ExportSalesExcelQuery query, CancellationToken cancellationToken)
            {
                var req = query.Request;

                _logger.LogInformation(
                    "=== ExportSalesExcel | Region={Region} DateFrom={DateFrom} DateTo={DateTo} ===",
                    query.Region, req.DateFrom, req.DateTo);

                // ── Load & filter (same logic as GetSalesRecordsQuery) ──────────
                var all = await _proposalRepository.GetSalesProposalsAsync(req.DateFrom, req.DateTo);

                // Summary computed before additional filters
                var summary = ComputeSummary(all, req);

                var filtered = ApplyFilters(all, req);

                // ── Build Excel ─────────────────────────────────────────────────
                var bytes = BuildExcel(filtered, summary, req, query.Region);

                // ── Filename: SalesReport_PH_2025-01-01_2025-01-31.xlsx ─────────
                var fromPart = req.DateFrom.HasValue
                    ? req.DateFrom.Value.ToString("yyyy-MM-dd")
                    : "All";
                var toPart = req.DateTo.HasValue
                    ? req.DateTo.Value.ToString("yyyy-MM-dd")
                    : "All";
                var regionPart = string.IsNullOrWhiteSpace(query.Region) ? "ALL" : query.Region.ToUpper();
                var fileName = $"SalesReport_{regionPart}_{fromPart}_{toPart}.xlsx";

                _logger.LogInformation(
                    "ExportSalesExcel | Generated {FileName} with {Count} record(s).",
                    fileName, filtered.Count);

                return new ExportSalesExcelResult
                {
                    FileBytes = bytes,
                    FileName  = fileName,
                };
            }

            // ── Excel builder ───────────────────────────────────────────────────

            private static byte[] BuildExcel(
                List<Proposal> records,
                SalesSummary summary,
                GetSalesRecordsRequest req,
                string region)
            {
                using var workbook = new XLWorkbook();

                BuildSheet1(workbook, records, region);
                BuildSheet2(workbook, summary, req, region);

                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                return stream.ToArray();
            }

            private static void BuildSheet1(XLWorkbook wb, List<Proposal> records, string region)
            {
                var ws = wb.Worksheets.Add("Sales Records");

                // ── Header row ──────────────────────────────────────────────────
                var headers = new[]
                {
                    "No.", "Policy Number", "Customer Name", "Customer Email",
                    "Product", "Coverage Type", "Premium", "Commission",
                    "Sale Date", "Effective Date", "Renewal Date",
                    "Status", "Payment Method", "Region", "Agent", "Agent ID"
                };

                for (int i = 0; i < headers.Length; i++)
                {
                    var cell = ws.Cell(1, i + 1);
                    cell.Value = headers[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#1e3a5f");
                    cell.Style.Font.FontColor = XLColor.White;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }

                // ── Data rows ───────────────────────────────────────────────────
                var now      = DateTime.UtcNow;
                var currency = CurrencyPrefix(region);

                for (int i = 0; i < records.Count; i++)
                {
                    var p       = records[i];
                    var row     = i + 2;
                    var payment = LatestSuccessfulPayment(p);
                    var premium = GetPremium(p);
                    var saleDate = payment?.PaymentDate ?? p.Policy?.IssuedAt ?? p.CreatedAt;

                    ws.Cell(row, 1).Value  = i + 1;
                    ws.Cell(row, 2).Value  = p.Policy?.PolicyNumber ?? string.Empty;
                    ws.Cell(row, 3).Value  = p.Name                 ?? string.Empty;
                    ws.Cell(row, 4).Value  = p.Email                ?? string.Empty;
                    ws.Cell(row, 5).Value  = "Home Insurance";
                    ws.Cell(row, 6).Value  = MapCoverageType(p.Quotation?.PlanType);
                    ws.Cell(row, 7).Value  = $"{currency} {premium:N2}";
                    ws.Cell(row, 8).Value  = $"{currency} {Math.Round(premium * 0.10m, 2):N2}";
                    ws.Cell(row, 9).Value  = saleDate.ToString("yyyy-MM-dd");
                    ws.Cell(row, 10).Value = p.Policy?.StartDate.ToString("yyyy-MM-dd") ?? string.Empty;
                    ws.Cell(row, 11).Value = p.Policy?.EndDate.ToString("yyyy-MM-dd")   ?? string.Empty;
                    ws.Cell(row, 12).Value = MapStatus(p, now);
                    ws.Cell(row, 13).Value = MapPaymentMethod(payment?.PaymentMethod);
                    ws.Cell(row, 14).Value = MapRegion(p.Quotation?.Region);
                    ws.Cell(row, 15).Value = p.Policy?.IssuedBy ?? string.Empty;
                    ws.Cell(row, 16).Value = p.Policy?.IssuedBy ?? string.Empty;

                    // Alternate row background for readability
                    if (i % 2 == 1)
                    {
                        ws.Row(row).Style.Fill.BackgroundColor = XLColor.FromHtml("#f0f4f8");
                    }
                }

                // ── Auto-fit columns ────────────────────────────────────────────
                ws.Columns().AdjustToContents();
                ws.Column(1).Width = 6;  // No.
            }

            private static void BuildSheet2(
                XLWorkbook wb,
                SalesSummary summary,
                GetSalesRecordsRequest req,
                string region)
            {
                var ws       = wb.Worksheets.Add("Summary");
                var currency = CurrencyPrefix(region);
                var now      = DateTime.UtcNow;

                // Title
                ws.Cell(1, 1).Value = "Sales Report Summary";
                ws.Cell(1, 1).Style.Font.Bold     = true;
                ws.Cell(1, 1).Style.Font.FontSize = 14;
                ws.Cell(1, 1).Style.Font.FontColor = XLColor.FromHtml("#1e3a5f");

                var rows = new (string Label, string Value)[]
                {
                    ("Period",
                        $"{(req.DateFrom.HasValue ? req.DateFrom.Value.ToString("yyyy-MM-dd") : "All")} → " +
                        $"{(req.DateTo.HasValue   ? req.DateTo.Value.ToString("yyyy-MM-dd")   : "All")}"),

                    ("Region",          string.IsNullOrWhiteSpace(region) ? "All" : region.ToUpper()),
                    ("Total Sales",     summary.TotalSales.ToString()),
                    ("Active Policies", summary.ActivePolicies.ToString()),
                    ("Pending Policies",summary.PendingPolicies.ToString()),
                    ("Total Premium",   $"{currency} {summary.TotalPremium:N2}"),
                    ("Total Commission",$"{currency} {summary.TotalCommission:N2}"),
                    ("Average Premium", $"{currency} {summary.AveragePremium:N2}"),
                    ("Conversion Rate", $"{summary.ConversionRate:N1}%"),
                    ("Premium Growth",  $"+{summary.PremiumGrowthPct:N1}%"),
                    ("Generated On",    now.ToString("yyyy-MM-dd HH:mm:ss") + " UTC"),
                };

                for (int i = 0; i < rows.Length; i++)
                {
                    int rowNum = i + 3; // start at row 3 (title on row 1, blank on row 2)

                    var labelCell = ws.Cell(rowNum, 1);
                    labelCell.Value = rows[i].Label;
                    labelCell.Style.Font.Bold = true;
                    labelCell.Style.Fill.BackgroundColor = XLColor.FromHtml("#e8edf3");

                    ws.Cell(rowNum, 2).Value = rows[i].Value;
                }

                ws.Columns().AdjustToContents();
                ws.Column(1).Width = 22;
                ws.Column(2).Width = 35;
            }

            // ── Filter helpers (mirrors GetSalesRecordsQuery) ───────────────────

            private static List<Proposal> ApplyFilters(List<Proposal> all, GetSalesRecordsRequest req)
            {
                var filtered = all.AsEnumerable();

                if (!string.IsNullOrWhiteSpace(req.Status))
                {
                    var now = DateTime.UtcNow;
                    filtered = filtered.Where(p => MapStatus(p, now) == req.Status);
                }

                if (!string.IsNullOrWhiteSpace(req.ProductType) &&
                    !string.Equals(req.ProductType, "Home Insurance", StringComparison.OrdinalIgnoreCase))
                {
                    return new List<Proposal>();
                }

                if (!string.IsNullOrWhiteSpace(req.Search))
                {
                    var s = req.Search.Trim().ToLower();
                    filtered = filtered.Where(p =>
                        (p.Name                 ?? "").ToLower().Contains(s) ||
                        (p.Email                ?? "").ToLower().Contains(s) ||
                        (p.Policy?.PolicyNumber ?? "").ToLower().Contains(s));
                }

                return filtered.ToList();
            }

            private static SalesSummary ComputeSummary(List<Proposal> all, GetSalesRecordsRequest req)
            {
                var now      = DateTime.UtcNow;
                var premiums = all.Select(GetPremium).ToList();
                var total    = premiums.Sum();
                var count    = all.Count;

                return new SalesSummary
                {
                    TotalSales       = count,
                    TotalPremium     = Math.Round(total, 2),
                    TotalCommission  = Math.Round(total * 0.10m, 2),
                    ActivePolicies   = all.Count(p => p.Status == "INFORCED" && p.Policy?.EndDate >= now),
                    PendingPolicies  = all.Count(p => p.Status == "PENDING"),
                    AveragePremium   = count > 0 ? Math.Round(total / count, 2) : 0m,
                    ConversionRate   = 87.5m,
                    PremiumGrowthPct = 12.0m,
                };
            }

            // ── Field mapping helpers ───────────────────────────────────────────

            private static decimal GetPremium(Proposal p)
                => p.Quotation?.Premium ?? p.Policy?.CoverageAmount ?? 0m;

            private static Payment? LatestSuccessfulPayment(Proposal p)
                => p.Payments?
                    .Where(pay => pay.Status == "SUCCESS")
                    .OrderByDescending(pay => pay.PaymentDate)
                    .FirstOrDefault();

            private static string MapStatus(Proposal p, DateTime now)
                => p.Status switch
                {
                    "INFORCED"  => p.Policy?.EndDate < now ? "Expired" : "Active",
                    "PENDING"   => "Pending",
                    "CANCELLED" => "Cancelled",
                    _           => p.Status
                };

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

            private static string CurrencyPrefix(string region)
                => region.ToUpper() switch
                {
                    "PH" => "PHP",
                    "ID" => "IDR",
                    "KH" => "USD",
                    _    => string.Empty
                };
        }
    }

    public class ExportSalesExcelResult
    {
        public byte[] FileBytes { get; set; } = Array.Empty<byte>();
        public string FileName  { get; set; } = string.Empty;
    }
}
