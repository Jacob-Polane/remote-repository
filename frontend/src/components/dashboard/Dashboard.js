import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loggingService from '../../services/LoggingService';
import './Dashboard.css';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    setIsAuthenticated(true);
    
    // Log navigation
    loggingService.logNavigation('previous', 'dashboard');
    
    // Load logs
    loadLogs();
  }, [navigate]);

  const loadLogs = () => {
    const allLogs = loggingService.getLogs();
    
    // Sort logs by timestamp (newest first)
    const sortedLogs = [...allLogs].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    setLogs(sortedLogs);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    loggingService.logAuth('user', false, 'User logged out');
    navigate('/login');
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      loggingService.clearLogs();
      setLogs([]);
      loggingService.logAction('LOGS_CLEARED', 'All logs were cleared');
    }
  };

  const filterLogs = (logs) => {
    if (filterType === 'all') {
      return logs;
    }
    
    return logs.filter(log => {
      switch (filterType) {
        case 'auth':
          return log.action.includes('AUTH');
        case 'api':
          return log.action.includes('API');
        case 'error':
          return log.action.includes('ERROR');
        case 'navigation':
          return log.action.includes('NAVIGATION');
        default:
          return true;
      }
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getLogTypeClass = (action) => {
    if (action.includes('ERROR')) return 'log-error';
    if (action.includes('AUTH')) return 'log-auth';
    if (action.includes('API')) return 'log-api';
    if (action.includes('NAVIGATION')) return 'log-navigation';
    return '';
  };

  const filteredLogs = filterLogs(logs);

  const handleRepositoryWizard = () => {
    loggingService.logNavigation('dashboard', 'repository-wizard');
    navigate('/repository-wizard');
  };

  if (!isAuthenticated) {
    return <div>Checking authentication...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <button className="wizard-button" onClick={handleRepositoryWizard}>
            Repository Wizard
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="logs-section">
          <div className="logs-header">
            <h2>Activity Logs</h2>
            <div className="logs-actions">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-dropdown"
              >
                <option value="all">All Logs</option>
                <option value="auth">Authentication</option>
                <option value="api">API Requests</option>
                <option value="error">Errors</option>
                <option value="navigation">Navigation</option>
              </select>
              <button onClick={loadLogs} className="refresh-button">
                Refresh
              </button>
              <button onClick={handleClearLogs} className="clear-button">
                Clear Logs
              </button>
            </div>
          </div>

          <div className="logs-container">
            {filteredLogs.length === 0 ? (
              <p className="no-logs">No logs available</p>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={index} className={`log-entry ${getLogTypeClass(log.action)}`}>
                  <div className="log-header">
                    <span className="log-timestamp">{formatTimestamp(log.timestamp)}</span>
                    <span className="log-action">{log.action}</span>
                  </div>
                  <div className="log-message">{log.message}</div>
                  {log.data && Object.keys(log.data).length > 0 && (
                    <div className="log-data">
                      <pre>{JSON.stringify(log.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard; 