using Microsoft.AspNetCore.Mvc;
using ApplicationService.Core.Domain.Entities;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationRepository _repository;
        private readonly IQuotationServiceClient _quotationClient;

        public ApplicationController(
            IApplicationRepository repository,
            IQuotationServiceClient quotationClient)
        {
            _repository = repository;
            _quotationClient = quotationClient;
        }



    }
}