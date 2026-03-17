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
        private readonly IMapper _mapper;
        public PostRepository(ContentHubDbContext context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
        }

        public async Task<PagedResult<PostDto>> GetPostPagingAsync(
    string? keyword,
    string? filter,
    int pageNumber = 1,
    int pageSize = 10)
        {
            keyword = keyword?.Trim();
            filter = filter?.Trim();
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;

            var query = _context.Posts.AsNoTracking();

            // Search
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(p =>
                    p.Name.Contains(keyword) ||
                    (p.Content != null && p.Content.Contains(keyword)));
            }

            // Filter by status
            if (!string.IsNullOrWhiteSpace(filter) &&
                Enum.TryParse<PostStatus>(filter, true, out var status))
            {
                query = query.Where(p => p.Status == status);
            }

            // Count
            var totalCount = await query.CountAsync();

            // Data
            var items = await _mapper.ProjectTo<PostDto>(query)
                .OrderByDescending(p => p.DateCreated)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<PostDto>
            {
                Results = items,
                RowCount = totalCount,
                PageSize = pageSize,
                CurrentPage = pageNumber
            };
        }




        public Task<bool> IsSlugAlreadyExisted(string? slug, Guid? currentId = null)
        {
            if (currentId.HasValue)
            {
                return _context.Posts.AllAsync(x => x.Slug == slug && x.Id != currentId.Value);
            }
            return _context.Posts.AllAsync(x => x.Slug == slug);
        }
    }

}
