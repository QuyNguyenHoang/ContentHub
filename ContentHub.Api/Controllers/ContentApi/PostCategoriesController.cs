using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("api/categories")]
    [ApiController]
    public class PostCategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IRepository<PostCategory, Guid> _repository;
        public PostCategoriesController(ICategoryRepository categoryRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            IRepository<PostCategory, Guid> repository)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _repository = repository;
        }
        [HttpPost("create")]
        public async Task<ActionResult> NewCategory([FromBody] CategoryRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // 1. check slug duplicate
            var slugExists = await _repository
                .Find(x => x.Slug == request.Slug)
                .AnyAsync();

            if (slugExists)
                return BadRequest("Slug already exists");

            // 2. check ParentId tồn tại
            if (request.ParentId.HasValue)
            {
                var parent = await _repository.GetByIdAsync(request.ParentId.Value);

                if (parent == null)
                    return BadRequest("Parent category does not exist");

                // 3. nếu chỉ cho 2 cấp
                if (parent.ParentId != null)
                    return BadRequest("Only 2 level categories allowed");
            }

            var category = _mapper.Map<PostCategory>(request);
            category.DateCreated = DateTime.UtcNow;
            category.Id = Guid.NewGuid();
            await _categoryRepository.Add(category);
            

            var result = await _repository.CompleteAsync();

            if (result <= 0)
                return BadRequest("Create failed");

            return Ok(category);
        }
        
        [HttpPut("update/{id}")]
        public async Task<ActionResult<CategoryRequestDto>> UpdateCategory(Guid id,
            [FromBody] CategoryRequestDto request)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound($"Can not found category for id = {id}");
            }
            _mapper.Map(request, category);
            await _repository.CompleteAsync();
            return Ok("Update category complete!");
            

        }
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteCategory([FromQuery] Guid[] ids)
        {
            foreach(var id in ids)
            {
                var category = await _categoryRepository.GetByIdAsync(id);
                    if (category == null) {
                    return NotFound();
                        }
                if(await _categoryRepository.HasPost(id))
                {
                    return BadRequest("The category contrains the article and can not be deleted!!!");
                }
                _repository.Remove(category);
            }
            var result = await _repository.CompleteAsync();
            return result> 0 ? Ok() : BadRequest();
        }
        [HttpGet]
        public async Task<ActionResult<PostCategoriesDto>> GetCategoryById(Guid id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound($"Can not found category by Id = {id}");
            }
            var result = _mapper.Map<PostCategoriesDto>(category);
            return Ok(result);
        }
        [HttpGet("list")]
        public async Task<ActionResult<List<CategoryMenuDto>>> CategoryMenu()
        {
            var result = await _categoryRepository.MenuCategoryAsync();
            return Ok(result);
        }


        [HttpGet("all")]
        public async Task<ActionResult<PagedResult<PostCategoriesDto>>> AllCategories(string? keyword, int pageNumber = 1, int pageSize = 10)
        {
            var result = await _categoryRepository.GetAllCategoriesAsync(keyword, pageNumber, pageSize);
            return Ok(result);
        }
        

    }
}
