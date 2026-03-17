using ContentHub.Application.ConfigOptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("api/media")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly MediaSettings _mediaSetting;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public MediaController(IOptions<MediaSettings> mediaSetting, IWebHostEnvironment webHostEnvironment)
        {
            _mediaSetting = mediaSetting.Value;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> UploadImage(string type)
        {
            var allowImageTypes = _mediaSetting.AllowImageFileType?.Split(",");

            var now = DateTime.Now;
            var files = Request.Form.Files;

            if (files.Count == 0)
                return BadRequest("Không có file upload.");

            var file = files[0];

            var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition)?.FileName?.Trim('"');

            if (string.IsNullOrEmpty(filename))
                return BadRequest("Tên file không hợp lệ.");

            var extension = Path.GetExtension(filename);

            if (allowImageTypes?.Any(x => x.Equals(extension, StringComparison.OrdinalIgnoreCase)) == false)
                return BadRequest("Không cho phép tải lên file không phải ảnh.");

            var imageFolder = $@"\{_mediaSetting.ImageFolder}\images\{type}\{now:MMyyyy}";
            var folder = _webHostEnvironment.WebRootPath + imageFolder;

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var filePath = Path.Combine(folder, filename);

            using (var fs = global::System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(fs);
            }

            var path = Path.Combine(imageFolder, filename).Replace(@"\", "/");

            return Ok(new { path });
        }
    }

}
