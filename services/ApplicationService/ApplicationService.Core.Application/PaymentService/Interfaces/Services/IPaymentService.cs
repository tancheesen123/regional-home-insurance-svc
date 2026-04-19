using ApplicationService.Core.Application.PaymentService.DTOs;

namespace ApplicationService.Core.Application.PaymentService.Interfaces.Services
{
    public interface IPaymentService
    {
        /// <param name="region">Country code from X-Country-Code header: PH | ID | KH</param>
        Task<InitiatePaymentResponse> InitiatePaymentAsync(InitiatePaymentRequest request, string region);

        /// <summary>
        /// Verifies the Stripe webhook signature, then processes
        /// checkout.session.completed (SUCCESS → Inforce) or
        /// checkout.session.expired (EXPIRED → Failed).
        /// </summary>
        Task<PaymentCallbackResponse> HandleCallbackAsync(string json, string stripeSignature);

        /// <summary>
        /// Called by the backend redirect endpoint after Stripe redirects the customer.
        /// Verifies payment_status == "paid" with Stripe, updates Payment → SUCCESS,
        /// inforces the Proposal, creates the Policy, and returns the frontend redirect URL.
        /// </summary>
        Task<ConfirmPaymentResponse> ConfirmPaymentAsync(string sessionId);
    }
}
