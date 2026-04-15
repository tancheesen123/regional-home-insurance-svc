using MediatR;
using Microsoft.AspNetCore.Mvc;
using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Features.Customer.Command;
using ApplicationService.Core.Application.ProfileService.Features.Customer.Query;
using ApplicationService.Core.Application.ProfileService.Interfaces.Repositories;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _repository;
        private readonly IMediator _mediator;

        public CustomerController(
            ICustomerRepository repository,
            IMediator mediator)
        {
            _repository = repository;
            _mediator   = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _repository.GetAllAsync();
            return Ok(customers);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> CustomerGetAll([FromQuery] CustomerGetAllQuery filter)
        {
            return Ok(await _mediator.Send(filter));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetCustomerByUserId([FromBody] GetCustomerByUserIdQuery query)
        {
            return Ok(await _mediator.Send(query));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateCustomerData([FromBody] UpdateCustomerCommand command)
        {
            return Ok(await _mediator.Send(command));
        }

    }
}
