
import { useState, useCallback, useRef } from 'react';

interface UseEnhancedZoomProps {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomChange?: (zoom: number) => void;
}

export const useEnhancedZoom = ({
  initialZoom = 100,
  minZoom = 25,
  maxZoom = 300,
  onZoomChange
}: UseEnhancedZoomProps = {}) => {
  const [zoom, setZoomInternal] = useState(initialZoom);
  const [isPinching, setIsPinching] = useState(false);
  const lastTouchDistance = useRef<number>(0);
  const zoomCenter = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const setZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    setZoomInternal(clampedZoom);
    onZoomChange?.(clampedZoom);
  }, [minZoom, maxZoom, onZoomChange]);

  const zoomIn = useCallback(() => {
    setZoom(zoom * 1.2);
  }, [zoom, setZoom]);

  const zoomOut = useCallback(() => {
    setZoom(zoom / 1.2);
  }, [zoom, setZoom]);

  const resetZoom = useCallback(() => {
    setZoom(100);
  }, [setZoom]);

  const handleWheelZoom = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(zoom * delta);
  }, [zoom, setZoom]);

  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      setIsPinching(true);
      lastTouchDistance.current = getTouchDistance(e.touches);
      
      // Calculate center point for zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      zoomCenter.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      const currentDistance = getTouchDistance(e.touches);
      if (lastTouchDistance.current > 0) {
        const scale = currentDistance / lastTouchDistance.current;
        setZoom(zoom * scale);
      }
      lastTouchDistance.current = currentDistance;
    }
  }, [isPinching, zoom, setZoom]);

  const handleTouchEnd = useCallback(() => {
    setIsPinching(false);
    lastTouchDistance.current = 0;
  }, []);

  const canZoomIn = zoom < maxZoom;
  const canZoomOut = zoom > minZoom;

  return {
    zoom,
    isPinching,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheelZoom,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    canZoomIn,
    canZoomOut,
    setZoom
  };
};
