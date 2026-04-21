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

        /// <summary>
        /// Resolves the correct DbContext from the current HTTP request's X-Country-Code header.
        /// Use this overload for controller/request-scoped code.
        /// </summary>
        public ApplicationDbContext Resolve()
        {
            var request     = _httpContextAccessor.HttpContext?.Request;
            var countryCode = request?.Headers["X-Country-Code"].ToString();

            if (string.IsNullOrEmpty(countryCode))
                countryCode = request?.Query["countryCode"].ToString();

            return Resolve(countryCode);
        }

        /// <summary>
        /// Resolves the correct DbContext from an explicit region string (e.g. "PH", "ID", "KH").
        /// Use this overload for background / fire-and-forget code where HttpContext is unavailable.
        /// </summary>
        public ApplicationDbContext Resolve(string? region)
        {
            return region?.ToUpper() switch
            {
                "PH" => _phContext,
                "ID" => _idContext,
                "KH" => _khContext,
                _ => throw new InvalidOperationException(
                    $"Unknown or missing X-Country-Code header: '{region}'. Valid values: PH, ID, KH.")
            };
        }
    }
}
