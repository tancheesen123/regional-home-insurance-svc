namespace ApplicationService.Core.Application.Common.Enums
{
    public enum PlanType
    {
        BuildingOnly     = 1,
        ContentsOnly     = 2,
        BuildingContents = 3
    }

    public static class PlanTypeParser
    {
        private static readonly IReadOnlyDictionary<string, PlanType> _map =
            new Dictionary<string, PlanType>(StringComparer.OrdinalIgnoreCase)
            {
                ["building-only"]     = PlanType.BuildingOnly,
                ["contents-only"]     = PlanType.ContentsOnly,
                ["building-contents"] = PlanType.BuildingContents,
            };

        public static IEnumerable<string> ValidValues => _map.Keys;

        public static bool TryParse(string? value, out PlanType result) =>
            _map.TryGetValue(value ?? string.Empty, out result);
    }
}
