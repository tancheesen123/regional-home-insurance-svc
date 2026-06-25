namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    public class InitiatePaymentRequest
    {
        public string ProposalId { get; set; }

        public string PaymentMethod { get; set; } = "card";
    }
}
