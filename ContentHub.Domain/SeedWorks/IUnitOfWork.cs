namespace ContentHub.Domain.SeedWorks
{
    public interface IUnitOfWork
    { 
        Task<int> CompleteAsync();
    }
}
