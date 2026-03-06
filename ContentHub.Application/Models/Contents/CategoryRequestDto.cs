using AutoMapper;
using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents
{
    public class CategoryRequestDto
    {

        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public Guid? ParentId { get; set; }
        public bool IsActive { get; set; } = true;
        public int? SortOrder { get; set; }
        public class AutoMapperProfile : Profile
        {
            public AutoMapperProfile()
            {
                CreateMap<CategoryRequestDto, PostCategory>();
            }
        }
    }
}
