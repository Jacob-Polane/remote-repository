import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProviderSelection from './ProviderSelection';
import ProjectSelection from './ProjectSelection';
import RepositorySelection from './RepositorySelection';
import BranchSelection from './BranchSelection';
import WizardSummary from './WizardSummary';
import axios from 'axios';
import './RepositoryWizard.css';

// API endpoints - adjusting paths to match the controller routes
const API_ENDPOINTS = {
  AZURE_PROJECTS: '/projects',
  AZURE_REPOSITORIES: (projectId) => `/repositories/${projectId}`,
  GITHUB_REPOSITORIES: '/repositories',
  AZURE_BRANCHES: (projectId, repositoryId) => `/branches/azure/${projectId}/${repositoryId}`,
  GITHUB_BRANCHES: (owner, repo) => `/branches/github/${owner}/${repo}`
};

const RepositoryWizard = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [provider, setProvider] = useState('');
  const [projects, setProjects] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedRepository, setSelectedRepository] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // For GitHub, we need to track the repository owner
  const [repoOwner, setRepoOwner] = useState('');
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Get the auth header with token for API requests
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }, []);

  // Reset selections when provider changes
  useEffect(() => {
    setSelectedProject('');
    setSelectedRepository('');
    setSelectedBranch('');
    setRepositories([]);
    setBranches([]);
    
    if (provider === 'AzureDevOps') {
      fetchProjects();
    } else if (provider === 'GitHub') {
      fetchGitHubRepositories();
    }
  }, [provider]);

  // Fetch projects from Azure DevOps
  const fetchProjects = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(API_ENDPOINTS.AZURE_PROJECTS, getAuthHeader());
      setProjects(response.data);
      console.log('Fetched projects:', response.data);
    } catch (err) {
      handleApiError(err, 'Failed to fetch Azure DevOps projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch repositories based on selected project (Azure DevOps)
  const fetchAzureDevOpsRepositories = async (projectId) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(
        API_ENDPOINTS.AZURE_REPOSITORIES(projectId),
        getAuthHeader()
      );
      setRepositories(response.data);
      console.log('Fetched Azure repositories:', response.data);
    } catch (err) {
      handleApiError(err, 'Failed to fetch repositories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch GitHub repositories
  const fetchGitHubRepositories = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(
        API_ENDPOINTS.GITHUB_REPOSITORIES,
        getAuthHeader()
      );
      setRepositories(response.data);
      // Set a default owner for GitHub repositories
      setRepoOwner('octokit'); // This should be dynamically determined from the authenticated user
      console.log('Fetched GitHub repositories:', response.data);
    } catch (err) {
      handleApiError(err, 'Failed to fetch GitHub repositories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch branches for the selected repository
  const fetchBranches = async (repositoryId) => {
    setIsLoading(true);
    setError('');
    try {
      let response;
      
      if (provider === 'AzureDevOps') {
        response = await axios.get(
          API_ENDPOINTS.AZURE_BRANCHES(selectedProject, repositoryId),
          getAuthHeader()
        );
      } else {
        // For GitHub we need the owner and repo name
        response = await axios.get(
          API_ENDPOINTS.GITHUB_BRANCHES(repoOwner, repositoryId),
          getAuthHeader()
        );
      }
      
      setBranches(response.data);
      console.log(`Fetched branches for ${provider}:`, response.data);
    } catch (err) {
      handleApiError(err, 'Failed to fetch branches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle API errors
  const handleApiError = (err, defaultMessage) => {
    console.error('API Error:', err);
    
    if (err.response && err.response.status === 401) {
      // Unauthorized - token might be expired or invalid
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      setError(defaultMessage);
    }
  };

  // Handle project selection
  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    fetchAzureDevOpsRepositories(projectId);
  };

  // Handle repository selection
  const handleRepositorySelect = (repoId) => {
    setSelectedRepository(repoId);
    fetchBranches(repoId);
  };

  // Handle next step
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Handle previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Determine total steps based on provider
  const getTotalSteps = () => {
    return provider === 'AzureDevOps' ? 4 : 3;
  };

  // Dynamic rendering based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProviderSelection 
            provider={provider} 
            setProvider={setProvider} 
            nextStep={nextStep}
          />
        );
      case 2:
        if (provider === 'AzureDevOps') {
          return (
            <ProjectSelection 
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={handleProjectSelect}
              isLoading={isLoading}
              error={error}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          );
        } else {
          return (
            <RepositorySelection 
              repositories={repositories}
              selectedRepository={selectedRepository}
              onSelectRepository={handleRepositorySelect}
              isLoading={isLoading}
              error={error}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          );
        }
      case 3:
        if (provider === 'AzureDevOps') {
          return (
            <RepositorySelection 
              repositories={repositories}
              selectedRepository={selectedRepository}
              onSelectRepository={handleRepositorySelect}
              isLoading={isLoading}
              error={error}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          );
        } else {
          return (
            <BranchSelection 
              branches={branches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              isLoading={isLoading}
              error={error}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          );
        }
      case 4:
        return (
          <BranchSelection 
            branches={branches}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            isLoading={isLoading}
            error={error}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <WizardSummary 
            provider={provider}
            selectedProject={selectedProject} 
            selectedRepository={selectedRepository}
            selectedBranch={selectedBranch}
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="repository-wizard">
      <div className="wizard-header">
        <h1>Repository Selection Wizard</h1>
        <div className="progress-bar">
          {Array.from({ length: getTotalSteps() + 1 }).map((_, index) => (
            <div 
              key={index} 
              className={`progress-step ${index + 1 <= currentStep ? 'active' : ''}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="wizard-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default RepositoryWizard; 