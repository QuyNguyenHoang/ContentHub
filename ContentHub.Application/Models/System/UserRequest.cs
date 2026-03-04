using AutoMapper;
using ContentHub.Domain.Data.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ContentHub.Application.Models.System
{
    public class UserRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public DateTime? Dob { get; set; }

        public string? Avatar { get; set; }

        public class AutoMapperProfiles : Profile
        {
            public AutoMapperProfiles()
            {
                CreateMap<UserRequest, AppUser>();
            }
        }
    }
}
