using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using ContentHub.Application.ConfigOptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Http.Headers;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("api/media")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly MediaSettings _mediaSetting;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly Cloudinary _cloudinary;
        public MediaController(IOptions<MediaSettings> mediaSetting,
            IWebHostEnvironment webHostEnvironment,
            Cloudinary cloudinary)
        {
            _mediaSetting = mediaSetting.Value;
            _webHostEnvironment = webHostEnvironment;
            _cloudinary = cloudinary;
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
        [HttpPost("upload-cloudinary")]
        public async Task<IActionResult> UploadImageCloudinary(IFormFile file)
        {

            if (file == null || file.Length == 0)
                return BadRequest("No file selected.");


            var allowedTypes = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedTypes.Contains(extension))
                return BadRequest("File type not allowed.");

            try
            {
                await using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),


                    Folder = "contenthub_image",


                    Tags = "dotnet,upload",


                    Transformation = new Transformation()
        .Width(800)
        .Height(400)
        .Crop("fill")
        .Gravity("auto")
        .Quality(80)
        .FetchFormat("auto")
        .Border("5px_solid_white")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    return StatusCode(500, uploadResult.Error.Message);
                }

                var imageUrl = uploadResult.SecureUrl.ToString();
                var imgId = uploadResult.PublicId;

                return Ok(new
                {
                    path = imageUrl,
                    imageId = imgId
                }


                    );
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpDelete("remove-image")]
        public async Task<ActionResult> RemoveImage(string publicId)
        {
            if (string.IsNullOrEmpty(publicId))
                return BadRequest("publicId is required");

            try
            {
                var deleteParams = new DeletionParams(publicId);
                var result = await _cloudinary.DestroyAsync(deleteParams);

                if (result.Result == "ok")
                    return Ok(new { message = "Deleted successfully" });
                else
                    return NotFound(new { message = "Image not found or already deleted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

}
