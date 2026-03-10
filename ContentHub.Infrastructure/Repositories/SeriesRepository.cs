using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Infrastructure.Repositories
{
    public class SeriesRepository : ISeriesRepository
    {
        private readonly ContentHubDbContext _context;
        private readonly IMapper _mapper;
        private readonly IRepository<Series, Guid> _repo;
        public SeriesRepository(ContentHubDbContext context,
            IMapper mapper,
            IRepository<Series, Guid> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }
        public Task<List<SeriesDto>> GetAllSeriesAsync()
        {
            return _context.Series
                 .OrderBy(s => s.DateCreated)
                 .Select(s => new SeriesDto
                 {
                     Name = s.Name,
                     Description = s.Description,
                     Thumbnail = s.Thumbnail,
                     Content = s.Content
                 })
                 .ToListAsync();
        }

        public async Task<PagedResult<SeriesDto>> GetAllSeriesPagingAsync(string? keyword, int pageNumber = 1, int pageSize = 10)
        {
            var query = _context.Series.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(s => s.Name.Contains(keyword) || s.Slug == keyword);

            }
            query = query.OrderByDescending(s => s.DateCreated);
            var rowCount = await query.CountAsync();
            var seriesResult = await _mapper.ProjectTo<SeriesDto>(query)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new PagedResult<SeriesDto>
            {
                Results = seriesResult,
                RowCount = rowCount,
                PageSize = pageSize,
                CurrentPage = pageNumber
            };


        }

        public async Task<SeriesDto> GetSeriesByIdAsync(Guid id)
        {
            var seriesById = await _context.Series
                .Where(s => s.Id == id)
                .AsNoTracking()
                .FirstOrDefaultAsync();
            return _mapper.Map<SeriesDto>(seriesById);

        }

        public async Task<SeriesDto> GetSeriesBySlug(string slug)
        {
            var seriesBySlug = await _context.Series
                .Where(s => s.Slug == slug)
                .AsNoTracking()
                .FirstOrDefaultAsync();
            return _mapper.Map<SeriesDto>(seriesBySlug);
        }

        public async Task RestoreSeries(Guid id)
        {
            var series = await _repo.GetByIdAsync(id);
            if (series == null)
            {
                return;
            }

            series.IsActive = true;
            await _repo.CompleteAsync();

        }
        public async Task<bool> CheckNameOrSugAlreadyExistAsync(string name)
        {
            return await _context.Series
                .AnyAsync(s => s.Name == name);
        }
        public async Task<SeriesDto> AddNewSeriesAsync(SeriesRequestDto seriesRequest)
        {
            if (await CheckNameOrSugAlreadyExistAsync(seriesRequest.Name))
                throw new Exception("Series name already exists");
            var addnewSeries = _mapper.Map<Series>(seriesRequest);

            await _repo.Add(addnewSeries);
            await _repo.CompleteAsync();

            return _mapper.Map<SeriesDto>(addnewSeries);
        }
        public async Task<SeriesDto> UpdateSeriesAsync(Guid id, SeriesRequestDto seriesRequest)
        {
            var series = await _repo.GetByIdAsync(id);
            if (series == null)
            {
                throw new Exception($"Can not found Series by Id = {id}");
            }
            if (string.IsNullOrWhiteSpace(seriesRequest.Name))
            {
                throw new Exception("Name is required");
            }
            _mapper.Map(seriesRequest, series);
            await _repo.CompleteAsync();
            return _mapper.Map<SeriesDto>(series);
        }

        public async Task<int> DeleteSeriesAsync(Guid[] ids)
        {
            if (ids == null || ids.Length == 0)
                throw new Exception("Ids cannot be empty");

            var seriesList = await _context.Series
                .Where(s => ids.Contains(s.Id) && s.IsActive == true)
                .ToListAsync();

            if (!seriesList.Any())
                throw new Exception("Series not found");
            var deletecount = seriesList.Count;
            //_context.Series.RemoveRange(seriesList);
            foreach (var series in seriesList)
            {
                series.IsActive = false;
            }
            await _context.SaveChangesAsync();
            return deletecount;
        }
    }
}
