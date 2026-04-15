using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApplicationService.Core.Application.AuthService.Features.Auth.Query;
using ApplicationService.Core.Application.AuthService.Features.Auth.Command;
using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Application.AuthService.Settings;
using Microsoft.Extensions.Options;
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
        private readonly JwtSettings _jwtSettings;

        public AuthController(
            ICustomerRepository repository,
            IMediator mediator,
            IOptions<JwtSettings> jwtSettings)
        {
            _repository   = repository;
            _mediator     = mediator;
            _jwtSettings  = jwtSettings.Value;
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
                    FirstName   = request.FirstName,
                    LastName    = request.LastName,
                    Email       = request.Email,
                    Password    = request.Password,
                    DateOfBirth = request.DateOfBirth,
                    Gender      = request.Gender,
                    Nationality = request.Nationality,
                    IdType      = request.IdType,
                    IdNumber    = request.IdNumber,
                    Contact     = request.Contact,
                    Region      = request.Region,
                    Address     = request.Address
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
                await _mediator.Send(new VerifyEmailCommand { Token = token, Email = email });

                return Redirect($"{_jwtSettings.FrontendUrl}?verified=true");
            }
            catch (SecurityTokenException)
            {
                return Redirect($"{_jwtSettings.FrontendUrl}?verified=false&error=invalid_token");
            }
            catch (KeyNotFoundException)
            {
                return Redirect($"{_jwtSettings.FrontendUrl}?verified=false&error=user_not_found");
            }
        }
    }
}
