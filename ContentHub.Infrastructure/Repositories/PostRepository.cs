using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;
using ContentHub.Infrastructure.SeedWorks;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Infrastructure.Repositories
{
    public class PostRepository : RepositoryBase<Post, Guid>, IPostRepository
    {
        private readonly IMapper _mapper;
        private readonly IRepository<Post, Guid> _repo;
        public PostRepository(ContentHubDbContext context, IMapper mapper, IRepository<Post, Guid> repo) : base(context)
        {
            _mapper = mapper;
            _repo = repo;
        }

        public async Task<PagedResult<PostDto>> GetPostPagedAsync(
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
            var items = await query
                    .OrderByDescending(p => p.DateCreated)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new PostDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Slug = p.Slug,
                        Content = p.Content ?? "No content",
                        Description = p.Description,
                        DateCreated = p.DateCreated,
                        CategoryName = p.Category != null ? p.Category.Name : "No Category",
                        CategorySlug = p.Category != null && !string.IsNullOrEmpty(p.Category.Slug)
                    ? p.Category.Slug
                    : "No Slug",

                        AuthorName = p.Author != null
                            ? p.Author.GetFullName()
                            : null,
                        AuthorAvatar = p.Author != null ? p.Author.Avatar : "No Avatar",
                        ListTag = p.PostTags
                        .Where(pt => pt.Tag != null)
                        .Select(pt => new TagDto
                        {
                            Name = pt.Tag != null ? pt.Tag.Name : "",
                            Slug = pt.Tag != null ? pt.Tag.Slug : "",
                        })
                        .ToList()

                    }).ToListAsync();

            return new PagedResult<PostDto>
            {
                Results = items,
                RowCount = totalCount,
                PageSize = pageSize,
                CurrentPage = pageNumber
            };
        }
        //check AuthorUser
        public Task<bool> IsAuthorExisted(Guid authorId)
        {
            return _context.Users.AnyAsync(u => u.Id == authorId);
        }
        //checkName
        public Task<bool> IsNameExistsAsync(string name)
        {
            return _context.Posts.AnyAsync(p => p.Name == name);
        }
        //checkCategory
        public Task<bool> IsCategoryExisted(Guid? categoryId)
        {
            return _context.PostCategories.AnyAsync(c => c.Id == categoryId);
        }
        //Create Post
        public async Task<PostDto> AddNewPostAsync(CreatePostRequest postRequest)
        {
            var checkAuthorId = await IsAuthorExisted(postRequest.AuthorUserId);
            Console.WriteLine(checkAuthorId);
            if (!checkAuthorId)
            {
                throw new InvalidOperationException("Author invalid!!!");
            }
            var checkCategoryId = await IsCategoryExisted(postRequest.CategoryId);
            Console.WriteLine($"CategoryID = {checkCategoryId}");
            if (!checkCategoryId)
            {
                throw new InvalidOperationException("Post Category Invalid!!!");
            }

            if (string.IsNullOrWhiteSpace(postRequest.Name))
            {
                throw new ArgumentException("Name is required");
            }
            var checkName = await IsNameExistsAsync(postRequest.Name);
            if (checkName)
            {
                throw new InvalidOperationException("Name already exists");
            }
            if (postRequest.Tags == null || postRequest.Tags.Length <= 0)
            {
                throw new InvalidOperationException("Tag does not null");
            }

            var addNewPost = _mapper.Map<Post>(postRequest);
            await _repo.Add(addNewPost);
            await _repo.CompleteAsync();
            var postId = addNewPost.Id;
            var tagGuids = postRequest.Tags
             .Split(',', StringSplitOptions.RemoveEmptyEntries)
             .Select(id => Guid.Parse(id))
             .ToList();
            var postTags = tagGuids.Select(tagId => new PostTag
            {
                PostId = postId,
                TagId = tagId
            }).ToList();

            await _context.PostTags.AddRangeAsync(postTags);



            await _context.SaveChangesAsync();
            return _mapper.Map<PostDto>(addNewPost);

        }

        //Check Slug is exist
        public Task<bool> IsSlugAlreadyExisted(string? slug, Guid? currentId = null)
        {
            if (currentId.HasValue)
            {
                return _context.Posts.AnyAsync(x => x.Slug == slug && x.Id != currentId.Value);
            }
            return _context.Posts.AnyAsync(x => x.Slug == slug);
        }
        //Check post existed with post Id
        public Task<bool> IsPostExisted(Guid id)
        {
            return _context.Posts.AnyAsync(p => p.Id == id);
        }


        // Get post with post Id
        public async Task<PostDto> GetPostById(Guid postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                throw new KeyNotFoundException("Không tìm thấy post");
            }
            return _mapper.Map<PostDto>(post);
        }

        //Get Post with userId (Areas User)
        public async Task<List<PostDto>> GetPostByUserId(Guid userId)
        {
            var post = await _context.Posts.Where(p => p.AuthorUserId == userId).ToListAsync();
            return _mapper.Map<List<PostDto>>(post);
        }
        //Get post by User (post lastest)
        public async Task<PostDto> GetPostByUser(Guid userId)
        {
            var postByUser = await _context.Posts.Where(p => p.AuthorUserId == userId && p.Status == 0)
                .OrderByDescending(p => p.DateCreated)
                .FirstOrDefaultAsync();

            return _mapper.Map<PostDto>(postByUser);
        }


        //Get Post By User Paged (Areas User)
        public async Task<PagedResult<PostDto>> GetPostByUserPagedAsync(Guid userId, string? keyword, string? filter, int pageNumber = 1, int pageSize = 10)
        {
            if (userId == Guid.Empty)
            {
                throw new InvalidOperationException("UserId is invalid");
            }
            keyword = keyword?.Trim();
            filter = filter?.Trim();
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;
            var query = _context.Posts.Where(p => p.AuthorUserId == userId).AsNoTracking();
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(p => p.Name.Contains(keyword) ||
                p.Content != null && p.Content.Contains(keyword) ||
                p.SeoDescription != null && p.SeoDescription.Contains(keyword));
            }
            var rowCount = await query.CountAsync();
            var postResult = await _mapper.ProjectTo<PostDto>(query)
                .OrderByDescending(p => p.DateCreated)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                                .ToListAsync();
            return new PagedResult<PostDto>
            {
                Results = postResult,
                RowCount = rowCount,
                CurrentPage = pageNumber,
                PageSize = pageSize
            };



        }

        // Approve Post (User send Post [Draft --> Approve])
        public async Task Approve(Guid id, Guid authorId)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                throw new KeyNotFoundException("Not found Post");
            }
            var user = await _context.Users.FindAsync(authorId);
            if (user == null)
            {
                throw new KeyNotFoundException("Not found User");
            }
            var postActivity = new PostActivityLog
            {
                Id = Guid.NewGuid(),
                FromStatus = post.Status,
                ToStatus = PostStatus.Published,
                UserId = user.Id,
                PostId = id,
                Note = ($"{user.FirstName} {user.LastName} Approve Post")
            };
            await _context.PostActivityLogs.AddAsync(postActivity);
            post.Status = PostStatus.Published;
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
        }




        //Return back for User (Post invalid)
        public async Task ReturnBack(Guid id, Guid authorId)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                throw new KeyNotFoundException("Not found Post");
            }
            var user = await _context.Users.FindAsync(authorId);
            if (user == null)
            {
                throw new KeyNotFoundException("Not found User");
            }
            var postActivity = new PostActivityLog
            {
                Id = Guid.NewGuid(),
                FromStatus = post.Status,
                ToStatus = PostStatus.Rejected,
                UserId = user.Id,
                PostId = post.Id,
                Note = ("This post InValid")
            };
            await _context.PostActivityLogs.AddAsync(postActivity);
            post.Status = PostStatus.Rejected;
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();


        }

        //Get Reason return (Detail)
        public async Task<List<string?>> GetReturnReason(Guid id)
        {
            var listReason = await _context.PostActivityLogs
             .Where(p => p.PostId == id && p.ToStatus == PostStatus.Rejected)
            .OrderByDescending(p => p.DateCreated)
            .Select(p => p.Note)
            .ToListAsync();

            return listReason;




        }

        //Post has public last (sort by DateCreated)
        public Task<bool> HasPublicInLast(Guid id)
        {
            return _context.Posts.Where(p => p.Status == PostStatus.Published && p.Id == id).AnyAsync();
        }

        //Send request from User to Admin
        public async Task SentToApprove(Guid id, Guid authorId)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                throw new KeyNotFoundException("Not found Post!!!");
            }
            var user = await _context.Users.FindAsync(authorId);
            if (user == null)
            {
                throw new KeyNotFoundException("Not found User!!!");
            }
            var postAvtivity = new PostActivityLog
            {
                Id = Guid.NewGuid(),
                FromStatus = PostStatus.Draft,
                ToStatus = PostStatus.WaitingForApproval,
                Note = ($"{user.UserName} waiting for Approve")

            };
            _context.PostActivityLogs.Add(postAvtivity);
            post.Status = PostStatus.WaitingForApproval;
            await _context.SaveChangesAsync();
        }


        //Update Post (User Areas)
        public async Task<PostDto> UpdatePostAsync(Guid id, CreatePostRequest postRequest)
        {
            var updatePost = await _context.Posts.FindAsync(id);

            if (updatePost == null)
            {
                throw new KeyNotFoundException("Post is not Existed");
            }
            if (updatePost.Name != postRequest.Name)
            {
                var nameExists = await IsNameExistsAsync(postRequest.Name);
                if (nameExists)
                    throw new InvalidOperationException("Name already exists");
            }
            _mapper.Map(postRequest, updatePost);
            await _context.SaveChangesAsync();
            return _mapper.Map<PostDto>(updatePost);

        }

        //Delete Post (User Areas or Admin)
        public async Task<int> DeletePostAsync(Guid[] ids)
        {
            if (ids == null || ids.Length == 0)
            {
                throw new ArgumentException("Ids cannot be empty");
            }
            var postList = await _context.Posts
                .Where(p => ids.Contains(p.Id) && p.Status == PostStatus.Draft)
                .ToListAsync();
            if (!postList.Any())
            {
                throw new KeyNotFoundException("Can not found Post");
            }
            int deleteCount = 0;
            foreach (var post in postList)
            {
                _context.Remove(post);
                deleteCount++;
            }
            await _context.SaveChangesAsync();
            return deleteCount;


        }

    }


}
