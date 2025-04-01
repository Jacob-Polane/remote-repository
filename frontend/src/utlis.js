// export const fetchProjects = async () => {
//     if (provider === "AzureDevOps") {
//       const response = await fetch("/projects");
//       const data = await response.json();
//       setProjects(data);
//     }
//   };
  
//   export const fetchRepositories = async (project = null) => {
//     if (provider === "AzureDevOps" && project) {
//       const response = await fetch(`/repositories/${project}`);
//       const data = await response.json();
//       setRepositories(data);
//     } else if (provider === "GitHub") {
//       const response = await fetch("/repositories");
//       const data = await response.json();
//       setRepositories(data);
//     }
//   };
  
// //   const fetchBranches = async (repo) => {
// //     if (provider === "AzureDevOps" && selectedProject) {
// //       const response = await fetch(`/api/source-control/azure/branches/${selectedProject}/${repo}`);
// //       const data = await response.json();
// //       setBranches(data);
// //     } else if (provider === "GitHub") {
// //       const response = await fetch(`/api/source-control/github/branches/your-github-username/${repo}`);
// //       const data = await response.json();
// //       setBranches(data);
// //     }
// //   };
  