using Repository.Domain.Entities;
using Repository.Infrastructure.Interfaces;

namespace Repository.Application.Services
{
    public class RepositoryService
    {
        private readonly IGenericRepository<RepositorySelection> _repository;
        private readonly IAzureDevOpsManager _azureDevOpsManager;
        private readonly IGithubManager _githubManager;

        public RepositoryService(IGenericRepository<RepositorySelection> repository, IAzureDevOpsManager azureDevOpsManager, IGithubManager githubManager)
        {
            _repository = repository;
            _azureDevOpsManager = azureDevOpsManager;
            _githubManager = githubManager;
        }

        public async Task<List<string>> GetAllProject()
        {
            return await _azureDevOpsManager.GetProjectsAsync();
        }

        /// <summary>
        /// Get All Repositories
        /// </summary>
        /// <param name="type"></param>
        /// <param name="projectName"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task<List<string>> GetAllRepositories(string type, string projectName)
        {
            return type switch
            {
                "github"=> await _githubManager.GetRepositoriesAsync(),
                "azuredevops" => await _azureDevOpsManager.GetRepositoriesAsync(projectName),
                _ => throw new InvalidOperationException("Unexpected repository type")
            };
        }

        public async Task Persist(RepositorySelection entity)
        {
            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

        }

    }
}
