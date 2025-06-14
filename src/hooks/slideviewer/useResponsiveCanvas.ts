
import { useState, useEffect, useCallback, useRef } from 'react';

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

  const calculateOptimalSize = useCallback(() => {
    // デバウンス処理でリサイズを最適化
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      const padding = 32;
      const availableWidth = Math.max(400, containerWidth - padding);
      const availableHeight = Math.max(300, containerHeight - padding);
      
      const aspectRatio = 16 / 9;
      let optimalWidth = availableWidth * 0.9;
      let optimalHeight = optimalWidth / aspectRatio;
      
      if (optimalHeight > availableHeight * 0.9) {
        optimalHeight = availableHeight * 0.9;
        optimalWidth = optimalHeight * aspectRatio;
      }
      
      // 基準キャンバスサイズ（ズーム処理は上位コンポーネントで行う）
      const baseCanvasSize = {
        width: Math.max(800, Math.min(1920, Math.round(optimalWidth))),
        height: Math.max(450, Math.min(1080, Math.round(optimalHeight)))
      };
      
      setCanvasSize(baseCanvasSize);
      
      console.log('Canvas size calculated:', {
        container: { containerWidth, containerHeight },
        base: baseCanvasSize,
      });
    }, 100);
  }, [containerWidth, containerHeight]);

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
    };
  }, [canvasSize]);

  return {
    canvasSize,
    getScaleFactors,
    isResponsive: containerWidth > 0 && containerHeight > 0,
  };
};
