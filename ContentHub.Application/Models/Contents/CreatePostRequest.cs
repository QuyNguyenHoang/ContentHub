using AutoMapper;
using ContentHub.Domain.Data.Entities;
using System.ComponentModel.DataAnnotations;

namespace ContentHub.Application.Models.Contents
{
    public class CreatePostRequest
    {
        [Required]
        [MaxLength(250)]
        public string Name { get; set; } = default!;

        public string? Description { get; set; }

        public string? Content { get; set; }

        public string? Source { get; set; }

        public string? Tags { get; set; }


        public bool IsPaid { get; set; }

        public decimal RoyaltyAmount { get; set; }




        // Optional: cho phép set status khi update
        public PostStatus? Status { get; set; }
        public Guid AuthorUserId { get; set; }
        public class AutoMapperProfile : Profile
        {
            public AutoMapperProfile()
            {
                CreateMap<CreatePostRequest, Post>()
                    .ForMember(dest => dest.Slug, opt => opt
                        .MapFrom(src => SlugExtensions.GenerateSlug(src.Name)))
                    .ForMember(dest => dest.SeoDescription, opt => opt
                        .MapFrom(src => SeoExtensions.GenerateSeoDescription(src.Description, src.Content)))
                     .ForMember(dest => dest.Status, opt => opt
                        .MapFrom(src => src.Status ?? PostStatus.Draft));

            }
        }

    }
}
