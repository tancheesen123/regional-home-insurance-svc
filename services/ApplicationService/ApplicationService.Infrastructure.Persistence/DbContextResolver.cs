using Microsoft.AspNetCore.Http;

namespace ApplicationService.Infrastructure.Persistence
{
    public class DbContextResolver
    {
        private readonly PHApplicationDbContext _phContext;
        private readonly IDApplicationDbContext _idContext;
        private readonly KHApplicationDbContext _khContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DbContextResolver(
            PHApplicationDbContext phContext,
            IDApplicationDbContext idContext,
            KHApplicationDbContext khContext,
            IHttpContextAccessor httpContextAccessor)
        {
            _phContext = phContext;
            _idContext = idContext;
            _khContext = khContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public ApplicationDbContext Resolve()
        {
            var countryCode = _httpContextAccessor.HttpContext?
                .Request.Headers["X-Country-Code"]
                .ToString()
                .ToUpper();

            return countryCode switch
            {
                "PH" => _phContext,
                "ID" => _idContext,
                "KH" => _khContext,
                _ => throw new InvalidOperationException(
                    $"Unknown or missing X-Country-Code header: '{countryCode}'. Valid values: PH, ID, KH.")
            };
        }
    }
}
