import React, { useRef, useEffect, useState } from 'react';

interface PreviewProps {
  svgOutput: string;
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  onElementDoubleClick?: (elementId: string) => void;
  handlers: {
    handleWheel: (e: React.WheelEvent) => void;
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleMouseUp: () => void;
    handleMouseLeave: () => void;
  };
}

export const Preview: React.FC<PreviewProps> = ({
  svgOutput,
  zoom,
  pan,
  isDragging,
  isFullScreen,
  toggleFullScreen,
  onElementDoubleClick,
  handlers,
}) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Array<{id: string, x: number, y: number, width: number, height: number}>>([]);
  
  // Extract node positions from SVG after rendering
  useEffect(() => {
    if (svgContainerRef.current && svgOutput) {
      setTimeout(() => {
        const svgElement = svgContainerRef.current?.querySelector('svg');
        if (svgElement) {
          console.log('Extracting node positions from SVG');
          
          const positions: Array<{id: string, x: number, y: number, width: number, height: number}> = [];
          
          // Find all nodes
          const nodeElements = svgElement.querySelectorAll('.node, .cluster');
          nodeElements.forEach(node => {
            const rect = node.getBoundingClientRect();
            const svgRect = svgElement.getBoundingClientRect();
            
            // Get position relative to SVG
            const x = rect.left - svgRect.left;
            const y = rect.top - svgRect.top;
            
            positions.push({
              id: node.id || `node-${positions.length}`,
              x,
              y,
              width: rect.width,
              height: rect.height
            });
            
            console.log(`Node ${node.id} position: x=${x}, y=${y}, width=${rect.width}, height=${rect.height}`);
          });
          
          setNodePositions(positions);
        }
      }, 500); // Longer delay to ensure SVG is fully rendered and positioned
    }
  }, [svgOutput]);

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      border: isFullScreen ? 'none' : '1px solid #e5e7eb',
      transition: 'all 0.3s ease',
      maxHeight: isFullScreen ? '100vh' : 'auto'
    }}>
      <div style={{ 
        padding: '0.5rem 1rem', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>Preview</h2>
        <button 
          onClick={toggleFullScreen}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '4px',
            color: '#4b5563',
            fontSize: '1rem'
          }}
          title={isFullScreen ? "Exit Full Screen (Esc)" : "Full Screen (Ctrl+F)"}
          aria-label={isFullScreen ? "Exit Full Screen" : "Full Screen"}
        >
          {isFullScreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
          )}
        </button>
      </div>
      <div 
        ref={previewContainerRef}
        style={{ 
          padding: isFullScreen ? '1.5rem' : '1rem', 
          flexGrow: 1, 
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
          backgroundColor: isFullScreen ? '#ffffff' : 'transparent'
        }}
        onWheel={handlers.handleWheel}
        onMouseDown={handlers.handleMouseDown}
        onMouseMove={handlers.handleMouseMove}
        onMouseUp={handlers.handleMouseUp}
        onMouseLeave={handlers.handleMouseLeave}
      >
        <div ref={mermaidRef} style={{ display: 'none' }}></div>
        <div style={{ position: 'relative' }}>
          {/* SVG Container */}
          <div 
            ref={svgContainerRef}
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              userSelect: 'none',
              position: 'relative'
            }} 
            dangerouslySetInnerHTML={{ __html: svgOutput }}
          />
          
          {/* Clickable overlays for nodes */}
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none' 
            }}
          >
            {nodePositions.map((node) => (
              <div 
                key={node.id}
                style={{
                  position: 'absolute',
                  left: `${node.x * zoom + pan.x}px`,
                  top: `${node.y * zoom + pan.y}px`,
                  width: `${node.width * zoom}px`,
                  height: `${node.height * zoom}px`,
                  backgroundColor: 'rgba(0, 0, 0, 0.0)',
                  border: '1px solid rgba(0, 0, 0, 0.0)',
                  cursor: 'pointer',
                  pointerEvents: 'all',
                  zIndex: 10
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Overlay clicked for node:', node.id);
                  if (onElementDoubleClick) {
                    onElementDoubleClick(node.id);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
