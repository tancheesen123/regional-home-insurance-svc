using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using ApplicationService.Core.Application.AuthService.Settings;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ApplicationService.Core.Application.AuthService.Services
{
    public class AuthService : IAuthService
    {
        private readonly ILogger<AuthService> _logger;
        private readonly IMapper _mapper;
        private readonly IAuthRepository _authRepository;
        private readonly JwtSettings _jwtSettings;

        public AuthService(
            ILogger<AuthService> logger,
            IMapper mapper,
            IAuthRepository authRepository,
            IOptions<JwtSettings> jwtSettings)
        {
            _logger = logger;
            _mapper = mapper;
            _authRepository = authRepository;
            _jwtSettings = jwtSettings.Value;
        }

        public async Task<AuthGetAllResponse> GetAllCustomerAsync()
        {
            _logger.LogInformation("=== AuthService.GetAllCustomerAsync ===");

            var auth = await _authRepository.GetAllAuthAsync();

            return new AuthGetAllResponse
            {
                Auths = _mapper.Map<List<AuthDetail>>(auth)
            };
        }

        public async Task<LoginResponse> LoginAsync(string email, string password)
        {
            _logger.LogInformation("=== AuthService.LoginAsync ===");

            var user = await _authRepository.GetByEmailAsync(email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.HashedPassword))
                throw new UnauthorizedAccessException("Incorrect email or password.");

            var expiresAt = DateTime.UtcNow.AddHours(_jwtSettings.ExpiryHours);
            var token = GenerateJwtToken(user, expiresAt);

            return new LoginResponse
            {
                Token     = token,
                UserId    = user.UserId,
                Email     = user.Email,
                ExpiresAt = expiresAt
            };
        }

        private string GenerateJwtToken(Core.Domain.Entities.UserAccount user, DateTime expiresAt)
        {
            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   user.UserId),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer:             _jwtSettings.Issuer,
                audience:           _jwtSettings.Audience,
                claims:             claims,
                expires:            expiresAt,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
