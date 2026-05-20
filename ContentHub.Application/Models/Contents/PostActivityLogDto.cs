using ContentHub.Domain.Data.Entities;
using System.ComponentModel.DataAnnotations;

namespace ContentHub.Application.Models.Contents
{
    public class PostActivityLogDto
    {
        public Guid Id { get; set; }
        public PostStatus FromStatus { get; set; }
        public PostStatus ToStatus { get; set; }
        public DateTime DateCreated { get; set; }
        public string? Note { get; set; }
        public string? AdminName { get; set; }

    }
}
