namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    public class CancelPaymentResponse
    {
        public string ReferenceNumber { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
