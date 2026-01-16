using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Infrastructure.SeedWorks;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Infrastructure.Repositories
{
    public class PostRepository : RepositoryBase<Post, Guid>, IPostRepository
    {
        private readonly ContentHubDbContext _context;
        private readonly IMapper _mapper;
        public PostRepository(ContentHubDbContext context, IMapper mapper) : base(context)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedResult<PostInListDto>> GetAllPaging(string? keyword, Guid? CategoryId, int pageIndex = 1, int pageSize = 10)
        {
            var query = _context.Posts.AsQueryable();
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x => x.Name.Contains(keyword));
            }
            if (CategoryId.HasValue)
            {
                query = query.Where(x => x.CategoryId == CategoryId.Value);
            }
            var totalRow = await query.CountAsync();
            query = query.OrderByDescending(x => x.DateCreated)
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize);
            return new PagedResult<PostInListDto>
            {
                Results = await _mapper.ProjectTo<PostInListDto>(query).ToListAsync(),
                CurrentPage = pageIndex,
                RowCount = totalRow,
                PageSize = pageSize

            };
        }

        public Task<bool> IsSlugAlreadyExistedAsync(string slug, Guid? currentId = null)
        {
            return _context.Posts.AnyAsync(x =>
                x.Slug == slug &&
                (!currentId.HasValue || x.Id != currentId.Value));
        }

      
    }

}
