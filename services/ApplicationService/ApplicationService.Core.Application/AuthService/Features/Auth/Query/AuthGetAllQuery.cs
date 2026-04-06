using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.AuthService.Features.Auth.Query
{
    public class AuthGetAllQuery : IRequest<Response<AuthGetAllResponse>>
    {
        public class AuthGetAllQueryHandler : IRequestHandler<AuthGetAllQuery, Response<AuthGetAllResponse>>
        {
            private readonly ILogger<AuthGetAllQueryHandler> _logger;
            private readonly IMapper _mapper;
            private readonly IAuthService _authService;

            public AuthGetAllQueryHandler(ILogger<AuthGetAllQueryHandler> logger,
                IMapper mapper,
                IAuthService authService)
            {
                _logger = logger;
                _mapper = mapper;
                _authService = authService;
            }

            public async Task<Response<AuthGetAllResponse>> Handle(AuthGetAllQuery request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start AuthGetAllQueryHandler ===");
                //if (string.IsNullOrEmpty(request.CountryCode))
                //{
                //    throw new ValidationException("Country Code cannot be empty!");
                //}
                AuthGetAllResponse retieveResult = await _authService.GetAllCustomerAsync();
                //RetrieveMotorProposalResponse response = new RetrieveMotorProposalResponse();
                //response = await _motorcarService.RetrieveMotorProposalAsync(retieveResult, true, false);
                return new Response<AuthGetAllResponse>(retieveResult);
            }
        }
    }
}
