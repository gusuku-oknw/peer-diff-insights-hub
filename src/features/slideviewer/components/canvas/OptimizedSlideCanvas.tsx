
import React, { useRef, useEffect, useCallback, useState } from "react";
import { useOptimizedSlideCanvas } from "../../hooks/useOptimizedSlideCanvas";
import { useEnhancedResponsive } from "../../hooks/useEnhancedResponsive";
import { useCanvasActions } from "../../hooks/canvas/useCanvasActions";
import { renderElementsWithEmptyState } from "../../utils/enhancedElementRenderer";
import TouchOptimizedCanvas from "./TouchOptimizedCanvas";
import EmptyCanvasState from "./states/EmptyCanvasState";
import CanvasLoadingState from "./states/CanvasLoadingState";
import CanvasErrorState from "./states/CanvasErrorState";
import CanvasGuideOverlay from "./states/CanvasGuideOverlay";

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
  console.log(`OptimizedSlideCanvas rendering - Slide: ${currentSlide}, Container: ${containerWidth}x${containerHeight}`);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

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

  const { addText, addShape, addImage } = useCanvasActions({
    currentSlide,
    canvas: fabricCanvasRef.current
  });

  // Enhanced element rendering with empty state detection
  const handleRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    try {
      const result = renderElementsWithEmptyState(
        canvas, 
        elements, 
        canvasSize, 
        editable, 
        currentSlide,
        addText,
        addShape,
        addImage
      );
      setIsEmpty(result.isEmpty);
    } catch (err) {
      console.error('Enhanced rendering failed:', err);
    }
  }, [elements, currentSlide, editable, isReady, canvasSize, addText, addShape, addImage]);
  
  useEffect(() => {
    if (isReady) {
      handleRenderElements();
    }
  }, [handleRenderElements, isReady]);

  // Show guide on first load for new users
  useEffect(() => {
    if (isReady && editable && isEmpty) {
      const hasSeenGuide = localStorage.getItem('canvas-guide-seen');
      if (!hasSeenGuide) {
        setShowGuide(true);
        localStorage.setItem('canvas-guide-seen', 'true');
      }
    }
  }, [isReady, editable, isEmpty]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleReset = useCallback(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#ffffff';
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  // Use TouchOptimizedCanvas for mobile devices
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
      className="w-full h-full flex items-center justify-center bg-gray-50 overflow-hidden relative"
    >
      {/* Guide overlay */}
      {showGuide && (
        <CanvasGuideOverlay
          deviceType={deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop'}
          onClose={() => setShowGuide(false)}
        />
      )}

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
          {/* Canvas element */}
          <canvas 
            ref={canvasRef}
            className="block rounded-lg"
            style={{
              width: '100%',
              height: '100%',
            }}
          />

          {/* Empty state overlay */}
          {isEmpty && isReady && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
              <EmptyCanvasState
                onAddText={addText}
                onAddShape={addShape}
                onAddImage={addImage}
                slideNumber={currentSlide}
                editable={editable}
              />
            </div>
          )}
          
          {/* Loading state */}
          {!isReady && !error && (
            <CanvasLoadingState 
              progress={performance.metrics?.fps || 0}
              message="キャンバスを初期化中..."
            />
          )}
          
          {/* Error state */}
          {error && (
            <CanvasErrorState
              error={error}
              onRetry={handleRetry}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Performance indicator for high DPI displays */}
        {deviceInfo.devicePixelRatio > 2 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
            高解像度最適化
          </div>
        )}

        {/* パフォーマンス情報表示（開発時のみ） */}
        {process.env.NODE_ENV === 'development' && performance.metrics && (
          <div className="absolute top-2 left-2 text-xs bg-blue-500 text-white px-2 py-1 rounded opacity-75">
            FPS: {performance.metrics.fps} | {performance.metrics.renderTime}ms
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(OptimizedSlideCanvas);
