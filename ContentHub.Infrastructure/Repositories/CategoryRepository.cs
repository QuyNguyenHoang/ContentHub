using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Infrastructure.SeedWorks;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Infrastructure.Repositories
{
    public class CategoryRepository : RepositoryBase<PostCategory, Guid>, ICategoryRepository
    {
        private readonly ContentHubDbContext _context;
        private readonly IMapper _mapper;
        public CategoryRepository(ContentHubDbContext context, IMapper mapper) : base(context)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<bool> CategoryExistsAsync(Guid categoryId)
        {
            return await _context.PostCategories
                       .AnyAsync(x => x.Id == categoryId);
        }
        public async Task<PagedResult<PostCategoriesDto>> GetAllCategoriesAsync(string? keyword, int pageNumber = 1, int pageSize = 10)
        {
            var query = _context.PostCategories.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x => x.Name.Contains(keyword));
            }
            query = query.OrderByDescending(x => x.DateCreated);
            var totalRow = await query.CountAsync();
            var categories = await _mapper.ProjectTo<PostCategoriesDto>(query)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new PagedResult<PostCategoriesDto>
            {
                Results = categories,
                CurrentPage = pageNumber,
                RowCount = totalRow,
                PageSize = pageSize
            };

        }
        public  Task<bool> HasPost(Guid categoryId)
        {
            return  _context.Posts.AsNoTracking().AnyAsync(x => x.CategoryId == categoryId);
        }
        public async Task<PostCategoriesDto> GetBySlug(string slug)
        {
            var category = await _mapper.ProjectTo<PostCategoriesDto>(_context.PostCategories.AsNoTracking())
                .FirstOrDefaultAsync(x => x.Slug == slug);
            if (category == null)
            {
                throw new Exception($"Not found category for {slug}");
            }
            return category;
        }
        public async Task<List<CategoryMenuDto>> MenuCategoryAsync()
        {
            var categories = await _context.PostCategories
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.SortOrder)
                .ToListAsync();

            var parents = categories.Where(x => x.ParentId == null);

            var result = parents.Select(p => new CategoryMenuDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Children = categories
                    .Where(x => x.ParentId == p.Id)
                    .Select(c => new CategoryMenuDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Slug = c.Slug
                    })
                    .ToList()
            }).ToList();

            return result;
        }

    }
}
