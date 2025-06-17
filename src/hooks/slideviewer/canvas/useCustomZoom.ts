
import { useCallback, useEffect, useRef } from 'react';
import { Canvas } from 'fabric';

interface UseCustomZoomProps {
  canvas: Canvas | null;
  isReady: boolean;
  canvasConfig: {
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
    pixelRatio: number;
    actualWidth: number;
    actualHeight: number;
    useActualSizing: boolean;
  };
  zoomLevel: number;
}

export const useCustomZoom = ({ canvas, isReady, canvasConfig, zoomLevel }: UseCustomZoomProps) => {
  const zoomTransformRef = useRef<string>('scale(1)');
  
  const applyZoomTransform = useCallback((currentZoomLevel: number) => {
    if (!canvas || !isReady || !canvasConfig) {
      console.log('Zoom transform skipped - missing dependencies:', {
        canvas: !!canvas,
        isReady,
        canvasConfig: !!canvasConfig
      });
      return;
    }
    
    try {
      const canvasElement = canvas.getElement();
      if (!canvasElement) {
        console.log('Canvas element not found');
        return;
      }

      const canvasContainer = canvasElement.parentElement;
      if (!canvasContainer) {
        console.log('Canvas container not found');
        return;
      }
      
      // Simplified: Always use actual sizing (no CSS transforms)
      // Since max zoom is now 100%, we only need actual canvas size adjustments
      canvasContainer.style.transform = 'scale(1)';
      canvasContainer.style.transformOrigin = 'center center';
      canvasContainer.style.transition = 'transform 0.2s ease-out';
      zoomTransformRef.current = 'scale(1)';
      
      console.log(`✓ Zoom applied: ${currentZoomLevel}% (actual sizing mode)`);

      // Force a re-render to ensure the transform is applied
      canvas.renderAll();
      
    } catch (err) {
      console.error('❌ Zoom application error:', err);
    }
  }, [canvas, isReady, canvasConfig]);
  
  const resetZoom = useCallback(() => {
    if (!canvas) return;
    
    try {
      const canvasElement = canvas.getElement();
      const canvasContainer = canvasElement?.parentElement;
      
      if (canvasContainer) {
        canvasContainer.style.transform = 'scale(1)';
        canvasContainer.style.transformOrigin = 'center center';
        zoomTransformRef.current = 'scale(1)';
        console.log('✓ Zoom reset to 100%');
      }
    } catch (err) {
      console.error('❌ Zoom reset error:', err);
    }
  }, [canvas]);
  
  // Apply zoom when dependencies change
  useEffect(() => {
    if (isReady && canvasConfig && canvas) {
      console.log(`🔄 Applying zoom: ${zoomLevel}% (simplified actual sizing)`);
      applyZoomTransform(zoomLevel);
    }
  }, [zoomLevel, isReady, canvasConfig, canvas, applyZoomTransform]);
  
  return {
    applyZoomTransform,
    resetZoom,
    currentTransform: zoomTransformRef.current
  };
};
