using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ContentHub.Api.Controllers.AdminApi
{
    [Route("api/admin/post")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly IPostRepository _postRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        public PostController(IMapper mapper, UserManager<AppUser> userManager, IPostRepository postRepository, ICategoryRepository categoryRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _userManager = userManager;
            _postRepository = postRepository;
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
        }
        //[HttpPost]
        //[Authorize(Policy = Permissions.Posts.Create)]
        //public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
        //{
        //    if (await _postRepository.IsSlugAlreadyExistedAsync(request.Slug))
        //    {
        //        return BadRequest("Slug already existed!");
        //    }
        //    var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
        //    if (category == null)
        //    {
        //        return BadRequest("Category not found!");
        //    }
        //    var post = _mapper.Map<Post>(request);

        //    post.Id = Guid.NewGuid();
        //    post.Name = request.Name;
        //    post.Slug = request.Slug;
        //    post.CategoryId = request.CategoryId;
        //    post.DateCreated = DateTime.UtcNow;
        //    post.Status = PostStatus.Draft;
        //    post.ViewCount = 0;
        //    _postRepository.Add(post);
        //    await _unitOfWork.CompleteAsync();

        //    return Ok($"Create new is successfully! {post.Id}");
        //}

    }
}
