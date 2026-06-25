using ApplicationService.Core.Application.PaymentService.DTOs;

namespace ApplicationService.Core.Application.PaymentService.Interfaces.Services
{
    public interface IPaymentService
    {
        Task<InitiatePaymentResponse> InitiatePaymentAsync(InitiatePaymentRequest request, string region);

        Task<PaymentCallbackResponse> HandleCallbackAsync(string json, string stripeSignature);

        Task<ConfirmPaymentResponse> ConfirmPaymentAsync(string sessionId);

        Task<CancelPaymentResponse> CancelPaymentAsync(string referenceNumber);
    }
}
