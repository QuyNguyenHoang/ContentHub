using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ContentHub.Application.Models.System
{
    public class PermissionDto
    {
        public string RoleId { get; set; } = default!;
        public List<RoleClaimsDto> RoleClaims { get; set; } = new();
    }

}
