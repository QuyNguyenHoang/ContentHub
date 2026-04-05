using AutoMapper;
using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents
{
    public class PostDto : PostInListDto
    {
        public string? Content { get; set; }
        public string? Source { get; set; }
        public string? Tags { get; set; }
        public string? SeoKeywords { get; set; }
        public string? SeoDescription { get; set; }
        public DateTime? DateModified { get; set; }
        public decimal RoyaltyAmount { get; set; }
        public Guid CategoryId { get; set; }
        public List<TagDto> ListTag { get; set; } = new();
        public class AutomapperProfiles : Profile
        {
            public AutomapperProfiles()
            {
                CreateMap<Post, PostDto>();
      
            }
        }
    }
}

