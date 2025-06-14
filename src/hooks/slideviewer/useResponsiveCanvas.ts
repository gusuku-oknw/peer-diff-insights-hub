
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
    // 改善されたデバウンス処理
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      // より精密な計算
      const padding = 40;
      const availableWidth = Math.max(320, containerWidth - padding);
      const availableHeight = Math.max(240, containerHeight - padding);
      
      const aspectRatio = 16 / 9;
      
      // 幅ベースの計算
      let optimalWidth = availableWidth * 0.92;
      let optimalHeight = optimalWidth / aspectRatio;
      
      // 高さ制限チェック
      if (optimalHeight > availableHeight * 0.92) {
        optimalHeight = availableHeight * 0.92;
        optimalWidth = optimalHeight * aspectRatio;
      }
      
      // デバイス種別に応じた最適化
      const isTablet = containerWidth >= 768 && containerWidth < 1024;
      const isMobile = containerWidth < 768;
      const isDesktop = containerWidth >= 1024;
      
      let finalWidth, finalHeight;
      
      if (isMobile) {
        // モバイル: より小さめに調整
        finalWidth = Math.max(320, Math.min(800, Math.round(optimalWidth * 0.9)));
        finalHeight = Math.max(180, Math.min(450, Math.round(optimalHeight * 0.9)));
      } else if (isTablet) {
        // タブレット: 中間サイズ
        finalWidth = Math.max(600, Math.min(1200, Math.round(optimalWidth)));
        finalHeight = Math.max(338, Math.min(675, Math.round(optimalHeight)));
      } else {
        // デスクトップ: フルサイズ
        finalWidth = Math.max(800, Math.min(1920, Math.round(optimalWidth)));
        finalHeight = Math.max(450, Math.min(1080, Math.round(optimalHeight)));
      }
      
      const newCanvasSize = {
        width: finalWidth,
        height: finalHeight
      };
      
      setCanvasSize(newCanvasSize);
      
      console.log('Enhanced canvas size calculated:', {
        container: { containerWidth, containerHeight },
        device: { isMobile, isTablet, isDesktop },
        calculated: { optimalWidth, optimalHeight },
        final: newCanvasSize,
        aspectRatio: finalWidth / finalHeight
      });
    }, 150); // 少し長めのデバウンス
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
      // 統一スケールファクター（アスペクト比維持）
      scale: Math.min(canvasSize.width / 1600, canvasSize.height / 900)
    };
  }, [canvasSize]);

  // パフォーマンス情報
  const getPerformanceInfo = useCallback(() => {
    const pixelCount = canvasSize.width * canvasSize.height;
    const scaleFactor = getScaleFactors().scale;
    
    return {
      pixelCount,
      scaleFactor,
      isHighDensity: pixelCount > 1000000, // 1MP以上
      renderingComplexity: scaleFactor < 0.5 ? 'low' : scaleFactor < 0.8 ? 'medium' : 'high'
    };
  }, [canvasSize, getScaleFactors]);

  return {
    canvasSize,
    getScaleFactors,
    getPerformanceInfo,
    isResponsive: containerWidth > 0 && containerHeight > 0,
    // デバッグ用
    containerDimensions: { containerWidth, containerHeight }
  };
};
