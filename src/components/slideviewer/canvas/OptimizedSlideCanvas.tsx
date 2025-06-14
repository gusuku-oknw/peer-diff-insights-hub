
import React, { useRef, useEffect, useCallback } from "react";
import { useOptimizedSlideCanvas } from "@/hooks/slideviewer/useOptimizedSlideCanvas";
import { useEnhancedResponsive } from "@/hooks/slideviewer/useEnhancedResponsive";
import { renderElements } from "@/utils/slideCanvas/elementRenderer";
import TouchOptimizedCanvas from "./TouchOptimizedCanvas";

interface OptimizedSlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
  containerWidth?: number;
  containerHeight?: number;
  enablePerformanceMode?: boolean;
}

const OptimizedSlideCanvas = ({ 
  currentSlide, 
  zoomLevel = 100, 
  editable = false,
  userType = "enterprise",
  containerWidth = 0,
  containerHeight = 0,
  enablePerformanceMode = true
}: OptimizedSlideCanvasProps) => {
  console.log(`OptimizedSlideCanvas rendering - Slide: ${currentSlide}, Container: ${containerWidth}x${containerHeight}, Performance Mode: ${enablePerformanceMode}`);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Always call all hooks at the top level - never conditionally
  const {
    canvasSize,
    deviceInfo,
    isResponsive
  } = useEnhancedResponsive({
    containerWidth,
    containerHeight
  });

  const {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error,
    elements,
    slides,
    performance
  } = useOptimizedSlideCanvas({
    currentSlide,
    editable,
    containerWidth: canvasSize.width,
    containerHeight: canvasSize.height,
    enablePerformanceMode
  });
  
  // 最適化された要素レンダリング
  const handleOptimizedRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    try {
      performance.metrics && console.log('Performance metrics:', performance.metrics);
      renderElements(canvas, elements, canvasSize, editable, currentSlide);
    } catch (err) {
      console.error('Optimized rendering failed:', err);
    }
  }, [elements, currentSlide, editable, isReady, canvasSize, performance]);
  
  useEffect(() => {
    if (isReady) {
      handleOptimizedRenderElements();
    }
  }, [handleOptimizedRenderElements, isReady]);

  // モバイルデバイスでは TouchOptimizedCanvas を使用 (hooks呼び出し後)
  if (deviceInfo.isMobile) {
    return (
      <TouchOptimizedCanvas
        currentSlide={currentSlide}
        zoomLevel={zoomLevel}
        editable={editable}
        userType={userType}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
      />
    );
  }
  
  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow border">
          <p className="text-gray-600 text-lg mb-4">スライドが読み込まれていません</p>
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={canvasContainerRef}
      className="w-full h-full flex items-center justify-center bg-gray-50 overflow-hidden"
    >
      <div className="relative">
        <div 
          className="bg-white rounded-lg shadow-lg border relative"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <canvas 
            ref={canvasRef}
            className="block rounded-lg"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
          
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-2 text-blue-600 text-sm">最適化中...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-95 rounded-lg">
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow border-red-200">
                <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
                <button 
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  再読み込み
                </button>
              </div>
            </div>
          )}
        </div>

        {/* パフォーマンス指標表示 */}
        {enablePerformanceMode && performance.metrics && (
          <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded">
            FPS: {performance.metrics.fps} | Render: {performance.metrics.renderTime}ms
            {!performance.isPerformanceGood && (
              <span className="text-yellow-300 ml-2">⚡ 高速モード</span>
            )}
          </div>
        )}

        {/* 高解像度最適化指標 */}
        {deviceInfo.devicePixelRatio > 2 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
            高解像度最適化済み
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(OptimizedSlideCanvas);
