using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.Contents;
using ContentHub.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("api/series")]
    [ApiController]
    public class SeriesManagerController : ControllerBase
    {
        private readonly ISeriesRepository _seriesRepository;
        public SeriesManagerController(ISeriesRepository seriesRepository)
        {
            _seriesRepository = seriesRepository;
        }
        [HttpPost("create")]
        public async Task<ActionResult<SeriesDto>> AddNewSeries([FromBody] SeriesRequestDto seriesRequest)
        {
            var result = await _seriesRepository.AddNewSeriesAsync(seriesRequest);
            return Ok(result);
        }
        [HttpPut("update/{id}")]
        public async Task<ActionResult<SeriesDto>> UpdateSeries(Guid id, [FromBody] SeriesRequestDto seriesRequest)
        {
            var result = await _seriesRepository.UpdateSeriesAsync(id, seriesRequest);
            return Ok(result);
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteSeries([FromBody] Guid[] ids)
        {
            var deletedCount = await _seriesRepository.DeleteSeriesAsync(ids);

            return Ok(new
            {
                deleted = deletedCount
            });
        }
    }
}
