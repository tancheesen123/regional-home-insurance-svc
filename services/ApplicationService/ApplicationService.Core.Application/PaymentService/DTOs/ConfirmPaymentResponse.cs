namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    public class ConfirmPaymentResponse
    {
        public string  PaymentId       { get; set; } = string.Empty;
        public string  ReferenceNumber { get; set; } = string.Empty;
        public string  PaymentStatus   { get; set; } = string.Empty;   // "SUCCESS"
        public string  ProposalId      { get; set; } = string.Empty;

        /// <summary>Frontend URL the browser should be redirected to after payment.</summary>
        public string  RedirectUrl     { get; set; } = string.Empty;

        public string  Message         { get; set; } = string.Empty;
    }
}
