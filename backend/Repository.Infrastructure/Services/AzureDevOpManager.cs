using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using Repository.Infrastructure.Interfaces;
using Repository.Infrastructure.Services;

namespace Repository.Infrastructure.Services.AzureDevOps
{
    public class AzureDevOpManager : IAzureDevOpsManager
    {
        private readonly HttpClient _httpClient;
        private readonly string _organization = ""; // Replace with your Azure DevOps org
        private readonly string _personalAccessToken = "x"; // Use an environment variable!

        public AzureDevOpManager()
        {
            _httpClient = new HttpClient();
            var authToken = Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($":{_personalAccessToken}"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authToken);
        }

        public async Task<List<string>> GetProjectsAsync()
        {
            var url = $"https://dev.azure.com/{_organization}/_apis/projects?api-version=6.0";
            var response = await _httpClient.GetStringAsync(url);
            var json = JObject.Parse(response);
            return json["value"].Select(p => p["name"].ToString()).ToList();
        }

        public async Task<List<string>> GetRepositoriesAsync(string project)
        {
            var url = $"https://dev.azure.com/{_organization}/{project}/_apis/git/repositories?api-version=6.0";
            var response = await _httpClient.GetStringAsync(url);
            var json = JObject.Parse(response);
            return json["value"].Select(r => r["name"].ToString()).ToList();
        }

        public async Task<List<string>> GetBranchesAsync(string project, string repositoryId)
        {
            var url = $"https://dev.azure.com/{_organization}/{project}/_apis/git/repositories/{repositoryId}/refs?filter=heads&api-version=6.0";
            var response = await _httpClient.GetStringAsync(url);
            var json = JObject.Parse(response);
            return json["value"].Select(b => b["name"].ToString().Replace("refs/heads/", "")).ToList();
        }
    }

}
