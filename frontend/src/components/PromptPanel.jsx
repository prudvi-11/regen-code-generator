/**
 * Prompt input panel component
 * Allows users to enter instructions for AI code generation/editing
 */
import React, { useState } from 'react';

const PromptPanel = ({ onSubmit, loading, languages, selectedLanguage, onLanguageChange }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt(''); // Clear prompt after submission
    }
  };

  return (
    <div className="prompt-panel">
      <h3>AI Code Assistant</h3>
      
      {/* Language selector */}
      <div className="language-selector">
        <label htmlFor="language">Language: </label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={loading}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Prompt form */}
      <form onSubmit={handleSubmit} className="prompt-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your instruction:
- Generate a function to...
- Explain this code
- Refactor this code for better performance
- Debug this code
- Add comments to this code
- Optimize this algorithm"
          disabled={loading}
          rows={6}
        />
        
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Processing...' : 'Generate/Edit Code'}
        </button>
      </form>

      {/* Example prompts */}
      <div className="example-prompts">
        <h4>Example Prompts:</h4>
        <ul>
          <li>Generate a binary search function</li>
          <li>Explain the above code</li>
          <li>Refactor this code to use async/await</li>
          <li>Find and fix bugs in this code</li>
          <li>Optimize this sorting algorithm</li>
          <li>Add comprehensive documentation</li>
        </ul>
      </div>
    </div>
  );
};

export default PromptPanel;
