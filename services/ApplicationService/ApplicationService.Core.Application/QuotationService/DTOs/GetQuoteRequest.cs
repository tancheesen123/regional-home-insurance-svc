namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class GetQuoteRequest
    {
        public string CustomerId { get; set; }
        public string OwnershipType { get; set; }
        public string CoverageStartDate { get; set; }
        public string PropertyType { get; set; }
        public string? PropertySubType { get; set; }
        public int NumberOfStorey { get; set; }
        public string ConstructionType { get; set; }
        public string Postcode { get; set; }
        public string CurrentFlooding { get; set; }
        public string UnoccupiedProperty { get; set; }
        public string PreviousLoss { get; set; }
        public string? IdType { get; set; }
        public string? IdNumber { get; set; }
        public string? Nationality { get; set; }
        public string? DateOfBirth { get; set; }
    }
}
