import React from 'react';

const BranchSelection = ({ 
  branches, 
  selectedBranch, 
  setSelectedBranch, 
  isLoading, 
  error, 
  nextStep, 
  prevStep 
}) => {
  const handleSelectBranch = (branchName) => {
    setSelectedBranch(branchName);
  };

  const handleNext = () => {
    if (selectedBranch) {
      nextStep();
    }
  };

  const renderBranchList = () => {
    if (isLoading) {
      return (
        <div className="loading-indicator">
          <p>Loading branches...</p>
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

    if (branches.length === 0) {
      return (
        <div className="no-results">
          <p>No branches found for this repository.</p>
        </div>
      );
    }

    return (
      <div className="branch-list">
        {branches.map((branch) => (
          <div 
            key={branch.name || branch} 
            className={`card-item ${selectedBranch === (branch.name || branch) ? 'selected' : ''}`}
            onClick={() => handleSelectBranch(branch.name || branch)}
          >
            <div className="card-header">
              <h3>{branch.name || branch}</h3>
            </div>
            {branch.lastCommitMessage && (
              <div className="card-body">
                <p><strong>Last commit:</strong> {branch.lastCommitMessage}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Select Branch</h2>
      
      {renderBranchList()}

      <div className="button-group">
        <button className="button btn-secondary" onClick={prevStep}>
          Back
        </button>
        <button 
          className="button btn-primary" 
          onClick={handleNext} 
          disabled={!selectedBranch}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BranchSelection; 