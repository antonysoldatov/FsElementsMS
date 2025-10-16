namespace FsElements.FormsApi
{
    public static class Extensions
    {
        public static ElementCategoryDto ToDto(this Entities.ElementCategory category) =>
            new ElementCategoryDto(category.Id.ToString(), category.Name);

        public static ElementFormDto ToDto(this Entities.ElementForm form) => 
            new ElementFormDto(form.Id.ToString(), form.Name, form.Image, form.ElementCategoryId.ToString());
    }
}
