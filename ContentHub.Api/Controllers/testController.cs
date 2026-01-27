using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ContentHub.Api.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        [HttpGet("ping")]
        [Authorize(Permissions.Posts.Create)]
        public IActionResult Ping()
        {
            return Ok(new
            {
                success = true,
                message = "API OK",
                time = DateTime.UtcNow
            });
        }
    }
}
