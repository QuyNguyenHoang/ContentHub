using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ContentHub.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class testcontroller : ControllerBase
    {
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new
            {
                success = true,
                message = "API OK",
                time = DateTime.Now
            });
        }


    }
}
