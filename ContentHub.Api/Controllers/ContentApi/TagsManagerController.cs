using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;
using Microsoft.AspNetCore.Mvc;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("api/tags")]
    [ApiController]
    public class TagsManagerController : ControllerBase
    {
        private readonly IRepository<Tag, Guid> _repo;
        private readonly ITagRepository _tag;
        private readonly IMapper _mapper;
        public TagsManagerController(IRepository<Tag, Guid> repo,
            ITagRepository tag,
            IMapper mapper)
        {
            _repo = repo;
            _tag = tag;
            _mapper = mapper;
        }
        [HttpPost("create")]
        public async Task<ActionResult<TagDto>> CreateTag([FromBody] CreateTagDto tagDto)
        {
            var checkName = await _tag.NameOrSlugExistAsync(tagDto.Name);
            if (checkName)
            {
                return BadRequest("Name or Slug is already exist!!!");
            }

            var addNew = _mapper.Map<Tag>(tagDto);
            await _repo.Add(addNew);
            var result = await _repo.CompleteAsync();
            if (result <= 0)
            {
                return BadRequest("Can not add new Tag!!!");
            }
            return Ok(_mapper.Map<TagDto>(addNew));
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult<TagDto>> UpdateTag(Guid id, [FromBody] CreateTagDto createTagDto)
        {
            var tag = await _repo.GetByIdAsync(id);

            if (tag == null)
            {
                return NotFound($"Tag with id = {id} not found");
            }

            _mapper.Map(createTagDto, tag);

            var result = await _repo.CompleteAsync();

            if (result <= 0)
            {
                return BadRequest("Update failed");
            }

            return Ok(_mapper.Map<TagDto>(tag));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTag([FromQuery] Guid[] ids)
        {
            foreach (var id in ids)
            {
                var checkHasPost = await _tag.HasPostAsync(id);
                var tag = await _repo.GetByIdAsync(id);
                if (checkHasPost) { return BadRequest($"Can not delete tag with id = {id} because it contrain with POST"); }
                if (tag == null )
                {
                    return NotFound($"Can not found tag with id = {id}");
                }
                _repo.Remove(tag);
            }
            var result = await _repo.CompleteAsync();
            if (result <= 0)
            {
                return BadRequest("Can not delete Tag!!!");
            }
            return Ok("Delete tag is successfully!");
        }

        [HttpGet("dropdown")]
        public async Task<ActionResult<List<TagDto>>> GetListTag()
        {
            var listTag = await _tag.GetTagDropdown();
            return Ok(listTag);
        }
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<TagDto>> GetTagBySlug(string slug)
        {
            var result = await _tag.GetTagBySlugAsync(slug);
            if (result == null)
            {
                return NotFound($"Can not found tag with slug = {slug}");
            }
            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<ActionResult<PagedResult<TagDto>>> GetAllTag(string? keyword, int pageNumber = 1, int pageSize = 10)
        {
            var tagResult = await _tag.GetAllTagsAsync(keyword, pageNumber, pageSize);
            return Ok(tagResult);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> GetTagById(Guid id)
        {
            var result = await _tag.GetTagByIdAsync(id);
            return Ok(result);
        }




    }
}
