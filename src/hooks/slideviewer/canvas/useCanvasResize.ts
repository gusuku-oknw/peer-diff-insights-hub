
import { useEffect } from 'react';
import { Canvas } from 'fabric';
import { canvasOptimizer } from '@/utils/slideCanvas/canvasOptimizer';

interface UseCanvasResizeProps {
  canvas: Canvas | null;
  isReady: boolean;
  canvasSize: { width: number; height: number; scale: number };
  startRenderMeasure: () => void;
  endRenderMeasure: () => void;
}

export const useCanvasResize = ({
  canvas,
  isReady,
  canvasSize,
  startRenderMeasure,
  endRenderMeasure
}: UseCanvasResizeProps) => {
  
  useEffect(() => {
    if (!canvas || !isReady) return;
    
    const timeoutId = setTimeout(() => {
      try {
        startRenderMeasure();
        
        if (canvas.upperCanvasEl && canvas.lowerCanvasEl) {
          canvasOptimizer.queueRender(() => {
            canvas.setDimensions({
              width: canvasSize.width,
              height: canvasSize.height
            });
          });
        } else {
          console.warn('Canvas elements not properly initialized, skipping resize');
        }
        
        endRenderMeasure();
        console.log('Canvas resized:', canvasSize);
      } catch (err) {
        console.error('Canvas resize error:', err);
        endRenderMeasure();
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [canvas, canvasSize, isReady, startRenderMeasure, endRenderMeasure]);
};
