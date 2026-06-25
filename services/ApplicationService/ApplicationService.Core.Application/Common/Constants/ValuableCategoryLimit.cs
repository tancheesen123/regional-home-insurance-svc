using ApplicationService.Core.Application.Common.Enums;

namespace ApplicationService.Core.Application.Common.Constants
{
    public record ValuableCategoryLimit(decimal MaxPerItem, decimal MaxTotal, decimal Rate);

    public static class ValuableCategoryLimits
    {
        public static readonly IReadOnlyDictionary<ValuableCategory, ValuableCategoryLimit> Map =
            new Dictionary<ValuableCategory, ValuableCategoryLimit>
            {
                [ValuableCategory.Jewellery]       = new(10_000m, 30_000m, 0.020m),
                [ValuableCategory.Gold] = new(10_000m, 30_000m, 0.020m),
                [ValuableCategory.Electronics]     = new( 8_000m, 20_000m, 0.015m),
                [ValuableCategory.Artwork]         = new(15_000m, 30_000m, 0.018m),
                [ValuableCategory.SportsEquipment] = new( 5_000m, 15_000m, 0.015m),
                [ValuableCategory.Other]           = new( 5_000m, 20_000m, 0.015m),
            };

        public static bool TryResolve(string category, out ValuableCategory result)
        {
            result = category.ToLowerInvariant() switch
            {
                "jewellery"        => ValuableCategory.Jewellery,
                "gold"        => ValuableCategory.Gold,
                "electronics"      => ValuableCategory.Electronics,
                "artwork"          => ValuableCategory.Artwork,
                "sports-equipment" => ValuableCategory.SportsEquipment,
                "other"            => ValuableCategory.Other,
                _                  => default
            };

            return category.ToLowerInvariant() switch
            {
                "jewellery" or "gold" or "electronics" or "artwork" or "sports-equipment" or "other" => true,
                _ => false
            };
        }
    }
}
