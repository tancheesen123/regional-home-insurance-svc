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

        [HttpPost("[action]/{customerId}")]
        public async Task<IActionResult> UpdateCustomerData(string customerId, [FromBody] UpdateCustomerRequest request)
        {
            var command = new UpdateCustomerCommand
            {
                CustomerId = customerId,
                Request    = request
            };
            return Ok(await _mediator.Send(command));
        }

        [HttpPost("[action]/{customerId}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadProfilePicture(string customerId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file was uploaded." });

            var command = new UploadProfilePictureCommand
            {
                CustomerId  = customerId,
                FileStream  = file.OpenReadStream(),
                FileName    = file.FileName,
                ContentType = file.ContentType,
                FileSize    = file.Length
            };

            return Ok(await _mediator.Send(command));
        }
    }
}
