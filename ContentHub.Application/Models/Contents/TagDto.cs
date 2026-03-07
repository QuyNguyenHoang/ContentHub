using AutoMapper;
using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents
{
    public class TagDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public class AutoMapperProfile : Profile
        {
            public AutoMapperProfile()
            {
                CreateMap<Tag, TagDto>();
            }
        }

    }
}
