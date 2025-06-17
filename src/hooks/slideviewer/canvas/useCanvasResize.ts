
import { useEffect } from 'react';
import { Canvas } from 'fabric';

interface UseCanvasResizeProps {
  canvas: Canvas | null;
  containerWidth: number;
  containerHeight: number;
}

export const useCanvasResize = ({
  canvas,
  containerWidth,
  containerHeight
}: UseCanvasResizeProps) => {
  
  useEffect(() => {
    if (!canvas || containerWidth <= 0 || containerHeight <= 0) return;
    
    const aspectRatio = 16 / 9;
    let canvasWidth = containerWidth;
    let canvasHeight = containerWidth / aspectRatio;
    
    if (canvasHeight > containerHeight) {
      canvasHeight = containerHeight;
      canvasWidth = containerHeight * aspectRatio;
    }
    
    canvas.setDimensions({
      width: canvasWidth,
      height: canvasHeight
    });
    
    canvas.renderAll();
    
    console.log(`Canvas resized to: ${canvasWidth}x${canvasHeight}`);
  }, [canvas, containerWidth, containerHeight]);
};
