import React from 'react';

const RepositorySelection = ({ 
  repositories, 
  selectedRepository, 
  onSelectRepository, 
  isLoading, 
  error, 
  nextStep, 
  prevStep 
}) => {
  const handleSelectRepository = (repoId) => {
    onSelectRepository(repoId);
  };

  const handleNext = () => {
    if (selectedRepository) {
      nextStep();
    }
  };

  const renderRepositoryList = () => {
    if (isLoading) {
      return (
        <div className="loading-indicator">
          <p>Loading repositories...</p>
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

    if (repositories.length === 0) {
      return (
        <div className="no-results">
          <p>No repositories found. Please check your connection.</p>
        </div>
      );
    }

    return (
      <div className="repository-list">
        {repositories.map((repo) => (
          <div 
            key={repo.id || repo} 
            className={`card-item ${selectedRepository === (repo.id || repo) ? 'selected' : ''}`}
            onClick={() => handleSelectRepository(repo.id || repo)}
          >
            <div className="card-header">
              <h3>{repo.name || repo}</h3>
            </div>
            {repo.description && (
              <div className="card-body">
                <p>{repo.description}</p>
              </div>
            )}
            {repo.url && (
              <div className="card-footer">
                <small>{repo.url}</small>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Select Repository</h2>
      
      {renderRepositoryList()}

      <div className="button-group">
        <button className="button btn-secondary" onClick={prevStep}>
          Back
        </button>
        <button 
          className="button btn-primary" 
          onClick={handleNext} 
          disabled={!selectedRepository}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RepositorySelection; 