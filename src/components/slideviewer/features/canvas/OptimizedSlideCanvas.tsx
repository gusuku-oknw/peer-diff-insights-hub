
import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useOptimizedSlideCanvas } from "@/hooks/slideviewer/useOptimizedSlideCanvas";
import { useEnhancedResponsive } from "@/hooks/slideviewer/useEnhancedResponsive";
import { useCanvasActions } from "@/hooks/slideviewer/canvas/useCanvasActions";
import { renderElementsWithEmptyState } from "@/utils/slideCanvas/enhancedElementRenderer";
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

const OptimizedSlideCanvas = React.memo(({ 
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
  const [showGuide, setShowGuide] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Memoize responsive calculations to prevent infinite rerenders
  const responsiveConfig = useMemo(() => ({
    containerWidth,
    containerHeight
  }), [containerWidth, containerHeight]);

  const {
    canvasSize,
    deviceInfo,
    isResponsive
  } = useEnhancedResponsive(responsiveConfig);

  // Memoize canvas configuration
  const canvasConfig = useMemo(() => ({
    currentSlide,
    editable,
    containerWidth: canvasSize.width,
    containerHeight: canvasSize.height,
    enablePerformanceMode
  }), [currentSlide, editable, canvasSize.width, canvasSize.height, enablePerformanceMode]);

  const {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error,
    elements,
    slides,
    performance
  } = useOptimizedSlideCanvas(canvasConfig);

  const { addText, addShape, addImage } = useCanvasActions({
    currentSlide,
    canvas: fabricCanvasRef.current
  });

  // Create wrapper functions to match EmptyCanvasState expectations
  const handleAddText = useCallback(() => {
    addText();
  }, [addText]);

  const handleAddShape = useCallback(() => {
    addShape();
  }, [addShape]);

  const handleAddImage = useCallback(() => {
    addImage();
  }, [addImage]);
  
  // Memoize the render function to prevent unnecessary calls
  const handleOptimizedRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    try {
      performance.metrics && console.log('Performance metrics:', performance.metrics);
      const result = renderElementsWithEmptyState(
        canvas, 
        elements, 
        canvasSize, 
        editable, 
        currentSlide,
        handleAddText,
        handleAddShape,
        handleAddImage
      );
      setIsEmpty(result.isEmpty);
    } catch (err) {
      console.error('Optimized rendering failed:', err);
    }
  }, [elements, currentSlide, editable, isReady, canvasSize, performance.metrics, handleAddText, handleAddShape, handleAddImage]);
  
  useEffect(() => {
    if (isReady) {
      handleOptimizedRenderElements();
    }
  }, [handleOptimizedRenderElements, isReady]);

  useEffect(() => {
    if (isReady && editable && isEmpty && enablePerformanceMode) {
      const hasSeenOptimizedGuide = localStorage.getItem('optimized-canvas-guide-seen');
      if (!hasSeenOptimizedGuide) {
        setShowGuide(true);
        localStorage.setItem('optimized-canvas-guide-seen', 'true');
      }
    }
  }, [isReady, editable, isEmpty, enablePerformanceMode]);

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
          <canvas 
            ref={canvasRef}
            className="block rounded-lg"
            style={{
              width: '100%',
              height: '100%',
            }}
          />

          {isEmpty && isReady && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
              <EmptyCanvasState
                onAddText={handleAddText}
                onAddShape={handleAddShape}
                onAddImage={handleAddImage}
                slideNumber={currentSlide}
                editable={editable}
              />
            </div>
          )}
          
          {!isReady && !error && (
            <CanvasLoadingState 
              progress={performance.metrics?.fps || 0}
              message="最適化中..."
            />
          )}
          
          {error && (
            <CanvasErrorState
              error={error}
              onRetry={handleRetry}
              onReset={handleReset}
            />
          )}
        </div>

        {enablePerformanceMode && performance.metrics && (
          <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded">
            FPS: {performance.metrics.fps} | Render: {performance.metrics.renderTime}ms
            {!performance.isPerformanceGood && (
              <span className="text-yellow-300 ml-2">⚡ 高速モード</span>
            )}
          </div>
        )}

        {deviceInfo.devicePixelRatio > 2 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
            高解像度最適化済み
          </div>
        )}
      </div>
    </div>
  );
});

OptimizedSlideCanvas.displayName = 'OptimizedSlideCanvas';

export default OptimizedSlideCanvas;
