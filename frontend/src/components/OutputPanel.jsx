/**
 * Output panel component
 * Shows code execution results for Python and JavaScript
 */
import React from 'react';

const OutputPanel = ({ output, error, onExecute, loading, canExecute }) => {
  return (
    <div className="output-panel">
      <div className="output-header">
        <h3>Output</h3>
        <button 
          onClick={onExecute} 
          disabled={loading || !canExecute}
          className="execute-btn"
        >
          {loading ? 'Running...' : 'Run Code'}
        </button>
      </div>
      
      <div className="output-content">
        {error ? (
          <div className="error-output">
            <strong>Error:</strong>
            <pre>{error}</pre>
          </div>
        ) : output ? (
          <div className="success-output">
            <pre>{output}</pre>
          </div>
        ) : (
          <p className="placeholder">
            {canExecute 
              ? 'Click "Run Code" to execute Python or JavaScript code' 
              : 'Code execution only available for Python and JavaScript'}
          </p>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
