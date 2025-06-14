
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
    
    // Hybrid zoom approach: 25%-100% actual sizing, 100%-200% CSS transform
    const useActualSizing = zoomLevel <= 100;
    const effectiveZoomLevel = Math.max(0.25, Math.min(2.0, zoomLevel / 100));
    
    let actualWidth, actualHeight, finalDisplayWidth, finalDisplayHeight;
    
    if (useActualSizing) {
      // For zoom <= 100%, adjust actual canvas size
      const zoomFactor = Math.max(0.25, Math.min(1.0, zoomLevel / 100));
      actualWidth = Math.round(baseDisplayWidth * zoomFactor);
      actualHeight = Math.round(baseDisplayHeight * zoomFactor);
      finalDisplayWidth = actualWidth;
      finalDisplayHeight = actualHeight;
    } else {
      // For zoom > 100%, use base size (CSS transform will handle the scaling)
      actualWidth = baseDisplayWidth;
      actualHeight = baseDisplayHeight;
      finalDisplayWidth = baseDisplayWidth;
      finalDisplayHeight = baseDisplayHeight;
    }
    
    // Simple 1:1 rendering - no pixel ratio scaling
    const pixelRatio = 1;
    
    console.log('Canvas config (hybrid zoom 25%-200%):', {
      container: `${containerWidth}x${containerHeight}`,
      zoomLevel: `${zoomLevel}%`,
      useActualSizing,
      mode: useActualSizing ? 'actual sizing' : 'CSS transform',
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
