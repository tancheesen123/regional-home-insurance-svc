namespace ApplicationService.Core.Domain.Entities
{
    public class QuotationAddOn
    {
        public string QuotationId { get; set; } = string.Empty;
        public string AddOnId     { get; set; } = string.Empty;

        public Quotation Quotation { get; set; } = null!;
        public AddOn     AddOn     { get; set; } = null!;
    }
}
