namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class GetQuoteRequest
    {
        public string CustomerId { get; set; }
        public string OwnershipType { get; set; }       // "owner" | "tenant"
        public string CoverageStartDate { get; set; }   // DD/MM/YYYY
        public string PropertyType { get; set; }        // "landed" | "non-landed"
        public string? PropertySubType { get; set; }
        public int NumberOfStorey { get; set; }
        public string ConstructionType { get; set; }    // "full-brick" | "partial-brick"
        public string Postcode { get; set; }
        public string CurrentFlooding { get; set; }     // "yes" | "no"
        public string UnoccupiedProperty { get; set; }  // "yes" | "no"
        public string PreviousLoss { get; set; }        // "yes" | "no"
        public string? IdType { get; set; }
        public string? IdNumber { get; set; }
        public string? Nationality { get; set; }
        public string? DateOfBirth { get; set; }
    }
}
