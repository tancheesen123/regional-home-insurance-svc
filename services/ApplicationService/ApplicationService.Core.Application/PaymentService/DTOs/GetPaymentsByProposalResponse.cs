namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    public class GetPaymentsByProposalRequest
    {
        public string ProposalId { get; set; } = string.Empty;
    }

    public class GetPaymentsByProposalResponse
    {
        public string ProposalId { get; set; } = string.Empty;
        public List<PaymentSummaryDto> Payments { get; set; } = new();
    }

    public class PaymentSummaryDto
    {
        public string PaymentId { get; set; } = string.Empty;
        public string ReferenceNumber { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? PaymentMethod { get; set; }
        public string? GatewayName { get; set; }
        public string? TransactionId { get; set; }
        public string? PaymentUrl { get; set; }
        public string? ExpiresAt { get; set; }
        public string PaymentDate { get; set; } = string.Empty;
    }
}
