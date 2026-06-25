namespace ApplicationService.Core.Application.SalesService.DTOs
{
    public class GetSalesRecordsRequest
    {
        public DateTime? DateFrom { get; set; }

        public DateTime? DateTo { get; set; }

        public string? Status { get; set; }

        public string? ProductType { get; set; }

        public string? Search { get; set; }
    }
}
