namespace Repository.Infrastructure.Interfaces
{
    public interface IAzureDevOpsManager
    {
        public Task<List<string>> GetProjectsAsync();
        public Task<List<string>> GetRepositoriesAsync(string project);
        public Task<List<string>> GetBranchesAsync(string project, string repositoryId);
    }
}
