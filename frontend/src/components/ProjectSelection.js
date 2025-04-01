import React from 'react';

const ProjectSelection = ({ 
  projects, 
  selectedProject, 
  onSelectProject, 
  isLoading, 
  error, 
  nextStep, 
  prevStep 
}) => {
  const handleSelectProject = (projectId) => {
    onSelectProject(projectId);
  };

  const handleNext = () => {
    if (selectedProject) {
      nextStep();
    }
  };

  const renderProjectList = () => {
    if (isLoading) {
      return (
        <div className="loading-indicator">
          <p>Loading projects...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          {error}
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div className="no-results">
          <p>No projects found. Please check your connection to Azure DevOps.</p>
        </div>
      );
    }

    return (
      <div className="project-list">
        {projects.map((project) => (
          <div 
            key={project.id || project} 
            className={`card-item ${selectedProject === (project.id || project) ? 'selected' : ''}`}
            onClick={() => handleSelectProject(project.id || project)}
          >
            <div className="card-header">
              <h3>{project.name || project}</h3>
            </div>
            {project.description && (
              <div className="card-body">
                <p>{project.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Select Azure DevOps Project</h2>
      
      {renderProjectList()}

      <div className="button-group">
        <button className="button btn-secondary" onClick={prevStep}>
          Back
        </button>
        <button 
          className="button btn-primary" 
          onClick={handleNext} 
          disabled={!selectedProject}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectSelection; 