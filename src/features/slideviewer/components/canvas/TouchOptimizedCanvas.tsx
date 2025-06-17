
import React, { useRef, useEffect, useCallback } from "react";
import { useEnhancedZoom } from "../../hooks/useEnhancedZoom";
import { useSlideCanvas } from "../../hooks/useSlideCanvas";
import { useEnhancedResponsive } from "../../hooks/useEnhancedResponsive";
import { renderElements } from "../../utils/elementRenderer";

interface TouchOptimizedCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
  containerWidth?: number;
  containerHeight?: number;
  onZoomChange?: (zoom: number) => void;
}

const TouchOptimizedCanvas: React.FC<TouchOptimizedCanvasProps> = ({ 
  currentSlide, 
  zoomLevel = 100, 
  editable = false,
  userType = "enterprise",
  containerWidth = 0,
  containerHeight = 0,
  onZoomChange
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  
  const {
    canvasSize,
    deviceInfo,
    isResponsive
  } = useEnhancedResponsive({
    containerWidth,
    containerHeight
  });
  
  const {
    zoom,
    isPinching,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheelZoom,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    canZoomIn,
    canZoomOut,
    setZoom
  } = useEnhancedZoom({
    initialZoom: zoomLevel,
    onZoomChange
  });
  
  const {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error,
    elements,
    slides
  } = useSlideCanvas({
    currentSlide,
    editable,
    containerWidth: canvasSize.width,
    containerHeight: canvasSize.height
  });

  // Sync external zoom with internal zoom
  useEffect(() => {
    if (Math.abs(zoom - zoomLevel) > 1) {
      setZoom(zoomLevel);
    }
  }, [zoomLevel, zoom, setZoom]);

  // Enhanced touch handling for mobile navigation
  const handleTouchStartCapture = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    }
    handleTouchStart(e.nativeEvent);
  }, [handleTouchStart]);

  const handleTouchMoveCapture = useCallback((e: React.TouchEvent) => {
    handleTouchMove(e.nativeEvent);
  }, [handleTouchMove]);

  const handleTouchEndCapture = useCallback((e: React.TouchEvent) => {
    if (touchStartRef.current && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      // Swipe detection for mobile navigation
      if (deltaTime < 300 && Math.abs(deltaY) < 100) {
        if (deltaX > 50) {
          // Swipe right - previous slide
          console.log('Swipe right detected - previous slide');
        } else if (deltaX < -50) {
          // Swipe left - next slide
          console.log('Swipe left detected - next slide');
        }
      }
    }
    
    touchStartRef.current = null;
    handleTouchEnd();
  }, [handleTouchEnd]);

  // Render elements when canvas is ready
  const handleRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    try {
      renderElements(canvas, elements, canvasSize, editable, currentSlide);
    } catch (err) {
      console.error('Touch canvas rendering failed:', err);
    }
  }, [elements, currentSlide, editable, isReady, canvasSize]);
  
  useEffect(() => {
    if (isReady) {
      handleRenderElements();
    }
  }, [handleRenderElements, isReady]);

  // Add wheel event listener for zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheelZoom, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheelZoom);
  }, [handleWheelZoom]);

  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow border">
          <p className="text-gray-600 text-lg mb-4">スライドが読み込まれていません</p>
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors touch-manipulation"
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
      className="w-full h-full flex items-center justify-center bg-gray-50 overflow-hidden touch-pan-y"
      style={{ 
        touchAction: deviceInfo.isMobile ? 'pan-y pinch-zoom' : 'auto',
        userSelect: 'none'
      }}
    >
      <div className="relative">
        <div 
          className="bg-white rounded-lg shadow-lg border relative"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center',
            transition: isPinching ? 'none' : 'transform 0.2s ease-out'
          }}
          onTouchStart={handleTouchStartCapture}
          onTouchMove={handleTouchMoveCapture}
          onTouchEnd={handleTouchEndCapture}
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
                <p className="mt-2 text-blue-600 text-sm">読み込み中...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-95 rounded-lg">
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow border-red-200">
                <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
                <button 
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors touch-manipulation"
                  onClick={() => window.location.reload()}
                >
                  再読み込み
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Touch feedback indicator */}
        {isPinching && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {zoom}%
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TouchOptimizedCanvas);
