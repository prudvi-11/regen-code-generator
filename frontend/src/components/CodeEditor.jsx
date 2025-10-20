/**
 * Monaco Editor component wrapper
 * Provides VS Code-like code editing experience with syntax highlighting
 */
import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language }) => {
  // Editor configuration options
  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    wrappingIndent: 'indent',
    lineNumbers: 'on',
    glyphMargin: true,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={editorOptions}
        loading={<div>Loading editor...</div>}
      />
    </div>
  );
};

export default CodeEditor;
