
import { useCallback, useEffect, useRef } from 'react';
import { Canvas } from 'fabric';

interface UseCustomZoomProps {
  canvas: Canvas | null;
  isReady: boolean;
  canvasConfig: any;
  zoomLevel: number;
}

export const useCustomZoom = ({ canvas, isReady, canvasConfig, zoomLevel }: UseCustomZoomProps) => {
  const zoomTransformRef = useRef<string>('scale(1)');
  
  const applyZoomTransform = useCallback((currentZoomLevel: number) => {
    if (!canvas || !isReady || !canvasConfig) return;
    
    try {
      const canvasElement = canvas.getElement();
      const canvasContainer = canvasElement.parentElement;
      
      if (!canvasContainer) return;
      
      if (canvasConfig.useActualSizing) {
        // For zoom ≤ 100%: no CSS transform needed, canvas size handles it
        canvasContainer.style.transform = 'scale(1)';
        canvasContainer.style.transformOrigin = 'center center';
        canvasContainer.style.transition = 'transform 0.2s ease-out';
        zoomTransformRef.current = 'scale(1)';
        
        console.log(`Actual sizing mode: ${currentZoomLevel}% (no CSS transform)`);
      } else {
        // For zoom > 100%: use CSS transform
        const zoomValue = currentZoomLevel / 100;
        const transform = `scale(${zoomValue})`;
        canvasContainer.style.transform = transform;
        canvasContainer.style.transformOrigin = 'center center';
        canvasContainer.style.transition = 'transform 0.2s ease-out';
        zoomTransformRef.current = transform;
        
        console.log(`CSS transform mode: ${currentZoomLevel}% (transform: ${transform})`);
      }
    } catch (err) {
      console.error('Zoom application error:', err);
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
