/**
 * Response panel component
 * Displays AI-generated responses and explanations
 */
import React from 'react';

const ResponsePanel = ({ response, onInsertCode }) => {
  return (
    <div className="response-panel">
      <div className="response-header">
        <h3>AI Response</h3>
        {response && (
          <button onClick={onInsertCode} className="insert-btn">
            Insert into Editor
          </button>
        )}
      </div>
      
      <div className="response-content">
        {response ? (
          <pre>{response}</pre>
        ) : (
          <p className="placeholder">
            AI responses will appear here. Use the prompt panel to generate, edit, or explain code.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResponsePanel;
