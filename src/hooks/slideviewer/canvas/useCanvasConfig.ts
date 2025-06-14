
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
  displayCapabilities?: {
    physicalWidth: number;
    physicalHeight: number;
    is4KCapable: boolean;
    is8KCapable: boolean;
  };
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
    
    // Adaptive DPI handling - respect device capabilities
    const devicePixelRatio = window.devicePixelRatio || 1;
    const maxSafeRatio = Math.min(devicePixelRatio, 2); // Cap at 2x for performance
    
    const finalDisplayWidth = Math.max(320, Math.min(1200, Math.round(displayWidth)));
    const finalDisplayHeight = Math.max(180, Math.min(675, Math.round(displayHeight)));
    
    // Canvas rendering size (for high DPI)
    const canvasWidth = Math.round(finalDisplayWidth * maxSafeRatio);
    const canvasHeight = Math.round(finalDisplayHeight * maxSafeRatio);
    
    const displayCapabilities = {
      physicalWidth: Math.round(window.screen.width * devicePixelRatio),
      physicalHeight: Math.round(window.screen.height * devicePixelRatio),
      is4KCapable: window.screen.width >= 3840 || window.screen.height >= 2160,
      is8KCapable: window.screen.width >= 7680 || window.screen.height >= 4320,
    };
    
    return {
      width: canvasWidth,
      height: canvasHeight,
      displayWidth: finalDisplayWidth,
      displayHeight: finalDisplayHeight,
      pixelRatio: maxSafeRatio,
      displayCapabilities
    };
  }, [containerWidth, containerHeight]);

  return { canvasConfig };
};
