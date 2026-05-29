using ContentHub.Application.IRepositories.System;
using ContentHub.Application.Models;
using ContentHub.Application.Models.System;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Infrastructure.Repositories.System
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ContentHubDbContext _context;
        public UserRepository(ContentHubDbContext context,
            UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        //get user paging
        public async Task<PagedResult<UserDto>> GetUserPaging(
    string? filter,
    string? keyword,
    int pageNumber = 1,
    int pageSize = 10)
        {
            filter = filter?.Trim().ToLower();
            keyword = keyword?.Trim();

            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize < 1 ? 10 : pageSize;

            IQueryable<AppUser> query = _context.Users
                .AsNoTracking();

            // Active / inactive
            if (filter == "not_active")
            {
                query = query.Where(u => !u.IsActive);
            }
            else
            {
                query = query.Where(u => u.IsActive);
            }

            // Role filter
            if (filter == "admin")
            {
                query = query.Where(u =>
                    u.UserRoles.Any(ur =>
                        ur.Role.Name == Roles.Admin.ToString()));
            }

            // Search
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(u =>
                    u.FirstName.Contains(keyword) ||
                    u.LastName.Contains(keyword) ||
                    u.Email!.Contains(keyword) ||
                    u.UserName!.Contains(keyword) ||
                    u.PhoneNumber!.Contains(keyword));
            }

            // Sorting
            query = filter switch
            {
                "old_user" => query.OrderBy(u => u.DateCreated),

                "new_user" => query.OrderByDescending(u => u.DateCreated),

                _ => query.OrderByDescending(u => u.UserName)
            };

            var totalRow = await query.CountAsync();

            var users = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    IsActive = u.IsActive,
                    DateCreated = u.DateCreated,
                    Dob = u.Dob,
                    Avatar = u.Avatar,
                    LastLoginDate = u.LastLoginDate,
                    UserName = u.UserName!,
                    Email = u.Email!,
                    EmailConfirmed = u.EmailConfirmed,
                    TotalPost = u.Posts.Count()
                })
                .ToListAsync();

            return new PagedResult<UserDto>
            {
                Results = users,
                PageSize = pageSize,
                RowCount = totalRow,
                CurrentPage = pageNumber
            };
        }
    }
}
