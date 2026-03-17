using ApplicationService.Core.Application.Interfaces;
using ApplicationService.Infrastructure.Shared.HttpClients;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient("QuotationService", client =>
{
    client.BaseAddress = new Uri("http://localhost:55822");
});

builder.Services.AddScoped<IQuotationServiceClient, QuotationServiceClient>();
var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();