import { useState, useEffect, useRef, MouseEvent } from 'react'
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
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const mermaidRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Render mermaid diagram when code changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (mermaidRef.current) {
        try {
          mermaidRef.current.innerHTML = '';
          const { svg } = await mermaid.render('mermaid-diagram', code);
          
          // Modify SVG to prevent text selection and interaction
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
          const svgElement = svgDoc.documentElement;
          
          // Add style to prevent interaction with SVG elements
          const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
          style.textContent = `
            * {
              pointer-events: none;
              user-select: none;
            }
          `;
          svgElement.appendChild(style);
          
          // Convert back to string
          const serializer = new XMLSerializer();
          const modifiedSvg = serializer.serializeToString(svgDoc);
          
          setSvgOutput(modifiedSvg);
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
          <div 
            ref={previewContainerRef}
            style={{ 
              padding: '1rem', 
              flexGrow: 1, 
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY * -0.01;
              const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
              setZoom(newZoom);
            }}
            onMouseDown={(e: MouseEvent) => {
              setIsDragging(true);
              setDragStart({ x: e.clientX, y: e.clientY });
            }}
            onMouseMove={(e: MouseEvent) => {
              if (isDragging) {
                const dx = e.clientX - dragStart.x;
                const dy = e.clientY - dragStart.y;
                setPan({ x: pan.x + dx, y: pan.y + dy });
                setDragStart({ x: e.clientX, y: e.clientY });
              }
            }}
            onMouseUp={() => {
              setIsDragging(false);
            }}
            onMouseLeave={() => {
              setIsDragging(false);
            }}
          >
            <div ref={mermaidRef} style={{ display: 'none' }}></div>
            <div 
              style={{ 
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                userSelect: 'none'
              }} 
              dangerouslySetInnerHTML={{ __html: svgOutput }} 
              onMouseDown={(e) => {
                // Prevent default behavior to avoid text selection
                e.preventDefault();
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
