using AutoMapper;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks;
using ContentHub.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;

namespace ContentHub.Infrastructure.SeedWorks
{

    public class UnitOfWork : IUnitOfWork
    {
        private readonly ContentHubDbContext _context;
        public UnitOfWork(ContentHubDbContext context)
        {
            _context = context;
        }
        
        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
