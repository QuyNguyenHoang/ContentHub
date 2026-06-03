using ContentHub.Application.IRepositories.System;
using ContentHub.Application.Models;
using ContentHub.Application.Models.System.UserDto;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static ContentHub.Domain.SeedWorks.Constant.Permissions;

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
        //Get User Paging
        public async Task<PagedResult<UserResponseDto>> GetUserPagingAsync(
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
            var totalUsers = await _context.Users.CountAsync();

            var adminIds = (await _userManager
    .GetUsersInRoleAsync(Domain.SeedWorks.Constant.Roles.Admin.ToString()))
    .Select(x => x.Id)
    .ToHashSet();
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
                query = query.Where(u => adminIds.Contains(u.Id));
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
                .Select(u => u.ToResponse())
                .ToListAsync();
            foreach (var user in users)
            {
                user.IsAdmin = adminIds.Contains(user.Id);
            }
            return new PagedResult<UserResponseDto>
            {
                Results = users,
                PageSize = pageSize,
                RowCount = totalRow,
                CurrentPage = pageNumber,
                TotalCount = totalUsers
            };
        }
        //Update User
        public async Task<ApiResponse<UserResponseDto>> UpdateUserAsync(Guid id, UpdateUserDto updateUserDto)
        {
            var userUpdate = await _context.Users.FindAsync(id);
            if (userUpdate == null)
            {
                throw new KeyNotFoundException($"User with id {id} not found.");
            }
            userUpdate.FirstName = updateUserDto.FirstName;
            userUpdate.LastName = updateUserDto.LastName;
            userUpdate.IsActive = updateUserDto.IsActive;
            userUpdate.Dob = updateUserDto.Dob;
            userUpdate.Avatar = updateUserDto.Avatar;
            await _context.SaveChangesAsync();
            return new ApiResponse<UserResponseDto>
            {
                IsSuccess = true,
                Message = "User updated successfully!",
                Data = userUpdate.ToResponse()
            };
        }
        //Delete User 
        public async Task<ApiResponse<int>> DeleteUserAsync(DeleteUserDto deleteUserDto)
        {
            if (deleteUserDto.Ids == null || deleteUserDto.Ids.Length == 0)
                throw new ArgumentException("Ids cannot be empty");

            var users = await _context.Users
                .Where(x => deleteUserDto.Ids.Contains(x.Id))
                .ToListAsync();

            if (!users.Any())
                throw new KeyNotFoundException("No users found for the provided IDs.");

            foreach (var user in users)
            {
                if (deleteUserDto.IsSoftDelete)
                {
                    user.IsActive = false;
                }
                else
                {
                    _context.Users.Remove(user);
                }
            }

            await _context.SaveChangesAsync();

            return new ApiResponse<int>
            {
                IsSuccess = true,
                Message = "User deleted successfully!",
                Data = users.Count
            }
            ;

        }
        //User Detail
        public async Task<UserResponseDto> GetUserDetailAsync(Guid id)
        {
            var userDetail = await _context.Users.AsNoTracking().Where(u=>u.Id == id).FirstOrDefaultAsync();
            if(userDetail == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            return userDetail.ToResponse();
                
        }

    }
}
