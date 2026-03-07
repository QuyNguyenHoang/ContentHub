using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Infrastructure.Repositories
{
    public class TagRepository : ITagRepository
    {
        private readonly ContentHubDbContext _context;
        private readonly IMapper _mapper;
        public TagRepository(ContentHubDbContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        //Check Name or Slug exist
        public async Task<bool> NameOrSlugExistAsync(string name, string slug)
        {
            return await _context.Tags.AnyAsync(t => t.Name == name || t.Slug == slug);
        }
        //Tag paging
        public async Task<PagedResult<TagDto>> GetAllTagsAsync(string? keyword, int pageNumber = 1, int pageSize = 10)
        {
            var query = _context.Tags.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x => x.Name.Contains(keyword));
            }
            query = query.OrderBy(x => x.Name);
            var totalRow = await query.CountAsync();
            var tag = await _mapper.ProjectTo<TagDto>(query)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new PagedResult<TagDto>
            {
                RowCount = totalRow,
                PageSize = pageSize,
                Results = tag,
                CurrentPage = pageNumber
            };
        }

        public async Task<List<TagDto>> GetTagDropdown()
        {
            var listnameTag = await _context.Tags
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .Select(x => new TagDto
                {
                    Name = x.Name,
                })
                .ToListAsync();
            return listnameTag;
        }
        public async Task<TagDto?> GetTagBySlugAsync(string slug)
        {
            var tagbySlug = await _context.Tags
                .AsNoTracking()
                .Where(t => t.Slug == slug)
                .FirstOrDefaultAsync();
            if (tagbySlug == null)
            {
                return null;
            }
            return _mapper.Map<TagDto>(tagbySlug);               
            
        }
    }
}
