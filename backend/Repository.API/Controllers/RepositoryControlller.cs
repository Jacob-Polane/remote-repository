using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Infrastructure.Interfaces;

namespace Repository.Controllers
{
    [Authorize]
    [ApiController]
    public class RepositoryController : ControllerBase
    {
        private readonly IGithubManager _gitHubManager;
        private readonly IAzureDevOpsManager _azureDevOpsManager;
        public RepositoryController(IGithubManager gitHubManager, IAzureDevOpsManager azureDevOpsManager)
        {
            _gitHubManager = gitHubManager;
            _azureDevOpsManager = azureDevOpsManager;
        }

        [HttpGet("projects")]
        public async Task<List<string>> GetAzureDevOpsProjects()
        {
            var projects = await _azureDevOpsManager.GetProjectsAsync();
            return projects;
        }

        [HttpGet("repositories/{projectId}")]
        public async Task<IActionResult> GetAzureDevOpsRepositories(string projectId)
        {
            var repos = await _azureDevOpsManager.GetRepositoriesAsync(projectId);
            return Ok(repos);
        }

        [HttpGet("repositories")]
        public async Task<IActionResult> GetGitHubRepositories()
        {
            var repos = await _gitHubManager.GetRepositoriesAsync();
            return Ok(repos);
        }

        [HttpGet("branches/azure/{projectId}/{repositoryId}")]
        public async Task<IActionResult> GetAzureDevOpsBranches(string projectId, string repositoryId)
        {
            var branches = await _azureDevOpsManager.GetBranchesAsync(projectId, repositoryId);
            return Ok(branches);
        }

        [HttpGet("branches/github/{owner}/{repo}")]
        public async Task<IActionResult> GetGitHubBranches(string owner, string repo)
        {
            var branches = await _gitHubManager.GetBranchesAsync(owner, repo);
            return Ok(branches);
        }
    }
}
