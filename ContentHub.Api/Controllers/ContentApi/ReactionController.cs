using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.Contents.Reaction;
using ContentHub.Domain.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("api/reactions")]
    [ApiController]
    public class ReactionController : ControllerBase
    {
        private readonly IReactionRepository _repo;
        public ReactionController(IReactionRepository repo) { _repo = repo; }
        [HttpPost]
        public async Task<ActionResult<ReactionDto>> NewReaction(NewReactionDto dto)
        {
            var result = await _repo.NewReactionAsync(dto);
            if (result == null)
            {
                return BadRequest("Add new or Update faild");
            }
            return Ok(result);
        }
        [HttpGet("count_reaction_comment")]
        public async Task<ActionResult<Dictionary<ReactionType, int>>> CountReactionInComment(Guid id)
        {
            var result = await _repo.CountReactionInCommentAsync(id);
            return Ok(result);
        }
        [HttpGet("count_reaction_post")]
        public async Task<ActionResult<Dictionary<ReactionType, int>>> CountReactionInPost(Guid id)
        {
            var result = await _repo.CountReactionInPostAsync(id);
            return Ok(result);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReaction(Guid id, Guid userId)
        {
            await _repo.DeleteReactionAsync(id, userId);

            return NoContent();
        }
    }

}
