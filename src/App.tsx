import { useState, useEffect, useRef } from 'react'
import mermaid from 'mermaid'

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

function App() {
  const [code, setCode] = useState<string>(`graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`);
  const [svgOutput, setSvgOutput] = useState<string>('');
  const mermaidRef = useRef<HTMLDivElement>(null);

  // Render mermaid diagram when code changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (mermaidRef.current) {
        try {
          mermaidRef.current.innerHTML = '';
          const { svg } = await mermaid.render('mermaid-diagram', code);
          setSvgOutput(svg);
        } catch (error) {
          console.error('Failed to render mermaid diagram:', error);
          setSvgOutput('<div style="color: red; padding: 1rem;">Error rendering diagram</div>');
        }
      }
    };

    renderDiagram();
  }, [code]);

  // Generate line numbers for the editor
  const lineNumbers = code.split('\n').map((_, index) => index + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header with centered title */}
      <header style={{ 
        backgroundColor: '#3b82f6', 
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Mermaid Viewer</h1>
      </header>

      {/* Main content area */}
      <main style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexGrow: 1,
        padding: '1rem',
        gap: '1rem'
      }}>
        {/* Left side - Editor with line numbers */}
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
              onChange={(e) => setCode(e.target.value)}
              rows={Math.max(10, lineNumbers.length)}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right side - Preview */}
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
            <h2 style={{ margin: 0, fontSize: '1rem' }}>Preview</h2>
          </div>
          <div style={{ 
            padding: '1rem', 
            flexGrow: 1, 
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div ref={mermaidRef} style={{ display: 'none' }}></div>
            <div dangerouslySetInnerHTML={{ __html: svgOutput }} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
