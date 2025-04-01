using Octokit;
using Repository.Infrastructure.Interfaces;
using ProductHeaderValue = Octokit.ProductHeaderValue;

namespace Repository.Infrastructure.Services.Github
{
    public class GitHubManager : IGithubManager
    {
        private readonly GitHubClient _client;

        public GitHubManager(string githubToken = "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")
        {
            _client = new GitHubClient(new ProductHeaderValue("GithubManager"));
            _client.Credentials = new Credentials(githubToken);
        }

        // Get authenticated user's repositories
        public async Task<List<string>> GetRepositoriesAsync()
        {
            var repositories = await _client.Repository.GetAllForCurrent();
            return repositories.Select(repo => repo.Name).ToList();
        }

        // Get branches for a given repository
        public async Task<List<string>> GetBranchesAsync(string owner, string repo)
        {
            var branches = await _client.Repository.Branch.GetAll(owner, repo);
            return branches.Select(branch => branch.Name).ToList();
        }
    }
}

