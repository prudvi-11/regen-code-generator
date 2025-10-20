import React, { useState, useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000/api';

function App() {
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [prompt, setPrompt] = useState('');
  const [userInputs, setUserInputs] = useState('');
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [showGenOutput, setShowGenOutput] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [genOutputHeight, setGenOutputHeight] = useState(280);
  const [terminalHeight, setTerminalHeight] = useState(300);
  
  const genResizeRef = useRef(null);
  const termResizeRef = useRef(null);
  const isResizingGen = useRef(false);
  const isResizingTerm = useRef(false);

  const languages = [
    'python', 'javascript', 'java', 'cpp', 'c', 'csharp', 'go', 'rust',
    'typescript', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css'
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingGen.current) {
        const leftPanel = document.querySelector('.generator-panel');
        const rect = leftPanel.getBoundingClientRect();
        const newHeight = rect.bottom - e.clientY;
        if (newHeight >= 180 && newHeight <= rect.height - 200) {
          setGenOutputHeight(newHeight);
        }
      }
      
      if (isResizingTerm.current) {
        const rightPanel = document.querySelector('.right-panel');
        const rect = rightPanel.getBoundingClientRect();
        const newHeight = rect.bottom - e.clientY;
        if (newHeight >= 200 && newHeight <= rect.height - 250) {
          setTerminalHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      isResizingGen.current = false;
      isResizingTerm.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleGenResizeStart = () => {
    isResizingGen.current = true;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  const handleTermResizeStart = () => {
    isResizingTerm.current = true;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      alert('Please enter a description!');
      return;
    }

    setLoading(true);
    setGeneratedCode('');
    setShowGenOutput(true);
    
    try {
      const response = await axios.post(`${API_URL}/generate`, {
        prompt: prompt,
        code: code,
        language: language
      });
      setGeneratedCode(response.data.content);
    } catch (err) {
      setGeneratedCode('Error: ' + (err.response?.data?.detail || err.message));
    }
    setLoading(false);
  };

  const handleTransferCode = () => {
    setCode(generatedCode);
    alert('Code transferred to editor!');
  };

  const handleExecuteCode = async () => {
    if (!code.trim()) {
      alert('Please write some code first!');
      return;
    }

    if (language !== 'python' && language !== 'javascript') {
      alert('Execution only supported for Python and JavaScript');
      return;
    }

    setExecuting(true);
    setTerminalOutput('>>> Running program...\n\n');
    setShowTerminal(true);
    
    try {
      const response = await axios.post(`${API_URL}/execute`, {
        code: code,
        language: language,
        user_inputs: userInputs
      });
      
      const output = response.data.output || '';
      const error = response.data.error || '';
      
      if (error) {
        setTerminalOutput('❌ ERROR:\n' + error);
      } else {
        setTerminalOutput(output || '(No output produced)');
      }
      
    } catch (err) {
      setTerminalOutput('❌ Execution failed: ' + (err.response?.data?.detail || err.message));
    }
    
    setExecuting(false);
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
            <h2>Code Generator</h2>
          </div>
          
          <div className="generator-body">
            <div className="form-group">
              <label>Programming Language</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="select-input"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Code Description</label>
              <textarea
                placeholder="Describe the code you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="description-input"
                rows="8"
              />
            </div>
            
            <button 
              onClick={handleGenerateCode} 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Generating...' : 'Generate Code'}
            </button>
          </div>

          {showGenOutput && (
            <div className="output-panel-gen" style={{ height: `${genOutputHeight}px` }}>
              <div 
                className="resize-bar" 
                onMouseDown={handleGenResizeStart}
                ref={genResizeRef}
              >
                <span>⋮⋮⋮</span>
              </div>
              
              <div className="section-header">
                <h2>Generated Code</h2>
                <div className="header-actions">
                  <button 
                    onClick={handleTransferCode}
                    disabled={!generatedCode || loading}
                    className="btn-transfer"
                  >
                    ➜ Use Code
                  </button>
                  <button 
                    onClick={() => setShowGenOutput(false)}
                    className="btn-close"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="output-body">
                <pre className="generated-code">{generatedCode || 'Generating...'}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="right-panel">
          <div className="editor-section">
            <div className="section-header">
              <h2>Code Editor</h2>
              <div className="header-actions">
                <button 
                  onClick={handleExecuteCode} 
                  disabled={executing || !code}
                  className="btn-success"
                >
                  {executing ? 'Running...' : '▶ Run'}
                </button>
                <button 
                  onClick={() => setCode('')}
                  className="btn-danger"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="input-section">
              <label>📥 Program Inputs (one per line)</label>
              <textarea
                placeholder="Enter inputs here (one per line)&#10;Example:&#10;John&#10;25"
                value={userInputs}
                onChange={(e) => setUserInputs(e.target.value)}
                className="input-field"
                rows="2"
              />
            </div>

            <div className="editor-wrapper">
              <Editor
                height={showTerminal ? `calc(100% - ${terminalHeight}px - 140px)` : 'calc(100% - 140px)'}
                language={language}
                value={code}
                onChange={setCode}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: 'on',
                  padding: { top: 10 },
                }}
              />
            </div>
          </div>

          {showTerminal && (
            <div className="terminal-panel" style={{ height: `${terminalHeight}px` }}>
              <div 
                className="resize-bar" 
                onMouseDown={handleTermResizeStart}
                ref={termResizeRef}
              >
                <span>⋮⋮⋮</span>
              </div>
              
              <div className="section-header terminal-header">
                <h2>🖥️ Terminal Output</h2>
                <button 
                  onClick={() => setShowTerminal(false)}
                  className="btn-close"
                >
                  ✕
                </button>
              </div>
              
              <div className="terminal-body">
                <pre className="terminal-output">{terminalOutput}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>© 2025 REGEN | Developed by <strong>B. Prudvi Thirumal Reddy</strong></p>
      </footer>
    </div>
  );
}

export default App;
