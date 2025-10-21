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
      setError('Please enter a prompt');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedCode('');

    try {
      const response = await axios.post(`${API_URL}/generate`, {
        prompt: prompt
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.code) {
        setGeneratedCode(response.data.code);
      } else {
        setError('No code generated');
      }
    } catch (err) {
      console.error('Generate Error:', err);
      let errorMsg = 'Failed to generate code';
      
      if (err.response) {
        errorMsg = err.response.data?.detail || err.response.data?.message || errorMsg;
      } else if (err.request) {
        errorMsg = 'Backend server not responding. Please wait 30 seconds and try again.';
      } else {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
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
      setError('Please enter code to execute');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await axios.post(`${API_URL}/execute`, {
        code: editorCode,
        input: codeInput || ''
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.output !== undefined) {
        setOutput(response.data.output);
      } else {
        setOutput('Code executed but no output');
      }
    } catch (err) {
      console.error('Execute Error:', err);
      let errorMsg = 'Failed to execute code';
      
      if (err.response) {
        errorMsg = err.response.data?.detail || err.response.data?.message || errorMsg;
      } else if (err.request) {
        errorMsg = 'Backend server not responding';
      } else {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      setOutput('Error: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setEditorCode('');
    setCodeInput('');
    setOutput('');
    setError('');
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
              <label>Describe the code you want to generate:</label>
              <textarea
                className="description-input"
                rows="8"
                placeholder="Example: Create a Python function to calculate the factorial of a number"
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

          {/* GENERATED CODE PANEL */}
          {generatedCode && (
            <div className="output-panel-gen">
              <div className="section-header">
                <h2>✅ Generated Code</h2>
                <div className="header-actions">
                  <button 
                    className="btn-transfer"
                    onClick={transferToEditor}
                    disabled={loading}
                  >
                    ➡️ Transfer to Editor
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
                  disabled={loading || !editorCode}
                >
                  {loading ? '⏳ Running...' : '▶️ Run Code'}
                </button>
                <button 
                  className="btn-danger"
                  onClick={clearAll}
                >
                  🗑️ Clear
                </button>
              </div>
            </div>

            <div className="input-section">
              <label>Input (optional - one per line):</label>
              <textarea
                className="input-field"
                rows="2"
                placeholder="Enter inputs for your code..."
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
              />
            </div>

            <div className="editor-wrapper">
              <textarea
                className="code-editor"
                placeholder="Write or paste your code here, or transfer generated code from the left panel..."
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
