using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
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
        [HttpPost]
        public async Task<ActionResult<SeriesDto>> AddNewSeries([FromBody] SeriesRequestDto seriesRequest)
        {
            var result = await _seriesRepository.AddNewSeriesAsync(seriesRequest);
            return Ok(result);
        }
        [HttpPut("{id}")]
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
        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(Guid id)
        {
            var result = await _seriesRepository.GetSeriesByIdAsync(id);
            return Ok(result);
        }
        [HttpGet("paging")]
        public async Task<ActionResult<PagedResult<SeriesDto>>> GetAllPagingSeries(string? keyword,
            string? filter,
            int pageNumber = 1,
            int pageSize = 10)
        {
            var result = await _seriesRepository.GetAllSeriesPagingAsync(keyword,filter, pageNumber, pageSize);
            return Ok(result);
        }
        [HttpGet("dropdown")]
        public async Task<ActionResult<SeriesDto>> GetSeriesDropDown()
        {
            var result = await _seriesRepository.GetDropDownSeriesAsync();
            return Ok(result);
        }
    }

}

