// Logging service to handle log events in the application
class LoggingService {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Maximum number of logs to keep in memory
  }

  /**
   * Log an action with a message
   * @param {string} action - The action being performed
   * @param {string} message - Description of the action
   * @param {object} data - Additional data to log (optional)
   */
  logAction(action, message, data = {}) {
    const logEntry = {
      timestamp: new Date(),
      action,
      message,
      data
    };

    // Add to in-memory logs
    this.logs.push(logEntry);
    
    // Trim logs if they exceed the maximum
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // Store in localStorage for persistence
    this.storeLog(logEntry);
    
    // Print to console for development
    console.log(`[${logEntry.action}] ${logEntry.message}`, logEntry.data);
  }

  /**
   * Store log in localStorage
   * @param {object} logEntry - The log entry to store
   */
  storeLog(logEntry) {
    try {
      // Get existing logs
      const storedLogs = localStorage.getItem('app_logs');
      let logs = storedLogs ? JSON.parse(storedLogs) : [];
      
      // Add new log
      logs.push({
        ...logEntry,
        timestamp: logEntry.timestamp.toISOString() // Convert Date to string for JSON
      });
      
      // Trim logs if they exceed the maximum
      if (logs.length > this.maxLogs) {
        logs = logs.slice(-this.maxLogs);
      }
      
      // Save back to localStorage
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Error storing log:', error);
    }
  }

  /**
   * Get all stored logs
   * @returns {Array} - Array of log entries
   */
  getLogs() {
    try {
      const storedLogs = localStorage.getItem('app_logs');
      return storedLogs ? JSON.parse(storedLogs) : [];
    } catch (error) {
      console.error('Error retrieving logs:', error);
      return [];
    }
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('app_logs');
  }

  /**
   * Log a user authentication event
   * @param {string} username - The username
   * @param {boolean} success - Whether authentication was successful
   * @param {string} message - Additional message
   */
  logAuth(username, success, message = '') {
    const action = success ? 'AUTH_SUCCESS' : 'AUTH_FAILURE';
    this.logAction(action, message, { username });
  }

  /**
   * Log a navigation event
   * @param {string} from - The previous route
   * @param {string} to - The new route
   */
  logNavigation(from, to) {
    this.logAction('NAVIGATION', `Navigated from ${from} to ${to}`);
  }

  /**
   * Log an API request
   * @param {string} method - The HTTP method (GET, POST, etc.)
   * @param {string} url - The API endpoint
   * @param {object} params - Request parameters
   * @param {number} status - Response status code
   */
  logApiRequest(method, url, params = {}, status = null) {
    this.logAction('API_REQUEST', `${method} request to ${url}`, { 
      method, 
      url, 
      params, 
      status 
    });
  }

  /**
   * Log an error
   * @param {string} message - Error message
   * @param {object} error - Error object
   */
  logError(message, error = {}) {
    this.logAction('ERROR', message, { 
      error: error.toString(), 
      stack: error.stack 
    });
  }
}

// Create singleton instance
const loggingService = new LoggingService();

export default loggingService; 