using AutoMapper;
using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents
{
    public class SeriesDto
    {

        public Guid Id { get; set; }

        public string Name { get; set; } = default!;

        public string? Description { get; set; }

        public string Slug { get; set; } = default!;
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; }

        public string? SeoKeywords { get; set; }

        public string? SeoDescription { get; set; }

        public string? Thumbnail { get; set; }
        public string? Content { get; set; }
        public DateTime DateCreated { get; set; }
        public Guid UserId { get; set; }
        public class AutoMapperProfile : Profile
        {
            public AutoMapperProfile()
            {
                CreateMap<Series, SeriesDto>();
            }
        }
    }
}


