using AutoMapper;
using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents
{
    public class PostCategoriesDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public  string Slug { get; set; } = string.Empty ;
        public Guid? ParentId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public int? SortOrder { get; set; }
        public class AutoMapperProfile : Profile
        {
            public AutoMapperProfile()
            {
                CreateMap<PostCategory, PostCategoriesDto>();
            }
        }
    }
}