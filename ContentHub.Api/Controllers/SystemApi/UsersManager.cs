using AutoMapper;
using AutoMapper.QueryableExtensions;
using ContentHub.Application.Models;
using ContentHub.Application.Models.System;
using ContentHub.Domain.Data.Identity;
using ContentHub.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Api.Controllers.System
{
    [Route("api/users")]
    [ApiController]
    public class UsersManager : ControllerBase
    {
        private readonly ContentHubDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public UsersManager(ContentHubDbContext context,
                UserManager<AppUser> userManager,
                IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }
        [HttpGet("all")]
        public async Task<ActionResult<PagedResult<UserDto>>> GetUsers(string? keyword, int pageNumber = 1, int pageSize = 10)
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
            var users = await _mapper.ProjectTo<UserDto>(query)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new PagedResult<UserDto>
            {
                Results = users,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                RowCount = totalRow
            });
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(Guid id)
        {
            var userById = await _context.Users.AsNoTracking().Where(x=>x.Id == id)
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
            if (userById == null)
            {
                return NotFound("User does not found");
            };
            return Ok(userById);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(Guid id, [FromBody] UserRequest request)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
                return NotFound("User not found");

            _mapper.Map(request, user);

            await _userManager.UpdateAsync(user);

            var result = _mapper.Map<UserDto>(user);

            return Ok(result);
        }
       
    }


}

