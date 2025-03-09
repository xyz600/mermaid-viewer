import React from 'react';

interface EditorProps {
  code: string;
  onChange: (code: string) => void;
  highlightedLine?: number;
}

export const Editor: React.FC<EditorProps> = ({ code, onChange, highlightedLine }) => {
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
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', width: '100%', overflow: 'auto' }}>
          {/* Line numbers */}
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            color: '#6b7280',
            padding: '0.5rem',
            textAlign: 'right',
            userSelect: 'none',
            fontFamily: 'monospace',
            fontSize: '14px',
            borderRight: '1px solid #e5e7eb',
            minWidth: '2.5rem',
            flexShrink: 0
          }}>
            {lineNumbers.map(num => (
              <div 
                key={num} 
                style={{
                  backgroundColor: highlightedLine === num ? '#fef3c7' : 'transparent',
                  fontWeight: highlightedLine === num ? 'bold' : 'normal',
                  color: highlightedLine === num ? '#92400e' : '#6b7280',
                  padding: '0 0.25rem',
                  lineHeight: '1.5rem',
                  height: '1.5rem'
                }}
              >
                {num}
              </div>
            ))}
          </div>
          {/* Text editor */}
          <div style={{ flexGrow: 1, position: 'relative' }}>
            <textarea
              style={{ 
                width: '100%',
                height: '100%',
                padding: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.5rem',
                border: 'none',
                resize: 'none',
                outline: 'none',
                position: 'relative',
                zIndex: 1
              }}
              value={code}
              onChange={(e) => onChange(e.target.value)}
              spellCheck={false}
            />
            {highlightedLine && (
              <div 
                style={{
                  position: 'absolute',
                  top: `${(highlightedLine - 1) * 1.5}rem`, // Assuming 1.5rem line height
                  left: 0,
                  right: 0,
                  height: '1.5rem',
                  backgroundColor: '#fef3c7',
                  opacity: 0.5,
                  pointerEvents: 'none',
                  zIndex: 0
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
