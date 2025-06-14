
import { useMemo } from 'react';

interface UseCanvasConfigProps {
  containerWidth: number;
  containerHeight: number;
}

interface CanvasConfig {
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
  pixelRatio: number;
}

export const useCanvasConfig = ({ containerWidth, containerHeight }: UseCanvasConfigProps) => {
  const canvasConfig = useMemo((): CanvasConfig => {
    const padding = 40;
    const availableWidth = Math.max(320, containerWidth - padding);
    const availableHeight = Math.max(240, containerHeight - padding);
    
    const aspectRatio = 16 / 9;
    let displayWidth = availableWidth * 0.9;
    let displayHeight = displayWidth / aspectRatio;
    
    if (displayHeight > availableHeight * 0.9) {
      displayHeight = availableHeight * 0.9;
      displayWidth = displayHeight * aspectRatio;
    }
    
    const finalDisplayWidth = Math.max(320, Math.min(1200, Math.round(displayWidth)));
    const finalDisplayHeight = Math.max(180, Math.min(675, Math.round(displayHeight)));
    
    // Simple 1:1 rendering - no pixel ratio scaling
    const pixelRatio = 1;
    const canvasWidth = finalDisplayWidth;
    const canvasHeight = finalDisplayHeight;
    
    console.log('Simplified canvas config:', {
      container: `${containerWidth}x${containerHeight}`,
      display: `${finalDisplayWidth}x${finalDisplayHeight}`,
      canvas: `${canvasWidth}x${canvasHeight}`,
      pixelRatio
    });
    
    return {
      width: canvasWidth,
      height: canvasHeight,
      displayWidth: finalDisplayWidth,
      displayHeight: finalDisplayHeight,
      pixelRatio
    };
  }, [containerWidth, containerHeight]);

  return { canvasConfig };
};
