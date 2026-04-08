using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApplicationService.Core.Application.AuthService.Features.Auth.Query;
using ApplicationService.Core.Application.AuthService.Features.Auth.Command;
using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using Microsoft.IdentityModel.Tokens;
using ApplicationService.Core.Application.ProfileService.Interfaces.Repositories;

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
                var result = await _mediator.Send(new LoginCommand
                {
                    Email    = request.Email,
                    Password = request.Password
                });
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _mediator.Send(new RegisterCommand
                {
                    Name     = request.Name,
                    Email    = request.Email,
                    Password = request.Password,
                    IcNumber = request.IcNumber,
                    Address  = request.Address,
                    Contact  = request.Contact,
                    Region   = request.Region
                });
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet("[action]")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token, [FromQuery] string email)
        {
            try
            {
                var result = await _mediator.Send(new VerifyEmailCommand { Token = token, Email = email });
                return Ok(new { message = "Email verified successfully. You can now log in." });
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
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