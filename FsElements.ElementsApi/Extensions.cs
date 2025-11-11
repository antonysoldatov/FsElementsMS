namespace FsElements.ElementsApi
{
    public static class Extensions
    {
        public static ElementDto ToDto(this Entities.Element entity)
            => new ElementDto(
                entity.Id.ToString(),
                entity.UniqueCode!,
                entity.Name!,
                entity.PriceWholesale,
                entity.PriceRetail,
                entity.Width,
                entity.Height,
                entity.Weight,
                entity.ElementFormId.ToString(),
                entity.CategoryId.ToString(),
                entity.SellerId.ToString()
            );
    }
}
