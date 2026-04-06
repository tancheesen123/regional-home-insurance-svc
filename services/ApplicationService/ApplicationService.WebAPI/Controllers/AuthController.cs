using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApplicationService.Core.Application.AuthService.Features.Auth.Query;
using ApplicationService.Core.Application.AuthService.Features.Auth.Command;
using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ICustomerRepository _repository;
        private readonly IMediator _mediator;

        public AuthController(
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

        [AllowAnonymous]
        [HttpGet("[action]")]
        public async Task<IActionResult> AuthGetAll([FromQuery] AuthGetAllQuery filter)
        {
            return Ok(await _mediator.Send(filter));
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var command = new LoginCommand
                {
                    Email    = request.Email,
                    Password = request.Password
                };

                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
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