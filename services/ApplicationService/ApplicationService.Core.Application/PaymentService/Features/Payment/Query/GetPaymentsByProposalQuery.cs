using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.PaymentService.DTOs;
using ApplicationService.Core.Application.PaymentService.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.PaymentService.Features.Payment.Query
{
    public class GetPaymentsByProposalQuery : IRequest<Response<GetPaymentsByProposalResponse>>
    {
        public GetPaymentsByProposalRequest Request { get; set; } = new();

        public class GetPaymentsByProposalQueryHandler
            : IRequestHandler<GetPaymentsByProposalQuery, Response<GetPaymentsByProposalResponse>>
        {
            private readonly ILogger<GetPaymentsByProposalQueryHandler> _logger;
            private readonly IPaymentRepository _paymentRepository;

            public GetPaymentsByProposalQueryHandler(
                ILogger<GetPaymentsByProposalQueryHandler> logger,
                IPaymentRepository paymentRepository)
            {
                _logger            = logger;
                _paymentRepository = paymentRepository;
            }

            public async Task<Response<GetPaymentsByProposalResponse>> Handle(
                GetPaymentsByProposalQuery query, CancellationToken cancellationToken)
            {
                _logger.LogInformation(
                    "=== GetPaymentsByProposalQueryHandler | ProposalId={ProposalId} ===",
                    query.Request.ProposalId);

                var payments = await _paymentRepository.GetByProposalIdAsync(query.Request.ProposalId);

                if (payments.Count == 0)
                    throw new KeyNotFoundException(
                        $"No payments found for proposal '{query.Request.ProposalId}'.");

                var result = new GetPaymentsByProposalResponse
                {
                    ProposalId = query.Request.ProposalId,
                    Payments   = payments.Select(p => new PaymentSummaryDto
                    {
                        PaymentId       = p.PaymentId,
                        ReferenceNumber = p.ReferenceNumber,
                        Amount          = p.Amount,
                        Currency        = p.Currency,
                        Status          = p.Status,
                        PaymentMethod   = p.PaymentMethod,
                        GatewayName     = p.GatewayName,
                        TransactionId   = p.TransactionId,
                        PaymentUrl      = p.PaymentUrl,
                        ExpiresAt       = p.ExpiresAt?.ToString("dd/MM/yyyy HH:mm:ss"),
                        PaymentDate     = p.PaymentDate.ToString("dd/MM/yyyy HH:mm:ss")
                    }).ToList()
                };

                return new Response<GetPaymentsByProposalResponse>(result);
            }
        }
    }
}
