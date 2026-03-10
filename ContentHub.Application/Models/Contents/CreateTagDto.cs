using AutoMapper;
using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents
{
    public class CreateTagDto
    {
        public required string Name { get; set; }
        
        
        public class AutoMapperProfile : Profile
        {
            public AutoMapperProfile()
            {
                CreateMap<CreateTagDto, Tag>()
                     .ForMember(dest => dest.Slug,
                        opt => opt.MapFrom(src => SlugExtensions.GenerateSlug(src.Name)));
            }
        }
    }
}