using ApplicationService.Infrastructure.Shared.HttpClients;
using ApplicationService.WebAPI.Extensions;
using ApplicationService.WebAPI.Infrastructure;
using DotNetEnv;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.OpenApi.Models;

// Load .env before the configuration system builds so all
// environment variables are available to IConfiguration.
Env.TraversePath().Load();

// ── DinkToPdf native library bootstrap ───────────────────────────────────────
// libwkhtmltox.dll (Windows) / libwkhtmltox.so (Linux) must exist next to
// the executable.  Place the file in the project root and set:
//   Build Action  = Content
//   Copy to Output Directory = Copy always
// Download from: https://github.com/wkhtmltopdf/wkhtmltopdf/releases
//   → wkhtmltox-0.12.6-1.msvc2015-win64.exe (extract libwkhtmltox.dll)
var nativeLibName = OperatingSystem.IsWindows() ? "libwkhtmltox.dll" : "libwkhtmltox.so";
var nativeLibPath = Path.Combine(AppContext.BaseDirectory, nativeLibName);
if (File.Exists(nativeLibPath))
    new CustomAssemblyLoadContext().LoadUnmanagedLibrary(nativeLibPath);
else
    Console.WriteLine($"[WARNING] DinkToPdf native library not found at: {nativeLibPath}. PDF generation will fail.");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container — all endpoints require JWT by default
builder.Services.AddControllers(options =>
{
    options.Filters.Add(new AuthorizeFilter());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name         = "Authorization",
        Type         = SecuritySchemeType.Http,
        Scheme       = "Bearer",
        BearerFormat = "JWT",
        In           = ParameterLocation.Header,
        Description  = "Enter your JWT token. Example: eyJhbGci..."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddPersistenceServices(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddHttpClient("QuotationService", client =>
{
    var url = builder.Configuration["ServiceUrls:QuotationService"];
    client.BaseAddress = new Uri(url);
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowReact");
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();