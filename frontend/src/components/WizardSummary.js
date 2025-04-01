import React, { useState } from 'react';

const WizardSummary = ({ 
  provider, 
  selectedProject, 
  selectedRepository, 
  selectedBranch, 
  prevStep 
}) => {
  // Add state for showing the success toast
  const [showToast, setShowToast] = useState(false);

  // Handle save configuration click
  const handleSaveClick = () => {
    setShowToast(true);
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Get provider icon based on selected provider
  const getProviderIcon = () => {
    switch(provider) {
      case 'AzureDevOps':
        return '🔷'; // Azure DevOps icon
      case 'GitHub':
        return '🐙'; // GitHub icon
      default:
        return '📁'; // Default icon
    }
  };

  // Format the data for display cards
  const summaryData = [
    {
      title: 'Source Control Provider',
      value: provider,
      icon: getProviderIcon()
    },
    ...(provider === 'AzureDevOps' ? [{
      title: 'Azure Project',
      value: selectedProject,
      icon: '📋'
    }] : []),
    {
      title: 'Repository',
      value: selectedRepository,
      icon: '📦'
    },
    {
      title: 'Branch',
      value: selectedBranch,
      icon: '🔀'
    }
  ];

  return (
    <div className="step-container">
      <h2 className="step-title">Repository Configuration Summary</h2>
      
      <div className="summary-container">
        <div className="summary-header">
          <div className="summary-icon">{getProviderIcon()}</div>
          <h3 className="summary-provider-title">{provider} Configuration</h3>
        </div>
        
        <div className="summary-cards">
          {summaryData.map((item, index) => (
            <div key={index} className="summary-card">
              <div className="card-icon">{item.icon}</div>
              <div className="card-content">
                <h4 className="card-title">{item.title}</h4>
                <p className="card-value">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="summary-success">
          <div className="success-icon">✅</div>
          <p className="success-message">
            Your repository configuration is complete and ready to use!
          </p>
        </div>
      </div>

      <div className="button-group">
        <button className="button btn-secondary" onClick={prevStep}>
          Back
        </button>
        <button 
          className="button btn-primary" 
          onClick={handleSaveClick}
        >
          Save Configuration
        </button>
      </div>
      
      {/* Success Toast Notification */}
      {showToast && (
        <div className="toast-notification success">
          <div className="toast-icon">✅</div>
          <div className="toast-content">
            <h4>Success!</h4>
            <p>Configuration saved successfully!</p>
          </div>
          <button className="toast-close" onClick={() => setShowToast(false)}>×</button>
        </div>
      )}
    </div>
  );
};

export default WizardSummary; 