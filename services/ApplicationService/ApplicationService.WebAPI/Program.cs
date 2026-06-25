using ApplicationService.Infrastructure.Shared.HttpClients;
using ApplicationService.WebAPI.Extensions;
using DotNetEnv;
using DinkToPdf;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.OpenApi.Models;
using System.Runtime.InteropServices;

Env.TraversePath().Load();

var baseDir = AppContext.BaseDirectory;

var wkCandidates = OperatingSystem.IsWindows()
    ? new[] { "libwkhtmltox.dll", "wkhtmltox.dll" }
    : new[] { "libwkhtmltox.so" };

var wkDllPath = wkCandidates
    .Select(f => Path.Combine(baseDir, f))
    .FirstOrDefault(File.Exists);

if (wkDllPath != null)
{
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
            .AllowAnyMethod()
            .WithExposedHeaders("Content-Disposition");
    });
});

builder.Services.AddHttpClient("QuotationService", client =>
{
    var url = builder.Configuration["ServiceUrls:QuotationService"];
    client.BaseAddress = new Uri(url);
});

var app = builder.Build();

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