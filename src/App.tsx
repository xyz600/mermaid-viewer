import { useState } from 'react';
import { Layout } from './components/Layout';
import { useMermaidRenderer } from './hooks/useMermaidRenderer';
import { useZoomAndPan } from './hooks/useZoomAndPan';
import { useFullScreen } from './hooks/useFullScreen';
import { useMermaidElementMapping } from './hooks/useMermaidElementMapping';

function App() {
  // State for the mermaid code
  const [code, setCode] = useState<string>(`graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`);

  // State for highlighted line
  const [highlightedLine, setHighlightedLine] = useState<number | undefined>(undefined);

  // Custom hooks
  const svgOutput = useMermaidRenderer(code);
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  const { zoom, pan, isDragging, handlers } = useZoomAndPan();
  const { getLineForElement } = useMermaidElementMapping(code);

  // Handle click on SVG element (changed from double-click to single click)
  const handleElementDoubleClick = (elementId: string) => {
    console.log('Element clicked with ID:', elementId);
    
    const lineNumber = getLineForElement(elementId);
    console.log('Mapped to line number:', lineNumber);
    
    if (lineNumber) {
      setHighlightedLine(lineNumber);
      
      // Clear the highlight after a delay
      setTimeout(() => {
        setHighlightedLine(undefined);
      }, 3000);
    }
  };

  return (
    <Layout
      title="Mermaid Viewer"
      code={code}
      onCodeChange={setCode}
      svgOutput={svgOutput}
      zoom={zoom}
      pan={pan}
      isDragging={isDragging}
      isFullScreen={isFullScreen}
      toggleFullScreen={toggleFullScreen}
      highlightedLine={highlightedLine}
      onElementDoubleClick={handleElementDoubleClick} // We keep the same prop name for compatibility
      zoomAndPanHandlers={handlers}
    />
  );
}

export default App;
