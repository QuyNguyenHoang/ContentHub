using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;
using ContentHub.Infrastructure.SeedWorks;
using ContentHub.Infrastructure.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.IO.MemoryMappedFiles;
using System.Transactions;
using static ContentHub.Domain.SeedWorks.Constant.Permissions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ContentHub.Infrastructure.Repositories
{
    public class PostRepository : RepositoryBase<Post, Guid>, IPostRepository
    {
        private readonly IMapper _mapper;
        private readonly IRepository<Post, Guid> _repo;
        private readonly ContentHub.Infrastructure.Service.IEmailSender _emailSender;
        private readonly ILogger<PostRepository> _logger;
        public PostRepository(ContentHubDbContext context, IMapper mapper,
            IRepository<Post, Guid> repo,
            IEmailSender emailSender,
            ILogger<PostRepository> logger
            ) : base(context)
        {
            _mapper = mapper;
            _repo = repo;
            _emailSender = emailSender;
            _logger = logger;
        }

        public async Task<PagedResult<PostDto>> GetPostPagedAsync(
    string? keyword,
    string? filter,
    int pageNumber = 1,
    int pageSize = 10,
    bool isAdmin = false)
        {
            keyword = keyword?.Trim();
            filter = filter?.Trim();
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;


            var query = _context.Posts.Where(p => !p.IsDeleted).AsNoTracking();

            if (!isAdmin)
            {
                query = query.Where(p => p.Status == PostStatus.Published);
            }

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
            //Count comment
            var commentCounts = await _context.Comments
                .GroupBy(c => c.PostId)
                .Select(g => new
                {
                    PostId = g.Key,
                    Count = g.Count()
                })
                .ToDictionaryAsync(x => x.PostId, x => x.Count);


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
                        Status = p.Status,
                        Slug = p.Slug,
                        IsPaid = p.IsPaid,
                        IsDeleted = p.IsDeleted,
                        Content = p.Content ?? "No content",
                        Description = p.Description,
                        DateCreated = p.DateCreated,
                        DateModified = p.DateModified,
                        CategoryName = p.Category != null ? p.Category.Name : "No Category",
                        CategorySlug = p.Category != null && !string.IsNullOrEmpty(p.Category.Slug)
                    ? p.Category.Slug
                    : "No Slug",

                        AuthorName = p.Author != null
                            ? p.Author.GetFullName()
                            : null,
                        AuthorAvatar = p.Author != null ? p.Author.Avatar : "No Avatar",
                        CommentCount = commentCounts.ContainsKey(p.Id) ? commentCounts[p.Id] : 0,
                        ListTag = p.PostTags
                        .Where(pt => pt.Tag != null)
                        .Select(pt => new TagDto
                        {
                            Name = pt.Tag != null ? pt.Tag.Name : "",
                            Slug = pt.Tag != null ? pt.Tag.Slug : "",
                        })
                        .ToList(),


                    }).ToListAsync();

            return new PagedResult<PostDto>
            {
                Results = items,
                RowCount = totalCount,
                PageSize = pageSize,
                CurrentPage = pageNumber
            };
        }
        //List post deleted
        public async Task<PagedResult<PostDto>> GetListPostDeletedAsync(string? keyword,
            string? filter,
            int pageNumber = 1,
            int pageSize = 10)
        {
            filter = filter?.Trim().ToLower();
            keyword = keyword?.Trim();
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;
            var query = _context.Posts.Where(p => p.IsDeleted).AsNoTracking();
            if (!string.IsNullOrWhiteSpace(filter))
            {
                if (filter == "date")
                {
                    query = query.OrderBy(p => p.DateModified);
                }
                else if (filter == "newest")
                {
                    query = query.OrderByDescending(p => p.DateModified);
                }

            }
            else
            {
                query = query.OrderByDescending(p => p.DateModified);
            };
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(p => p.Name.Contains(keyword) ||
                (p.Author != null && (p.Author.FirstName + "" + p.Author.LastName).Contains(keyword)) ||
                (p.PostTags.Any(pt =>
            pt.Tag != null &&
            pt.Tag.Name.Contains(keyword))));
            }
            var totalCount = await query.CountAsync();
            //Data
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Status = p.Status,
                    Slug = p.Slug,
                    IsPaid = p.IsPaid,
                    IsDeleted = p.IsDeleted,
                    Content = p.Content ?? "No content",
                    Description = p.Description,
                    DateCreated = p.DateCreated,
                    DateModified = p.DateModified,
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
                        .ToList(),
                })

                .ToListAsync();
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
            //var checkCategoryId = await IsCategoryExisted(postRequest.CategoryId);
            //Console.WriteLine($"CategoryID = {checkCategoryId}");
            //if (!checkCategoryId)
            //{
            //    throw new InvalidOperationException("Post Category Invalid!!!");
            //}

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
            var post = await _context.Posts
                .Where(p=>p.Id == postId)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Status = p.Status,
                    Slug = p.Slug,
                    IsPaid = p.IsPaid,
                    IsDeleted = p.IsDeleted,
                    Content = p.Content ?? "No content",
                    Description = p.Description,
                    DateCreated = p.DateCreated,
                    DateModified = p.DateModified,
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
                        .ToList(),
                }).FirstOrDefaultAsync();
            if (post == null)
            {
                throw new KeyNotFoundException("Không tìm thấy post");
            }
            return post;

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
        //Total posts
        public async Task<int> GetTotalPostsAsync()
        {
            return await _context.Posts.Where(p => !p.IsDeleted).CountAsync();
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
        public async Task Approve(Guid postId, Guid adminId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            var post = await _context.Posts
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p => p.Id == postId);

            if (post == null)
            {
                throw new KeyNotFoundException("Post not found");
            }
            if (post?.Author == null)
            {
                throw new KeyNotFoundException("Post author not found");
            }

            var userEmail = post.Author.Email;

            if (post.Status != PostStatus.Pending)
            {
                throw new InvalidOperationException("Only pending posts can be approved");
            }

            var admin = await _context.Users.FindAsync(adminId);

            if (admin == null)
            {
                throw new KeyNotFoundException("Admin not found");
            }

            var activityLog = new PostActivityLog
            {
                Id = Guid.NewGuid(),
                FromStatus = post.Status,
                ToStatus = PostStatus.Published,
                UserId = admin.Id,
                PostId = post.Id,
                Note = $"Post approved by {admin.FirstName} {admin.LastName}",

            };

            post.Status = PostStatus.Published;


            _context.PostActivityLogs.Add(activityLog);

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            try
            {
                if (userEmail != null)
                {
                    await _emailSender.SendEmailAsync(
                    userEmail,
                    "Your post has been approved",
                    $@"
                <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                    <h2 style='color: #16a34a;'>
                        Your post has been approved
                    </h2>

                    <p>Hello {post.Author.FirstName},</p>

                    <p>
                        Your post 
                        <strong>{post.Name}</strong> 
                        has been reviewed and approved by our administrator.
                    </p>

                    <p>
                        Your content is now publicly available on ContentHub.
                    </p>

                    <hr />

                    <p style='font-size: 14px; color: gray;'>
                        Thank you for contributing to ContentHub.
                    </p>
                </div>
                "

            );
                }
            }
            catch (Exception)
            {
            }


        }

        //Return back for User (Post invalid)
        public async Task ReturnBack(Guid postId, Guid adminId)
        {

            using var transaction = await _context.Database.BeginTransactionAsync();
            var post = await _context.Posts
                   .Include(p => p.Author)
                   .FirstOrDefaultAsync(p => p.Id == postId);

            if (post == null)
            {
                throw new KeyNotFoundException("Not found Post");
            }
            if (post.Author == null)
            {
                throw new KeyNotFoundException("Not found");
            }
            var userEmail = post.Author.Email;
            try
            {

                var adminApprove = await _context.Users
                        .FirstOrDefaultAsync(u => u.Id == adminId);
                if (adminApprove == null)
                {
                    throw new KeyNotFoundException("Not found User");
                }
                var postActivity = new PostActivityLog
                {
                    Id = Guid.NewGuid(),
                    FromStatus = post.Status,
                    ToStatus = PostStatus.Rejected,
                    UserId = adminApprove.Id,
                    PostId = post.Id,
                    Note = ("This post is InValid")
                };
                _context.PostActivityLogs.Add(postActivity);
                post.Status = PostStatus.Rejected;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
            try
            {
                if (userEmail != null)
                {
                    await _emailSender.SendEmailAsync(
                        userEmail,
                        "Your post has been Rejected!!!",
                       $@"
                <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                    <h2 style='color: #16a34a;'>
                        Your post was Rejected
                    </h2>

                    <p>Hello {post.Author.FirstName},</p>

                    <p>
                        Your post 
                        <strong>{post.Name}</strong> 
                        has been reviewed and Rejected by our administrator. Because your post is Invalid!!! 
                    </p>

                   

                    <p style='font-size: 14px; color: gray;'>
                        Thank you for contributing to ContentHub.
                    </p>
                </div>
                "
                        );
                }
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, ex.Message);
                throw;
            }

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
                ToStatus = PostStatus.Pending,
                Note = ($"{user.UserName} waiting for Approve")

            };
            _context.PostActivityLogs.Add(postAvtivity);
            post.Status = PostStatus.Pending;
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
        public async Task<int> DeletePostAsync(Guid[] ids, bool isSoftDelete)
        {
            if (ids == null || ids.Length == 0)
            {
                throw new ArgumentException("Ids cannot be empty");
            }
            var postList = await _context.Posts
                .Where(p => ids.Contains(p.Id))
                .ToListAsync();
            if (!postList.Any())
            {
                throw new KeyNotFoundException("Posts not found!!!");
            }
            int deleteCount = 0;
            foreach (var post in postList)
            {
                if (isSoftDelete)
                {
                    _context.Remove(post);
                }
                else
                {
                    post.IsDeleted = true;
                }

                deleteCount++;
            }
            await _context.SaveChangesAsync();
            return deleteCount;


        }

        //Restore deleted post
        public async Task<int> RestoreDeletedPostAsync(Guid[] ids)
        {
            if (ids == null || ids.Length == 0)
            {
                throw new ArgumentException("Post ids cannot be empty.");
            }
            int restoreCount = await _context.Posts.Where(p => ids.Contains(p.Id) && p.IsDeleted)
                .ExecuteUpdateAsync(p => p.SetProperty(x => x.IsDeleted, false));

            await _context.SaveChangesAsync();
            return restoreCount;
        }
    }


}
