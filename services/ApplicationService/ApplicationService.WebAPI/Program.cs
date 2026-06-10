using ApplicationService.Infrastructure.Shared.HttpClients;
using ApplicationService.WebAPI.Extensions;
using DotNetEnv;
using DinkToPdf;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.OpenApi.Models;
using System.Runtime.InteropServices;

// Load .env before the configuration system builds so all
// environment variables are available to IConfiguration.
Env.TraversePath().Load();

// ── DinkToPdf native library bootstrap ───────────────────────────────────────
// DinkToPdf's P/Invoke looks for "libwkhtmltox", but the Windows installer
// ships the file as "wkhtmltox.dll" (no lib prefix).
// NativeLibrary.SetDllImportResolver is the correct .NET 5+ way to intercept
// and redirect P/Invoke calls — CustomAssemblyLoadContext does NOT work for this.
//
// File setup:
//   Windows : place wkhtmltox.dll  OR  libwkhtmltox.dll next to the executable
//   Linux   : place libwkhtmltox.so next to the executable
//   Download: https://wkhtmltopdf.org/downloads.html
//             → wkhtmltox-0.12.6-1.msvc2015-win64.exe  (extract wkhtmltox.dll)
var baseDir = AppContext.BaseDirectory;

// Accept either naming convention so the installer DLL works without renaming
var wkCandidates = OperatingSystem.IsWindows()
    ? new[] { "libwkhtmltox.dll", "wkhtmltox.dll" }
    : new[] { "libwkhtmltox.so" };

var wkDllPath = wkCandidates
    .Select(f => Path.Combine(baseDir, f))
    .FirstOrDefault(File.Exists);

if (wkDllPath != null)
{
    // Redirect every P/Invoke for "libwkhtmltox" to the actual file on disk
    NativeLibrary.SetDllImportResolver(
        typeof(PdfTools).Assembly,
        (libraryName, _, _) =>
            libraryName == "libwkhtmltox"
                ? NativeLibrary.Load(wkDllPath)
                : IntPtr.Zero);

    Console.WriteLine($"[DinkToPdf] Native library loaded from: {wkDllPath}");
}
else
{
    Console.WriteLine($"[DinkToPdf] WARNING — native library not found in: {baseDir}");
    Console.WriteLine($"[DinkToPdf]   Searched: {string.Join(", ", wkCandidates)}");
    Console.WriteLine($"[DinkToPdf]   PDF generation will fail until the file is placed there.");
}

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
                "https://localhost:3000",
                "https://regional-home-insurance-frontend.vercel.app"
            )
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .WithOrigins("https://*.vercel.app")
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