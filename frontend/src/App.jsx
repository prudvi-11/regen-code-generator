import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const API_URL = 'https://regen-backend-17jv.onrender.com/api';

function App() {
  const [language, setLanguage] = useState('python');
  const [description, setDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [editorCode, setEditorCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGenerated, setShowGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    setLoading(true);
    setGeneratedCode('');
    setShowGenerated(false);

    try {
      const response = await axios.post(`${API_URL}/generate`, {
        prompt: `Write ${language} code: ${description}`
      });

      setGeneratedCode(response.data.code);
      setShowGenerated(true);
    } catch (error) {
      alert('Failed to generate code: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = () => {
    setEditorCode(generatedCode);
    setShowGenerated(false);
    setOutput('');
  };

  const handleExecute = async () => {
    if (!editorCode.trim()) {
      alert('Please enter code to execute');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const response = await axios.post(`${API_URL}/execute`, {
        code: editorCode,
        input: input
      });

      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEditorCode('');
    setInput('');
    setOutput('');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="brand">
          <h1>REGEN</h1>
        </div>
      </header>

      <div className="workspace">
        <div className="generator-panel">
          <div className="section-header">
            <h2>⚡ Code Generator</h2>
          </div>

          <div className="generator-body">
            <div className="form-group">
              <label>Language</label>
              <select 
                className="select-input"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="description-input"
                rows="6"
                placeholder="Describe the code you want to generate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button 
              className="btn-primary"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? '⏳ Generating...' : '✨ Generate Code'}
            </button>
          </div>

          {showGenerated && generatedCode && (
            <div className="output-panel-gen">
              <div className="section-header">
                <h2>✅ Generated Code</h2>
                <div className="header-actions">
                  <button 
                    className="btn-transfer"
                    onClick={handleTransfer}
                    disabled={loading}
                  >
                    ➡️ Transfer
                  </button>
                  <button 
                    className="btn-close"
                    onClick={() => setShowGenerated(false)}
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

        <div className="right-panel">
          <div className="editor-section">
            <div className="section-header">
              <h2>📝 Code Editor</h2>
              <div className="header-actions">
                <button 
                  className="btn-success"
                  onClick={handleExecute}
                  disabled={loading}
                >
                  ▶️ Run
                </button>
                <button 
                  className="btn-danger"
                  onClick={handleClear}
                >
                  🗑️ Clear
                </button>
              </div>
            </div>

            <div className="input-section">
              <label>Input (optional)</label>
              <textarea
                className="input-field"
                rows="2"
                placeholder="Enter input for your code..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="editor-wrapper">
              <textarea
                className="code-editor"
                placeholder="Write or paste your code here..."
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
                  resize: 'none'
                }}
              />
            </div>
          </div>

          {output && (
            <div className="terminal-panel">
              <div className="section-header terminal-header">
                <h2>💻 Output Terminal</h2>
                <button 
                  className="btn-close"
                  onClick={() => setOutput('')}
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

      <footer className="app-footer">
        <p>© 2024 REGEN. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
