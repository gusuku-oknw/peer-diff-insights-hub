
import { useMemo } from 'react';

interface UseCanvasConfigProps {
  containerWidth: number;
  containerHeight: number;
  zoomLevel?: number;
}

interface CanvasConfig {
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
  pixelRatio: number;
  actualWidth: number;
  actualHeight: number;
  useActualSizing: boolean;
}

export const useCanvasConfig = ({ 
  containerWidth, 
  containerHeight, 
  zoomLevel = 100 
}: UseCanvasConfigProps) => {
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
    
    const baseDisplayWidth = Math.max(320, Math.min(1200, Math.round(displayWidth)));
    const baseDisplayHeight = Math.max(180, Math.min(675, Math.round(displayHeight)));
    
    // Simplified zoom approach: 25%-100% actual sizing only
    const zoomFactor = Math.max(0.25, Math.min(1.0, zoomLevel / 100));
    const actualWidth = Math.round(baseDisplayWidth * zoomFactor);
    const actualHeight = Math.round(baseDisplayHeight * zoomFactor);
    
    // Simple 1:1 rendering - no pixel ratio scaling
    const pixelRatio = 1;
    
    console.log('Canvas config (simplified 25%-100%):', {
      container: `${containerWidth}x${containerHeight}`,
      zoomLevel: `${zoomLevel}%`,
      mode: 'actual sizing only',
      base: `${baseDisplayWidth}x${baseDisplayHeight}`,
      actual: `${actualWidth}x${actualHeight}`,
      zoomFactor,
      pixelRatio
    });
    
    return {
      width: actualWidth,
      height: actualHeight,
      displayWidth: actualWidth,
      displayHeight: actualHeight,
      pixelRatio,
      actualWidth,
      actualHeight,
      useActualSizing: true
    };
  }, [containerWidth, containerHeight, zoomLevel]);

  return { canvasConfig };
};
