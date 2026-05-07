namespace ApplicationService.Core.Application.SalesService.DTOs
{
    public class GetSalesRecordsRequest
    {
        /// <summary>Filter: records on or after this date (inclusive). Null = no lower bound.</summary>
        public DateTime? DateFrom { get; set; }

        /// <summary>Filter: records on or before this date (inclusive). Null = no upper bound.</summary>
        public DateTime? DateTo { get; set; }

        /// <summary>Filter: "Active" | "Pending" | "Cancelled" | "Expired". Null = all statuses.</summary>
        public string? Status { get; set; }

        /// <summary>Filter: e.g. "Home Insurance". Null = all product types.</summary>
        public string? ProductType { get; set; }

        /// <summary>Free-text search across customer name, email and policy number.</summary>
        public string? Search { get; set; }
    }
}
