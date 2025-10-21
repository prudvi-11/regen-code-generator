import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const API_URL = 'https://regen-backend-17jv.onrender.com/api';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [editorCode, setEditorCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateCode = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedCode('');

    try {
      const response = await axios.post(`${API_URL}/generate`, {
        prompt: prompt
      });

      console.log('Response:', response.data);

      if (response.data && response.data.code) {
        setGeneratedCode(response.data.code);
      } else {
        setError('No code generated. Try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  const transferToEditor = () => {
    setEditorCode(generatedCode);
    setOutput('');
    setError('');
  };

  const executeCode = async () => {
    if (!editorCode.trim()) {
      alert('Please enter code to execute');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await axios.post(`${API_URL}/execute`, {
        code: editorCode,
        input: codeInput || ''
      });

      console.log('Execute Response:', response.data);
      setOutput(response.data.output || 'Code executed successfully');
    } catch (err) {
      console.error('Execute Error:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to execute code';
      setError(errorMsg);
      setOutput('Error: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* HEADER */}
      <header className="app-header">
        <div className="brand">
          <h1>REGEN</h1>
          <p className="developer-credit">Developed by B. Prudvi Thirumal Reddy</p>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="workspace">
        {/* LEFT PANEL - CODE GENERATOR */}
        <div className="generator-panel">
          <div className="section-header">
            <h2>⚡ AI Code Generator</h2>
          </div>

          <div className="generator-body">
            <div className="form-group">
              <label>Describe the code you want:</label>
              <textarea
                className="description-input"
                rows="8"
                placeholder="Example: Create a Python function to calculate factorial"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <button 
              className="btn-primary"
              onClick={generateCode}
              disabled={loading}
            >
              {loading ? '⏳ Generating...' : '✨ Generate Code'}
            </button>

            {error && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                color: '#991b1b',
                fontSize: '0.85rem'
              }}>
                ❌ {error}
              </div>
            )}
          </div>

          {/* GENERATED CODE OUTPUT PANEL */}
          {generatedCode && (
            <div className="output-panel-gen">
              <div className="section-header">
                <h2>✅ Generated Code</h2>
                <div className="header-actions">
                  <button 
                    className="btn-transfer"
                    onClick={transferToEditor}
                  >
                    ➡️ Transfer
                  </button>
                  <button 
                    className="btn-close"
                    onClick={() => setGeneratedCode('')}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="output-body">
                <pre className="generated-code">{generatedCode}</pre>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - CODE EDITOR */}
        <div className="right-panel">
          <div className="editor-section">
            <div className="section-header">
              <h2>📝 Code Editor</h2>
              <div className="header-actions">
                <button 
                  className="btn-success"
                  onClick={executeCode}
                  disabled={loading}
                >
                  ▶️ Run
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => {
                    setEditorCode('');
                    setCodeInput('');
                    setOutput('');
                    setError('');
                  }}
                >
                  🗑️ Clear
                </button>
              </div>
            </div>

            <div className="input-section">
              <label>Input (optional):</label>
              <textarea
                className="input-field"
                rows="2"
                placeholder="Enter inputs..."
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
              />
            </div>

            <div className="editor-wrapper">
              <textarea
                className="code-editor"
                placeholder="Transfer generated code or write your own..."
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  border: 'none',
                  padding: '1rem',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* TERMINAL OUTPUT */}
          {output && (
            <div className="terminal-panel">
              <div className="section-header terminal-header">
                <h2>💻 Output Terminal</h2>
                <button 
                  className="btn-close"
                  onClick={() => setOutput('')}
                  style={{color: '#60a5fa'}}
                >
                  ✕
                </button>
              </div>
              <div className="terminal-body">
                <pre className="terminal-output">{output}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="app-footer">
        <p>
          <strong>Developed by B. Prudvi Thirumal Reddy</strong> | 
          <a href="https://github.com/prudvi-11" target="_blank" rel="noopener noreferrer">
            GitHub
          </a> | 
          <a href="https://github.com/prudvi-11/regen-code-generator" target="_blank" rel="noopener noreferrer">
            View Source
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
