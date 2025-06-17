import { useEffect, useRef } from 'react';

interface UseZoomGesturesProps {
  onZoomChange: (zoom: number) => void;
  currentZoom: number;
  minZoom?: number;
  maxZoom?: number;
  enabled?: boolean;
}

export const useZoomGestures = ({
  onZoomChange,
  currentZoom,
  minZoom = 25,
  maxZoom = 100,
  enabled = true
}: UseZoomGesturesProps) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        
        const delta = event.deltaY;
        const zoomStep = 5;
        let newZoom = currentZoom;

        if (delta < 0) {
          // Zoom in
          newZoom = Math.min(maxZoom, currentZoom + zoomStep);
        } else {
          // Zoom out
          newZoom = Math.max(minZoom, currentZoom - zoomStep);
        }

        if (newZoom !== currentZoom) {
          onZoomChange(newZoom);
        }
      }
    };

    // Touch gesture handling
    let lastTouchDistance = 0;
    let isZooming = false;

    const getTouchDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        event.preventDefault();
        isZooming = true;
        lastTouchDistance = getTouchDistance(event.touches[0], event.touches[1]);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2 && isZooming) {
        event.preventDefault();
        
        const currentTouchDistance = getTouchDistance(event.touches[0], event.touches[1]);
        const scaleFactor = currentTouchDistance / lastTouchDistance;
        
        if (Math.abs(scaleFactor - 1) > 0.05) { // Threshold to prevent jittery behavior
          let newZoom = currentZoom * scaleFactor;
          newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
          
          if (Math.abs(newZoom - currentZoom) > 1) {
            onZoomChange(Math.round(newZoom));
            lastTouchDistance = currentTouchDistance;
          }
        }
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (event.touches.length < 2) {
        isZooming = false;
      }
    };

    // Add event listeners to the document for global zoom
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onZoomChange, currentZoom, minZoom, maxZoom, enabled]);

  return { containerRef };
};