using System.Net.Http;
using System.Net.Http.Json;
using ApplicationService.Core.Application.DTOs;
using ApplicationService.Core.Application.Interfaces;

namespace ApplicationService.Infrastructure.Shared.HttpClients
{
    public class QuotationServiceClient : IQuotationServiceClient
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public QuotationServiceClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<QuotationDto> GetQuotationAsync(Guid quotationId)
        {
            var client = _httpClientFactory.CreateClient("QuotationService");
            var response = await client.GetAsync($"/api/quotation/{quotationId}");

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Failed to get quotation: {response.StatusCode}");

            return await response.Content.ReadFromJsonAsync<QuotationDto>();
        }
    }
}