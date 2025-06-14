
import { useCallback, useEffect, useRef } from 'react';
import { Canvas } from 'fabric';

interface UseCustomZoomProps {
  canvas: Canvas | null;
  isReady: boolean;
  canvasConfig: any;
}

export const useCustomZoom = ({ canvas, isReady, canvasConfig }: UseCustomZoomProps) => {
  const zoomTransformRef = useRef<string>('scale(1)');
  
  const applyZoomTransform = useCallback((zoomLevel: number) => {
    if (!canvas || !isReady || !canvasConfig) return;
    
    try {
      const zoomValue = zoomLevel / 100;
      const transform = `scale(${zoomValue})`;
      zoomTransformRef.current = transform;
      
      // Apply CSS transform to canvas wrapper instead of using Fabric.js setZoom
      const canvasElement = canvas.getElement();
      const canvasContainer = canvasElement.parentElement;
      
      if (canvasContainer) {
        canvasContainer.style.transform = transform;
        canvasContainer.style.transformOrigin = 'center center';
        canvasContainer.style.transition = 'transform 0.2s ease-out';
      }
      
      console.log(`CSS zoom applied: ${zoomLevel}% (transform: ${transform})`);
    } catch (err) {
      console.error('CSS zoom error:', err);
    }
  }, [canvas, isReady, canvasConfig]);
  
  const resetZoom = useCallback(() => {
    if (!canvas) return;
    
    const canvasElement = canvas.getElement();
    const canvasContainer = canvasElement.parentElement;
    
    if (canvasContainer) {
      canvasContainer.style.transform = 'scale(1)';
      zoomTransformRef.current = 'scale(1)';
    }
  }, [canvas]);
  
  return {
    applyZoomTransform,
    resetZoom,
    currentTransform: zoomTransformRef.current
  };
};
