namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class GetQuoteResponse
    {
        public string QuotationId { get; set; }
        public string Status { get; set; }
        public decimal Premium { get; set; }
        public string CoverageStartDate { get; set; }
        public string ExpiryDate { get; set; }
        public string OwnershipType { get; set; }
        public string PropertyType { get; set; }
        public string? PropertySubType { get; set; }
        public int NumberOfStorey { get; set; }
        public string ConstructionType { get; set; }
        public string Postcode { get; set; }
        public string Region { get; set; }
    }
}
