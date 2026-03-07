using AutoMapper;
using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents
{
    public class CreateTagDto
    {
        public required string Name { get; set; }
        public required string Slug { get; set; }
        public class AutoMapperProfile : Profile
        {
            public AutoMapperProfile()
            {
                CreateMap<CreateTagDto, Tag>();
            }
        }
    }
}