namespace ContentHub.Application.Models.Contents
{
    public class CategoryMenuDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public List<CategoryMenuDto> Children { get; set; } = new();
    }
}

