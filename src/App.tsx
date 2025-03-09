import { useState } from 'react';
import { Layout } from './components/Layout';
import { useMermaidRenderer } from './hooks/useMermaidRenderer';
import { useZoomAndPan } from './hooks/useZoomAndPan';
import { useFullScreen } from './hooks/useFullScreen';

function App() {
  // State for the mermaid code
  const [code, setCode] = useState<string>(`graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`);

  // Custom hooks
  const svgOutput = useMermaidRenderer(code);
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  const { zoom, pan, isDragging, handlers } = useZoomAndPan();

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
      zoomAndPanHandlers={handlers}
    />
  );
}

export default App;
