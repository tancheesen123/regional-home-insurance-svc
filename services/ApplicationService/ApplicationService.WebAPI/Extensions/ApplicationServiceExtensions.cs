using ApplicationService.Core.Application.AuthService.Features.Auth.Query;
using ApplicationService.Core.Application.AuthService.Features.Auth.Command;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using ApplicationService.Core.Application.AuthService.Services;
using ApplicationService.Core.Application.AuthService.Settings;
using ApplicationService.Infrastructure.Shared.Email;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ApplicationService.Core.Application.ProfileService.Features.Customer.Query;
using ApplicationService.Core.Application.ProfileService.Interfaces.Services;
using ApplicationService.Core.Application.ProfileService.Mappings;
using ApplicationService.Core.Application.ProfileService.Services;
using ApplicationService.Core.Application.ProfileService.Settings;
using ApplicationService.Core.Application.PaymentService.Features.Payment.Command;
using ApplicationService.Core.Application.PaymentService.Interfaces.Services;
using ApplicationService.Core.Application.PaymentService.Services;
using ApplicationService.Core.Application.PaymentService.Settings;
using ApplicationService.Core.Application.ProposalService.Features.Proposal.Command;
using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using ApplicationService.Core.Application.ProposalService.Services;
using ApplicationService.Core.Application.QuotationService.Features.Quotation.Command;
using ApplicationService.Core.Application.QuotationService.Interfaces.Services;
using ApplicationService.Core.Application.QuotationService.Services;
using ApplicationService.Core.Application.ProductService.Features.Product.Command;
using ApplicationService.Core.Application.ProductService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProductService.Interfaces.Services;
using ApplicationService.Core.Application.InforcePolicyService.Features.InforcePolicy.Command;
using ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services;
using ApplicationService.Core.Application.InforcePolicyService.Services;
using ApplicationService.Core.Application.RateConfigService.Features.Command;
using ApplicationService.Core.Application.RateConfigService.Features.Query;
using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using ApplicationService.Core.Application.ProposalService.Settings;
using ApplicationService.Infrastructure.Persistence.Repositories;
using ApplicationService.Infrastructure.Shared.Services;
using DinkToPdf;
using DinkToPdf.Contracts;

namespace ApplicationService.WebAPI.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            // AutoMapper
            services.AddAutoMapper(cfg => cfg.AddProfile<CustomerMappingProfile>());

            // MediatR — queries & commands
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CustomerGetAllQuery).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(AuthGetAllQuery).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(LoginCommand).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(GetQuoteCommand).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateProposalCommand).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(InitiatePaymentCommand).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CalculatePremiumCommand).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(InforcePolicyCommand).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(SeedRateConfigCommand).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(GetBuildingConfigQuery).Assembly));

            // Services
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IQuotationService, QuotationService>();
            services.AddScoped<IProposalService, ProposalService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IStripeService, StripeService>();
            services.AddScoped<IProductService, ApplicationService.Core.Application.ProductService.Services.ProductService>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IInforcePolicyService, InforcePolicyService>();
            services.AddScoped<IInforceService, InforceService>();
            services.AddScoped<IProposalErrorService, ProposalErrorService>();
            // DinkToPdf: IConverter MUST be Singleton — wraps a non-reentrant native library.
            // PdfService is also Singleton because it holds the Singleton IConverter.
            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
            services.AddSingleton<IPdfService, PdfService>();
            services.AddScoped<INotificationEmailService, NotificationEmailService>();
            services.AddScoped<ISmsService, SmsService>();

            // Settings
            services.Configure<DocumentSettings>(configuration.GetSection("DocumentSettings"));
            services.Configure<NotificationEmailSettings>(configuration.GetSection("EmailSettings"));

            // Settings
            services.Configure<StripeSettings>(configuration.GetSection("StripeSettings"));

            // Settings
            services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
            services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));
            services.Configure<FileStorageSettings>(configuration.GetSection("FileStorageSettings"));

            // JWT Authentication
            var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>();
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer           = true,
                    ValidateAudience         = true,
                    ValidateLifetime         = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer              = jwtSettings.Issuer,
                    ValidAudience            = jwtSettings.Audience,
                    IssuerSigningKey         = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSettings.Secret))
                };
            });

            return services;
        }
    }
}
