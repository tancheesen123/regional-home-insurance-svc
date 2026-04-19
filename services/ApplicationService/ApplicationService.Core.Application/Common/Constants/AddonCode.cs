namespace ApplicationService.Core.Application.Common.Constants
{
    public static class AddonCode
    {

        public static readonly IReadOnlyDictionary<string, string> Map =
            new Dictionary<string, string>
            {
                ["RiotStrike"]               = "E008",
                ["ExtendedTheft"]            = "E005",
                ["AlternativeAccommodation"] = "E006",
                ["PublicLiability"]          = "E007",
            };
    }
}
