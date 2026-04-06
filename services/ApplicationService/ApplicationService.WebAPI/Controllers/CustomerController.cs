using MediatR;
using Microsoft.AspNetCore.Mvc;
using ApplicationService.Core.Application.AuthService.Features.Customer.Query;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;

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
            _mediator = mediator;
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

        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetById(Guid id)
        //{
        //    var application = await _repository.GetByIdAsync(id);
        //    if (application == null) return NotFound();
        //    return Ok(application);
        //}

        //[HttpPost]
        //public async Task<IActionResult> Create([FromBody] ApplicationEntity application)
        //{
        //    await _repository.AddAsync(application);
        //    await _repository.SaveChangesAsync();
        //    return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
        //}
    }
}