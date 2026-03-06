namespace ContentHub.Application.Models.Contents
{
    public class CategoryMenuDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Slug { get; set; }

        public List<CategoryMenuDto> Children { get; set; } = new();
    }
}

