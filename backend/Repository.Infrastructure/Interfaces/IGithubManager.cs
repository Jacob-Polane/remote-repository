namespace Repository.Infrastructure.Interfaces
{
    public interface IGithubManager
    {
        public Task<List<string>> GetRepositoriesAsync();
        public Task<List<string>> GetBranchesAsync(string owner, string repo);
    }
}
