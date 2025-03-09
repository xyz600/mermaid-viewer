import { useState, MouseEvent, WheelEvent } from 'react';

interface ZoomAndPanState {
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
}

export const useZoomAndPan = (initialZoom = 1) => {
  const [state, setState] = useState<ZoomAndPanState>({
    zoom: initialZoom,
    pan: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
  });

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.max(0.1, Math.min(5, state.zoom + delta));
    setState(prev => ({ ...prev, zoom: newZoom }));
  };

  const handleMouseDown = (e: MouseEvent) => {
    setState(prev => ({
      ...prev,
      isDragging: true,
      dragStart: { x: e.clientX, y: e.clientY },
    }));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (state.isDragging) {
      const dx = e.clientX - state.dragStart.x;
      const dy = e.clientY - state.dragStart.y;
      setState(prev => ({
        ...prev,
        pan: { x: prev.pan.x + dx, y: prev.pan.y + dy },
        dragStart: { x: e.clientX, y: e.clientY },
      }));
    }
  };

  const handleMouseUp = () => {
    setState(prev => ({ ...prev, isDragging: false }));
  };

  const handleMouseLeave = () => {
    setState(prev => ({ ...prev, isDragging: false }));
  };

  const resetZoomAndPan = () => {
    setState({
      zoom: initialZoom,
      pan: { x: 0, y: 0 },
      isDragging: false,
      dragStart: { x: 0, y: 0 },
    });
  };

  return {
    zoom: state.zoom,
    pan: state.pan,
    isDragging: state.isDragging,
    handlers: {
      handleWheel,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleMouseLeave,
    },
    resetZoomAndPan,
  };
};
