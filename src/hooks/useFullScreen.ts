import { useState, useEffect } from 'react';

export const useFullScreen = (initialState = false) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(initialState);

  // Handle keyboard shortcut for toggling full-screen mode (Escape key to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      } else if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        setIsFullScreen(!isFullScreen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return {
    isFullScreen,
    toggleFullScreen,
  };
};
