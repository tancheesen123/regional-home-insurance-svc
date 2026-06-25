namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    public class ConfirmPaymentResponse
    {
        public string  PaymentId       { get; set; } = string.Empty;
        public string  ReferenceNumber { get; set; } = string.Empty;
        public string  PaymentStatus   { get; set; } = string.Empty;
        public string  ProposalId      { get; set; } = string.Empty;

        public string  PolicyId        { get; set; } = string.Empty;
        public string  PolicyNumber    { get; set; } = string.Empty;

        public string  RedirectUrl     { get; set; } = string.Empty;

        public string  Message         { get; set; } = string.Empty;
    }
}
