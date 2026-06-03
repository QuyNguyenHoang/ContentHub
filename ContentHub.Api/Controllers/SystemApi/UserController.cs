using AutoMapper;
using AutoMapper.QueryableExtensions;
using ContentHub.Application.IRepositories.System;
using ContentHub.Application.Models;
using ContentHub.Application.Models.System;
using ContentHub.Application.Models.System.UserDto;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using ContentHub.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Api.Controllers.System
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ContentHubDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepo;

        public UserController(ContentHubDbContext context,
                UserManager<AppUser> userManager,
                IMapper mapper,
                IUserRepository userRepo
                )
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
            _userRepo = userRepo;
        }
        //Get all user paging

        //[Authorize(Policy = Permissions.Users.View)]
        [HttpGet("paging")]
        public async Task<ActionResult<PagedResult<UserResponseDto>>> GetUserPaging(
            string? filter,
            string? keyword,
            int pageNumber = 1,
            int pageSize = 10)
        {
            var resullt = await _userRepo.GetUserPagingAsync(filter, keyword, pageNumber, pageSize);
            return Ok(resullt);
        }
        //Update User
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> UpdateUser(Guid id, UpdateUserDto updateUserDto)
        {
            var result = await _userRepo.UpdateUserAsync(id, updateUserDto);
            return Ok(result);
        }
        //Delete User
        [HttpDelete]
        public async Task<ActionResult<int>> DeleteUser([FromBody] DeleteUserDto deleteUserDto)
        {
            var result = await _userRepo.DeleteUserAsync(deleteUserDto);
            return Ok(result);
        }
        //Get User Detail
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUserDetail(Guid id)
        {
            var result = await _userRepo.GetUserDetailAsync(id);
            return Ok(result);
        }
        [Authorize(Permissions.Users.View)]
        [HttpGet("all")]
        public async Task<ActionResult<PagedResult<UserResponseDto>>> GetUsers(string? keyword, int pageNumber = 1, int pageSize = 10)
        {
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize < 1 ? 10 : pageSize;
            var query = _userManager.Users.AsNoTracking();
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x => x.UserName!.Contains(keyword)
                            || x.Email!.Contains(keyword));
            }
            query = query.OrderByDescending(x => x.DateCreated);
            var totalRow = await query.CountAsync();
            var users = await _mapper.ProjectTo<UserResponseDto>(query)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new PagedResult<UserResponseDto>
            {
                Results = users,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                RowCount = totalRow
            });
        }
    }


}

