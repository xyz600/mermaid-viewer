import React from 'react';
import { Header } from './Header';
import { Editor } from './Editor';
import { Preview } from './Preview';

interface LayoutProps {
  title: string;
  code: string;
  onCodeChange: (code: string) => void;
  svgOutput: string;
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  highlightedLine?: number;
  onElementDoubleClick?: (elementId: string) => void;
  zoomAndPanHandlers: {
    handleWheel: (e: React.WheelEvent) => void;
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleMouseUp: () => void;
    handleMouseLeave: () => void;
  };
}

export const Layout: React.FC<LayoutProps> = ({
  title,
  code,
  onCodeChange,
  svgOutput,
  zoom,
  pan,
  isDragging,
  isFullScreen,
  toggleFullScreen,
  highlightedLine,
  onElementDoubleClick,
  zoomAndPanHandlers,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header title={title} />
      
      <main style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexGrow: 1,
        padding: isFullScreen ? '0' : '1rem',
        gap: isFullScreen ? '0' : '1rem',
        transition: 'all 0.3s ease'
      }}>
        {/* Left side - Editor */}
        <div style={{ 
          flex: isFullScreen ? 0 : 1, 
          display: isFullScreen ? 'none' : 'flex', 
        }}>
          <Editor 
            code={code} 
            onChange={onCodeChange} 
            highlightedLine={highlightedLine} 
          />
        </div>

        {/* Right side - Preview */}
        <Preview 
          svgOutput={svgOutput}
          zoom={zoom}
          pan={pan}
          isDragging={isDragging}
          isFullScreen={isFullScreen}
          toggleFullScreen={toggleFullScreen}
          onElementDoubleClick={onElementDoubleClick}
          handlers={zoomAndPanHandlers}
        />
      </main>
    </div>
  );
};
