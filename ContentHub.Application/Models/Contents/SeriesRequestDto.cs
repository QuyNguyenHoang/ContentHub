using AutoMapper;
using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents
{
    public class SeriesRequestDto
    {

        public string Name { get; set; } = default!;

        public string? Description { get; set; }

        public int SortOrder { get; set; }

        public string? SeoKeywords { get; set; }

        public string? SeoDescription { get; set; }

        public string? Thumbnail { get; set; }
        public string? Content { get; set; }
        public Guid UserId { get; set; }

        public class AutoMapperProfile : Profile
        {
            public AutoMapperProfile()
            {
                CreateMap<SeriesRequestDto, Series>()
                    .ForMember(dest => dest.Slug,
                        opt => opt.MapFrom(src => SlugExtensions.GenerateSlug(src.Name)));
            }
        }
    }
}

