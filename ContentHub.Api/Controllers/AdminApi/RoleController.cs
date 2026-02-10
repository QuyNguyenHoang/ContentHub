using AutoMapper;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using ContentHub.Api.Extentions;
using ContentHub.Application.Models.Auth;
using ContentHub.Application.Models.System;
using ContentHub.Application.Models;
using System.Security.Claims;

namespace ContentHub.Api.Controllers
{
    [ApiController]
    [Route("api/roles")]
    public class RoleController : ControllerBase
    {
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IMapper _mapper;
        public static class AppClaimTypes
        {
            public const string Permission = "permission";
        }
        public RoleController(
            RoleManager<AppRole> roleManager,
            IMapper mapper)
        {
            _roleManager = roleManager;
            _mapper = mapper;
        }

        // =========================
        // GET ROLE BY ID
        // =========================
        [HttpGet("{id}")]
        [Authorize(Permissions.Roles.View)]
        public async Task<ActionResult<RoleDto>> GetById(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
                return NotFound("Role not found");

            return Ok(_mapper.Map<RoleDto>(role));
        }

        // =========================
        // GET ROLES PAGING
        // =========================
        [HttpGet("paging")]
        [Authorize(Policy = Permissions.Roles.View)]
        public async Task<ActionResult<PagedResult<RoleDto>>> GetPaging(
            string? keyword,
            int pageIndex = 1,
            int pageSize = 10)
        {
            pageIndex = pageIndex < 1 ? 1 : pageIndex;
            pageSize = pageSize <= 0 ? 10 : pageSize;

            var query = _roleManager.Roles.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x =>
                    x.Name!.Contains(keyword) ||
                    x.DisplayName.Contains(keyword));
            }

            var totalRow = await query.CountAsync();

            var data = await _mapper.ProjectTo<RoleDto>(
                    query.Skip((pageIndex - 1) * pageSize)
                         .Take(pageSize))
                .ToListAsync();

            return Ok(new PagedResult<RoleDto>
            {
                Results = data,
                CurrentPage = pageIndex,
                PageSize = pageSize,
                RowCount = totalRow
            });
        }

        // =========================
        // GET ALL ROLES
        // =========================
        [HttpGet("all")]
        [Authorize(Policy = Permissions.Roles.View)]
        public async Task<ActionResult<List<RoleDto>>> GetAll()
        {
            var roles = await _mapper
                .ProjectTo<RoleDto>(_roleManager.Roles)
                .ToListAsync();

            return Ok(roles);
        }

        // =========================
        // CREATE ROLE
        // =========================
        [HttpPost]
        [Authorize(Policy = Permissions.Roles.Create)]
        public async Task<IActionResult> Create(RoleRequestDto request)
        {
            var existingRole = await _roleManager.FindByNameAsync(request.Name);
            if (existingRole != null)
                return BadRequest("Role already exists");

            var role = new AppRole
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                NormalizedName = request.Name.ToUpper(),
                DisplayName = request.DisplayName
            };

            var result = await _roleManager.CreateAsync(role);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new
            {
                success = true,
                roleId = role.Id
            });
        }

        // =========================
        // UPDATE ROLE
        // =========================
        [HttpPut("{id}")]
        [Authorize(Policy = Permissions.Roles.Edit)]
        public async Task<IActionResult> Update(Guid id, RoleRequestDto request)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
                return NotFound("Role not found");

            var exists = await _roleManager.FindByNameAsync(request.Name);
            if (exists != null && exists.Id != id)
                return BadRequest("Role name already exists");

            role.Name = request.Name;
            role.NormalizedName = request.Name.ToUpper();
            role.DisplayName = request.DisplayName;

            var result = await _roleManager.UpdateAsync(role);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new
            {
                success = true,
                message = "Role updated successfully"
            });
        }

        // =========================
        // DELETE ROLE
        // =========================
        [HttpDelete("{id}")]
        [Authorize(Policy = Permissions.Roles.Delete)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
                return NotFound("Role not found");
            if (role.Name == "admin" || role.NormalizedName == Roles.Admin.ToUpper())
            {
                return BadRequest("Không thể xoá role Admin");
            }

            var result = await _roleManager.DeleteAsync(role);
            if (!result.Succeeded)
                return BadRequest(result.Errors);
           
            return Ok(new
            {
                success = true,
                message = "Role deleted successfully"
            });
        }

        // =========================
        // GET ROLE PERMISSIONS
        // =========================
        [HttpGet("{roleId}/permissions")]
        public async Task<ActionResult<PermissionDto>> GetPermissions(Guid roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
                return NotFound("Role not found");

            // 1. Build full permission list từ enum / constant
            var model = new PermissionDto
            {
                RoleId = roleId.ToString(),
                RoleClaims = new List<RoleClaimsDto>()
            };

            var permissionGroups = typeof(Permissions)
                .GetTypeInfo()
                .DeclaredNestedTypes;

            foreach (var group in permissionGroups)
            {
                model.RoleClaims.GetPermissions(group);
            }

            // 2. Lấy permissions đã gán trong DB
            var roleClaims = await _roleManager.GetClaimsAsync(role);

            var grantedPermissions = roleClaims
                .Where(c => c.Type == AppClaimTypes.Permission)
                .Select(c => c.Value)
                .ToHashSet(); // ⚡ nhanh hơn List

            // 3. Đánh dấu selected
            foreach (var permission in model.RoleClaims)
            {
                permission.Selected = grantedPermissions.Contains(permission.Value);
            }

            return Ok(model);
        }


        // =========================
        // SAVE ROLE PERMISSIONS
        // =========================
        [HttpPut("permissions")]
        [Authorize(Policy = Permissions.Roles.Edit)]
        public async Task<IActionResult> SavePermissions(PermissionDto model)
        {
            var role = await _roleManager.FindByIdAsync(model.RoleId);
            if (role == null)
                return NotFound("Role not found");

            var claims = await _roleManager.GetClaimsAsync(role);

            // chỉ xóa permission claim
            foreach (var claim in claims.Where(c => c.Type == AppClaimTypes.Permission))
            {
                await _roleManager.RemoveClaimAsync(role, claim);
            }

            // chỉ add những cái được tick
            foreach (var claim in model.RoleClaims.Where(c => c.Selected))
            {
                await _roleManager.AddClaimAsync(
                    role,
                    new Claim(AppClaimTypes.Permission, claim.Value)
                );
            }
            return Ok(new
            {
                success = true,
                message = "Permissions updated successfully"
            });
        }
    }
}
