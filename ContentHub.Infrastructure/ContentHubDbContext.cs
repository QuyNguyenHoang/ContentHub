using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;


namespace ContentHub.Infrastructure
{
    public class ContentHubDbContext : IdentityDbContext<AppUser, AppRole, Guid>
    {
        public ContentHubDbContext (DbContextOptions options) : base(options) { }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostActivityLog> PostActivityLogs { get; set; }
        public DbSet<PostCategory> PostCategories { get; set; }
        public DbSet<PostPicture> PostPictures { get; set; }
        public DbSet<PostSeries> PostSeries { get; set; }
        public DbSet<PostTag> PostTags { get; set; }
        public DbSet<PostVideo> PostVideos { get; set; }

        public DbSet<Series> Series { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<SubscriptionPayment> SubscriptionsPayments { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<WalletTransaction> WalletTransactions { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)

        {
            builder.Entity<AppUser>().ToTable("AppUsers");
            builder.Entity<AppRole>().ToTable("AppRoles");
            builder.Entity<IdentityUserClaim<Guid>>().ToTable("AppUserClaims").HasKey(x => x.Id);

            builder.Entity<IdentityRoleClaim<Guid>>().ToTable("AppRoleClaims")
            .HasKey(x => x.Id);

            builder.Entity<IdentityUserLogin<Guid>>().ToTable("AppUserLogins").HasKey(x => x.UserId);

            builder.Entity<IdentityUserRole<Guid>>().ToTable("AppUserRoles")
            .HasKey(x => new { x.RoleId, x.UserId });

            builder.Entity<IdentityUserToken<Guid>>().ToTable("AppUserTokens")
               .HasKey(x => new { x.UserId });
           
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(
                            new ValueConverter<DateTime, DateTime>(
                                v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
                                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                            )
                        );
                    }
                }
            }
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
               .Entries()
               .Where(e => e.State == EntityState.Added);

            foreach (var entityEntry in entries)
            {
                var dateCreatedProp = entityEntry.Entity.GetType().GetProperty(SystemConsts.DateCreatedField);
                if (entityEntry.State == EntityState.Added
                    && dateCreatedProp != null)
                {
                    dateCreatedProp.SetValue(entityEntry.Entity, DateTime.UtcNow);
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }

    }
}
