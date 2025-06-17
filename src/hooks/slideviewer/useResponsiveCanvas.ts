
import { useState, useEffect, useCallback, useRef } from 'react';
import { useResponsiveLayout } from './useResponsiveLayout';

interface UseResponsiveCanvasProps {
  containerWidth: number;
  containerHeight: number;
}

export const useResponsiveCanvas = ({ 
  containerWidth, 
  containerHeight 
}: UseResponsiveCanvasProps) => {
  const [canvasSize, setCanvasSize] = useState({ width: 1600, height: 900 });
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const { mobile, tablet, desktop, large } = useResponsiveLayout();

  const calculateOptimalSize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      // Enhanced padding calculation based on device type
      const padding = mobile ? 20 : tablet ? 30 : 40;
      const availableWidth = Math.max(320, containerWidth - padding);
      const availableHeight = Math.max(240, containerHeight - padding);
      
      const aspectRatio = 16 / 9;
      
      // Width-based calculation
      let optimalWidth = availableWidth * (mobile ? 0.95 : 0.92);
      let optimalHeight = optimalWidth / aspectRatio;
      
      // Height constraint check
      if (optimalHeight > availableHeight * (mobile ? 0.95 : 0.92)) {
        optimalHeight = availableHeight * (mobile ? 0.95 : 0.92);
        optimalWidth = optimalHeight * aspectRatio;
      }
      
      // Device-specific optimization with better ranges
      let finalWidth, finalHeight;
      
      if (mobile) {
        finalWidth = Math.max(280, Math.min(600, Math.round(optimalWidth)));
        finalHeight = Math.max(158, Math.min(338, Math.round(optimalHeight)));
      } else if (tablet) {
        finalWidth = Math.max(480, Math.min(900, Math.round(optimalWidth)));
        finalHeight = Math.max(270, Math.min(506, Math.round(optimalHeight)));
      } else if (desktop) {
        finalWidth = Math.max(640, Math.min(1280, Math.round(optimalWidth)));
        finalHeight = Math.max(360, Math.min(720, Math.round(optimalHeight)));
      } else {
        // Large screens
        finalWidth = Math.max(800, Math.min(1600, Math.round(optimalWidth)));
        finalHeight = Math.max(450, Math.min(900, Math.round(optimalHeight)));
      }
      
      const newCanvasSize = {
        width: finalWidth,
        height: finalHeight
      };
      
      setCanvasSize(newCanvasSize);
      
      console.log('Enhanced canvas size calculated:', {
        container: { containerWidth, containerHeight },
        device: { mobile, tablet, desktop, large },
        calculated: { optimalWidth, optimalHeight },
        final: newCanvasSize,
        aspectRatio: finalWidth / finalHeight
      });
    }, 100); // Reduced debounce for more responsive updates
  }, [containerWidth, containerHeight, mobile, tablet, desktop, large]);

  useEffect(() => {
    calculateOptimalSize();
    
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [calculateOptimalSize]);

  const getScaleFactors = useCallback(() => {
    return {
      scaleX: canvasSize.width / 1600,
      scaleY: canvasSize.height / 900,
      scale: Math.min(canvasSize.width / 1600, canvasSize.height / 900)
    };
  }, [canvasSize]);

  const getPerformanceInfo = useCallback(() => {
    const pixelCount = canvasSize.width * canvasSize.height;
    const scaleFactor = getScaleFactors().scale;
    
    return {
      pixelCount,
      scaleFactor,
      isHighDensity: pixelCount > 1000000,
      renderingComplexity: scaleFactor < 0.5 ? 'low' : scaleFactor < 0.8 ? 'medium' : 'high'
    };
  }, [canvasSize, getScaleFactors]);

  return {
    canvasSize,
    getScaleFactors,
    getPerformanceInfo,
    isResponsive: containerWidth > 0 && containerHeight > 0,
    containerDimensions: { containerWidth, containerHeight },
    deviceInfo: { mobile, tablet, desktop, large }
  };
};
