using ApplicationService.Infrastructure.Persistence;
using ApplicationService.Infrastructure.Shared.HttpClients;
using ApplicationService.Core.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<PHApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("PHUnityDb")));
builder.Services.AddDbContext<IDApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("IDUnityDb")));
builder.Services.AddDbContext<KHApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("KHUnityDb")));

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

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<DbContextResolver>();
builder.Services.AddScoped<IApplicationRepository, RegionalApplicationRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

builder.Services.AddHttpClient("QuotationService", client =>
{
    var url = builder.Configuration["ServiceUrls:QuotationService"];
    client.BaseAddress = new Uri(url);
});

builder.Services.AddScoped<IQuotationServiceClient, QuotationServiceClient>();
var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();
app.Run();