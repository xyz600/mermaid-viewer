import React from 'react';

interface EditorProps {
  code: string;
  onChange: (code: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ code, onChange }) => {
  // Generate line numbers for the editor
  const lineNumbers = code.split('\n').map((_, index) => index + 1);

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ 
        padding: '0.5rem', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb'
      }}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>Editor</h2>
      </div>
      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Line numbers */}
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          color: '#6b7280',
          padding: '0.5rem',
          textAlign: 'right',
          userSelect: 'none',
          fontFamily: 'monospace',
          borderRight: '1px solid #e5e7eb',
          minWidth: '2.5rem'
        }}>
          {lineNumbers.map(num => (
            <div key={num}>{num}</div>
          ))}
        </div>
        {/* Text editor */}
        <textarea
          style={{ 
            flexGrow: 1,
            padding: '0.5rem',
            fontFamily: 'monospace',
            border: 'none',
            resize: 'none',
            outline: 'none'
          }}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.max(10, lineNumbers.length)}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
