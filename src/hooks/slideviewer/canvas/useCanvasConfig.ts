
import { useMemo } from 'react';

interface UseCanvasConfigProps {
  containerWidth: number;
  containerHeight: number;
}

export const useCanvasConfig = ({ containerWidth, containerHeight }: UseCanvasConfigProps) => {
  const canvasSize = useMemo(() => {
    const padding = 40;
    const availableWidth = Math.max(320, containerWidth - padding);
    const availableHeight = Math.max(240, containerHeight - padding);
    
    const aspectRatio = 16 / 9;
    let canvasWidth = availableWidth * 0.92;
    let canvasHeight = canvasWidth / aspectRatio;
    
    if (canvasHeight > availableHeight * 0.92) {
      canvasHeight = availableHeight * 0.92;
      canvasWidth = canvasHeight * aspectRatio;
    }
    
    const isMobile = containerWidth < 768;
    const multiplier = isMobile ? 0.9 : 1.0;
    
    const finalWidth = Math.max(320, Math.min(1920, Math.round(canvasWidth * multiplier)));
    const finalHeight = Math.max(180, Math.min(1080, Math.round(canvasHeight * multiplier)));
    
    return { 
      width: finalWidth, 
      height: finalHeight,
      scale: finalWidth / 1600
    };
  }, [containerWidth, containerHeight]);

  return { canvasSize };
};
