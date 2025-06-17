
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseEnhancedZoomProps {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomChange?: (zoom: number) => void;
}

export const useEnhancedZoom = ({
  initialZoom = 100,
  minZoom = 25,
  maxZoom = 200,
  onZoomChange
}: UseEnhancedZoomProps = {}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [isPinching, setIsPinching] = useState(false);
  const lastPinchDistance = useRef<number>(0);
  const zoomCenter = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomChange = useCallback((newZoom: number, center?: { x: number; y: number }) => {
    const boundedZoom = Math.max(minZoom, Math.min(maxZoom, Math.round(newZoom)));
    
    if (boundedZoom !== zoom) {
      setZoom(boundedZoom);
      if (center) {
        zoomCenter.current = center;
      }
      onZoomChange?.(boundedZoom);
      
      console.log('Zoom changed:', {
        from: zoom,
        to: boundedZoom,
        center: center || zoomCenter.current
      });
    }
  }, [zoom, minZoom, maxZoom, onZoomChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            handleZoomChange(zoom + 25);
            break;
          case '-':
            e.preventDefault();
            handleZoomChange(zoom - 25);
            break;
          case '0':
            e.preventDefault();
            handleZoomChange(100);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom, handleZoomChange]);

  // Mouse wheel zoom
  const handleWheelZoom = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      const rect = (e.target as Element)?.getBoundingClientRect();
      const center = rect ? {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      } : undefined;
      
      handleZoomChange(zoom + delta, center);
    }
  }, [zoom, handleZoomChange]);

  // Pinch zoom for touch devices
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      setIsPinching(true);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      lastPinchDistance.current = distance;
      
      // Calculate pinch center
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      const rect = (e.target as Element)?.getBoundingClientRect();
      
      if (rect) {
        zoomCenter.current = {
          x: centerX - rect.left,
          y: centerY - rect.top
        };
      }
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isPinching && e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (lastPinchDistance.current > 0) {
        const scale = distance / lastPinchDistance.current;
        const deltaZoom = (scale - 1) * 50; // Sensitivity adjustment
        handleZoomChange(zoom + deltaZoom, zoomCenter.current);
      }
      
      lastPinchDistance.current = distance;
    }
  }, [isPinching, zoom, handleZoomChange]);

  const handleTouchEnd = useCallback(() => {
    setIsPinching(false);
    lastPinchDistance.current = 0;
  }, []);

  // Zoom control functions
  const zoomIn = useCallback(() => handleZoomChange(zoom + 25), [zoom, handleZoomChange]);
  const zoomOut = useCallback(() => handleZoomChange(zoom - 25), [zoom, handleZoomChange]);
  const resetZoom = useCallback(() => handleZoomChange(100), [handleZoomChange]);
  const fitToScreen = useCallback(() => handleZoomChange(75), [handleZoomChange]);

  return {
    zoom,
    isPinching,
    zoomCenter: zoomCenter.current,
    setZoom: handleZoomChange,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
    // Event handlers for canvas
    handleWheelZoom,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    // Utility functions
    canZoomIn: zoom < maxZoom,
    canZoomOut: zoom > minZoom,
    isAtDefault: zoom === 100
  };
};
