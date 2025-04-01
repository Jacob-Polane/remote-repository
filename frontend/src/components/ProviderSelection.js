import React from 'react';

const ProviderSelection = ({ provider, setProvider, nextStep }) => {
  const handleSelectProvider = (providerName) => {
    setProvider(providerName);
  };

  const handleNext = () => {
    if (provider) {
      nextStep();
    }
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Select Source Control Provider</h2>
      <div className="provider-options">
        <div 
          className={`card-item ${provider === 'AzureDevOps' ? 'selected' : ''}`}
          onClick={() => handleSelectProvider('AzureDevOps')}
        >
          <div className="card-header">
            <h3>Azure DevOps</h3>
          </div>
          <div className="card-body">
            <p>Select Azure DevOps for projects managed in Azure DevOps Services</p>
          </div>
        </div>

        <div 
          className={`card-item ${provider === 'GitHub' ? 'selected' : ''}`}
          onClick={() => handleSelectProvider('GitHub')}
        >
          <div className="card-header">
            <h3>GitHub</h3>
          </div>
          <div className="card-body">
            <p>Select GitHub for repositories hosted on GitHub</p>
          </div>
        </div>
      </div>

      <div className="button-group">
        <div></div> {/* Empty div for spacing */}
        <button 
          className="button btn-primary" 
          onClick={handleNext} 
          disabled={!provider}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProviderSelection; 