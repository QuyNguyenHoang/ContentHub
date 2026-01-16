using AutoMapper;
using ContentHub.Domain.Data.Entities;
using System.ComponentModel.DataAnnotations;

namespace ContentHub.Application.Models.Contents
{
    public class CreatePostRequest
    {
        public required string Name { get; set; }

        public required string Slug { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public string? Thumbnail { get; set; }
        public Guid CategoryId { get; set; }

        public string? Content { get; set; }

        public string? Source { get; set; }

        public string[]? Tags { get; set; }

        public string? SeoDescription { get; set; }
        public class AutoMapperProfile : Profile
        {
            public AutoMapperProfile()
            {
                CreateMap<CreatePostRequest, Post>();
            }
        }

    }
}
