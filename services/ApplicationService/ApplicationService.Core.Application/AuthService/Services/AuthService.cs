using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Application.AuthService.Features.Auth.Command;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using ApplicationService.Core.Application.AuthService.Settings;
using ApplicationService.Core.Domain.Entities;
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
        private readonly IEmailService _emailService;
        private readonly JwtSettings _jwtSettings;

        public AuthService(
            ILogger<AuthService> logger,
            IMapper mapper,
            IAuthRepository authRepository,
            IEmailService emailService,
            IOptions<JwtSettings> jwtSettings)
        {
            _logger = logger;
            _mapper = mapper;
            _authRepository = authRepository;
            _emailService = emailService;
            _jwtSettings = jwtSettings.Value;
        }

        // ── GetAll ────────────────────────────────────────────────────────────

        public async Task<AuthGetAllResponse> GetAllCustomerAsync()
        {
            _logger.LogInformation("=== AuthService.GetAllCustomerAsync ===");
            var auth = await _authRepository.GetAllAsync();
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

            if (!user.IsVerified)
                throw new UnauthorizedAccessException("Please verify your email before logging in.");

            var expiresAt = DateTime.UtcNow.AddHours(_jwtSettings.ExpiryHours);
            var token = GenerateJwtToken(user.UserId, user.Email, "auth", expiresAt);

            return new LoginResponse
            {
                Token     = token,
                UserId    = user.UserId,
                Email     = user.Email,
                ExpiresAt = expiresAt
            };
        }

        // ── Register ──────────────────────────────────────────────────────────

        public async Task<RegisterResponse> RegisterAsync(RegisterCommand request)
        {
            _logger.LogInformation("=== AuthService.RegisterAsync ===");

            // AF1: Email already registered
            var emailExists = await _authRepository.ExistsAsync(u => u.Email == request.Email);
            if (emailExists)
                throw new InvalidOperationException("Email already registered. Please log in or reset your password.");

            // Create UserAccount
            var userId = Guid.NewGuid().ToString();
            var userAccount = new UserAccount
            {
                UserId         = userId,
                Email          = request.Email,
                HashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password),
                IsVerified     = false
            };

            // Create Customer linked to UserAccount
            var customer = new Customer
            {
                CustomerId = Guid.NewGuid().ToString(),
                Name       = request.Name,
                Email      = request.Email,
                IcNumber   = request.IcNumber,
                Contact    = request.Contact,
                Region     = request.Region.ToUpper(),
                UserId     = userId,
                Address    = request.Address == null ? null : new AddressEntity
                {
                    Id           = Guid.NewGuid().ToString(),
                    AddressLine1 = request.Address.AddressLine1,
                    AddressLine2 = request.Address.AddressLine2,
                    City         = request.Address.City,
                    Postcode     = request.Address.Postcode,
                    State        = request.Address.State
                }
            };

            await _authRepository.RegisterAsync(userAccount, customer);

            // Generate verification JWT token (short-lived)
            var expiresAt = DateTime.UtcNow.AddHours(_jwtSettings.VerificationExpiryHours);
            var verificationToken = GenerateJwtToken(userId, request.Email, "email-verification", expiresAt);
            var verificationLink  = $"{_jwtSettings.BaseUrl}/api/auth/VerifyEmail?token={verificationToken}&email={Uri.EscapeDataString(request.Email)}";

            await _emailService.SendVerificationEmailAsync(request.Email, request.Name, verificationLink);

            return new RegisterResponse
            {
                UserId  = userId,
                Email   = request.Email,
                Message = "Registration successful. Please check your email to verify your account."
            };
        }

        // ── VerifyEmail ───────────────────────────────────────────────────────

        public async Task<bool> VerifyEmailAsync(string token, string email)
        {
            _logger.LogInformation("=== AuthService.VerifyEmailAsync ===");

            var principal = ValidateToken(token);
            if (principal == null)
                throw new SecurityTokenException("Invalid or expired verification link.");

            // Ensure this token is specifically a verification token
            var purpose = principal.FindFirst("purpose")?.Value;
            if (purpose != "email-verification")
                throw new SecurityTokenException("Invalid token purpose.");

            var userId = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                      ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                throw new SecurityTokenException("Invalid token claims.");

            // Validate email matches the token's email claim
            var tokenEmail = principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value
                          ?? principal.FindFirst(ClaimTypes.Email)?.Value;
            if (!string.Equals(tokenEmail, email, StringComparison.OrdinalIgnoreCase))
                throw new SecurityTokenException("Token does not match the provided email.");

            var user = await _authRepository.GetByIdAsync(userId!);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            if (user.IsVerified)
                return true; // Already verified — idempotent

            await _authRepository.UpdateIsVerifiedAsync(userId);

            return true;
        }

        // ── Helpers ───────────────────────────────────────────────────────────

        private string GenerateJwtToken(string userId, string email, string purpose, DateTime expiresAt)
        {
            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   userId),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
                new Claim("purpose",                     purpose)
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

        private ClaimsPrincipal? ValidateToken(string token)
        {
            try
            {
                var handler    = new JwtSecurityTokenHandler();
                var key        = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
                var parameters = new TokenValidationParameters
                {
                    ValidateIssuer           = true,
                    ValidateAudience         = true,
                    ValidateLifetime         = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer              = _jwtSettings.Issuer,
                    ValidAudience            = _jwtSettings.Audience,
                    IssuerSigningKey         = key
                };

                return handler.ValidateToken(token, parameters, out _);
            }
            catch
            {
                return null;
            }
        }
    }
}
