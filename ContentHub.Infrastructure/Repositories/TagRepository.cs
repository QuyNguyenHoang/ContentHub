using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Infrastructure.Repositories
{
    public class TagRepository : ITagRepository
    {
        private readonly ContentHubDbContext _context;
        private readonly IMapper _mapper;
        private readonly IRepository<Tag, Guid> _repo;
        public TagRepository(ContentHubDbContext context,
            IMapper mapper,
            IRepository<Tag, Guid> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }
        //Check Name or Slug exist
        public async Task<bool> NameOrSlugExistAsync(string name)
        {
            return await _context.Tags.AnyAsync(t => t.Name == name);
        }
        //Tag paging
        public async Task<PagedResult<TagDto>> GetAllTagsAsync(string? keyword, int pageNumber = 1, int pageSize = 10)
        {
            var query = _context.Tags.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x => x.Name.Contains(keyword) || x.Slug.Contains(keyword));
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
                CurrentPage = pageNumber,

            };
        }

        public async Task<List<TagDto>> GetTagDropdown()
        {
            var listnameTag = await _context.Tags
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .Select(x => new TagDto
                {
                    Id = x.Id,
                    Name = x.Name
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
        public async Task<TagDto?> GetTagByIdAsync(Guid id)
        {
            var tag = await _repo.GetByIdAsync(id);
            if (tag == null)
            {
                return null; 
            }
            return _mapper.Map<TagDto?>(tag);
        }
        public async Task<bool> HasPostAsync(Guid tagId)
        {
            return await _context.PostTags.AsNoTracking().AnyAsync(t=>t.TagId == tagId);
        }

    }
}
