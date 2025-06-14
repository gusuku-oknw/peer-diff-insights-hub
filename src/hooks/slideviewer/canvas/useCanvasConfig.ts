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
    
    // Determine sizing strategy based on zoom level
    const useActualSizing = zoomLevel <= 100;
    const zoomFactor = zoomLevel / 100;
    
    let actualWidth: number;
    let actualHeight: number;
    let finalDisplayWidth: number;
    let finalDisplayHeight: number;
    
    if (useActualSizing) {
      // For zoom ≤ 100%: adjust actual canvas size
      actualWidth = Math.round(baseDisplayWidth * zoomFactor);
      actualHeight = Math.round(baseDisplayHeight * zoomFactor);
      finalDisplayWidth = actualWidth;
      finalDisplayHeight = actualHeight;
    } else {
      // For zoom > 100%: keep base size, use CSS transform
      actualWidth = baseDisplayWidth;
      actualHeight = baseDisplayHeight;
      finalDisplayWidth = baseDisplayWidth;
      finalDisplayHeight = baseDisplayHeight;
    }
    
    // Simple 1:1 rendering - no pixel ratio scaling
    const pixelRatio = 1;
    
    console.log('Canvas config with zoom:', {
      container: `${containerWidth}x${containerHeight}`,
      zoomLevel: `${zoomLevel}%`,
      useActualSizing,
      base: `${baseDisplayWidth}x${baseDisplayHeight}`,
      actual: `${actualWidth}x${actualHeight}`,
      display: `${finalDisplayWidth}x${finalDisplayHeight}`,
      pixelRatio
    });
    
    return {
      width: actualWidth,
      height: actualHeight,
      displayWidth: finalDisplayWidth,
      displayHeight: finalDisplayHeight,
      pixelRatio,
      actualWidth,
      actualHeight,
      useActualSizing
    };
  }, [containerWidth, containerHeight, zoomLevel]);

  return { canvasConfig };
};
