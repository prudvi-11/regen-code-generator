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
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedCode('');

    try {
      const response = await axios.post(`${API_URL}/generate`, {
        prompt: prompt
      });

      setGeneratedCode(response.data.code);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  const transferToEditor = () => {
    setEditorCode(generatedCode);
    setOutput('');
  };

  const executeCode = async () => {
    if (!editorCode.trim()) {
      setError('Please enter code to execute');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await axios.post(`${API_URL}/execute`, {
        code: editorCode,
        input: codeInput
      });

      setOutput(response.data.output);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to execute code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="app-header">
          <h1>🤖 REGEN</h1>
          <p className="subtitle">AI-Powered Code Generator & Executor</p>
        </div>

        <div className="main-content">
          <div className="generator-section">
            <h2>✨ Generate Code</h2>
            <div className="input-group">
              <label>Enter your prompt:</label>
              <textarea
                className="prompt-input"
                rows="4"
                placeholder="E.g., Create a Python function to calculate factorial"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="button-group">
              <button
                className="btn btn-primary"
                onClick={generateCode}
                disabled={loading}
              >
                {loading ? '🔄 Generating...' : '✨ Generate Code'}
              </button>
            </div>

            {error && <div className="error">❌ {error}</div>}

            {generatedCode && (
              <>
                <div className="code-display">
                  <pre>{generatedCode}</pre>
                </div>
                <button className="btn btn-success" onClick={transferToEditor}>
                  ➡️ Transfer to Editor
                </button>
              </>
            )}
          </div>

          <div className="editor-section">
            <h2>📝 Code Editor</h2>
            <textarea
              className="code-editor"
              placeholder="Write or paste your code here..."
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
            />

            <div className="input-group" style={{ marginTop: '20px' }}>
              <label>Input (optional):</label>
              <textarea
                className="prompt-input"
                rows="3"
                placeholder="Enter inputs for your code (one per line)"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
              />
            </div>

            <div className="button-group">
              <button
                className="btn btn-primary"
                onClick={executeCode}
                disabled={loading}
              >
                {loading ? '⏳ Running...' : '▶️ Run Code'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditorCode('');
                  setCodeInput('');
                  setOutput('');
                }}
              >
                🗑️ Clear
              </button>
            </div>

            {output && (
              <div className="output-section">
                <h3>📤 Output:</h3>
                <div className="output-content">{output}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
