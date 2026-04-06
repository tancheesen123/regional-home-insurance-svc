using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.AuthService.DTOs.Customer;
using AutoMapper;
using Azure;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;

namespace ApplicationService.Core.Application.AuthService.Features.Customer.Query
{
    public class CustomerGetAllQuery: IRequest<Response<CustomerGetAllResponse>>
    {
        public class CustomerGetAllQueryHandler : IRequestHandler<CustomerGetAllQuery, Response<CustomerGetAllResponse>>
        {
            private readonly ILogger<CustomerGetAllQueryHandler> _logger;
            private readonly IMapper _mapper;
            private readonly ICustomerService _customerService;

            public CustomerGetAllQueryHandler(ILogger<CustomerGetAllQueryHandler> logger,
                IMapper mapper,
                ICustomerService customerService)
            {
                _logger = logger;
                _mapper = mapper;
                _customerService = customerService;
            }

            public async Task<Response<CustomerGetAllResponse>> Handle(CustomerGetAllQuery request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start CustomerGetAllQueryHandler ===");
                //if (string.IsNullOrEmpty(request.CountryCode))
                //{
                //    throw new ValidationException("Country Code cannot be empty!");
                //}
                CustomerGetAllResponse retieveResult = await _customerService.GetAllCustomerAsync();
                //RetrieveMotorProposalResponse response = new RetrieveMotorProposalResponse();
                //response = await _motorcarService.RetrieveMotorProposalAsync(retieveResult, true, false);
                return new Response<CustomerGetAllResponse>(retieveResult);
            }
        }
    }
}
