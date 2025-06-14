
import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useOptimizedSlideCanvas } from "@/hooks/slideviewer/useOptimizedSlideCanvas";
import { useStandardSlideSize } from "@/hooks/slideviewer/useStandardSlideSize";
import { useEnhancedCanvasActions } from "@/hooks/slideviewer/canvas/useEnhancedCanvasActions";
import { useCanvasShortcuts } from "@/hooks/slideviewer/canvas/useCanvasShortcuts";
import { renderElementsWithEmptyState } from "@/utils/slideCanvas/enhancedElementRenderer";
import TouchOptimizedCanvas from "@/features/slideviewer/components/canvas/TouchOptimizedCanvas";
import EmptyCanvasState from "@/features/slideviewer/components/canvas/states/EmptyCanvasState";
import CanvasLoadingState from "@/features/slideviewer/components/canvas/states/CanvasLoadingState";
import CanvasErrorState from "@/features/slideviewer/components/canvas/states/CanvasErrorState";
import CanvasGuideOverlay from "@/features/slideviewer/components/canvas/states/CanvasGuideOverlay";
import CanvasContextMenu from "./CanvasContextMenu";
import CanvasShortcutsGuide from "./CanvasShortcutsGuide";

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
  console.log(`OptimizedSlideCanvas rendering - Slide: ${currentSlide}, Zoom: ${zoomLevel}%, Performance Mode: ${enablePerformanceMode}`);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedObject, setSelectedObject] = useState<any>(null);

  // Use standard slide sizes instead of responsive sizing
  const { slideSize, deviceType } = useStandardSlideSize({
    containerWidth,
    containerHeight,
    preferredAspectRatio: 16 / 9
  });

  // Memoize canvas configuration
  const canvasConfig = useMemo(() => ({
    currentSlide,
    editable,
    containerWidth: slideSize.width,
    containerHeight: slideSize.height,
    enablePerformanceMode
  }), [currentSlide, editable, slideSize.width, slideSize.height, enablePerformanceMode]);

  const {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error,
    elements,
    slides,
    performance
  } = useOptimizedSlideCanvas(canvasConfig);

  // Enhanced canvas actions with animations
  const {
    addText,
    addRectangle,
    addCircle,
    deleteSelected,
    copySelected,
    paste,
    duplicate,
    bringToFront,
    sendToBack,
    rotateObject,
    hasClipboard
  } = useEnhancedCanvasActions({
    canvas: fabricCanvasRef.current,
    currentSlide
  });

  // Keyboard shortcuts
  useCanvasShortcuts({
    canvas: fabricCanvasRef.current,
    editable,
    onAddText: addText,
    onAddRectangle: addRectangle,
    onAddCircle: addCircle,
    onDeleteSelected: deleteSelected,
    onCopySelected: copySelected,
    onPasteSelected: paste
  });

  // Track selected object for context menu
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const handleSelectionCreated = (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
    };

    const handleSelectionCleared = () => {
      setSelectedObject(null);
    };

    const handleSelectionUpdated = (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
    };

    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('selection:updated', handleSelectionUpdated);

    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('selection:updated', handleSelectionUpdated);
    };
  }, [fabricCanvasRef.current]);

  // Create wrapper functions for EmptyCanvasState compatibility
  const handleAddText = useCallback(() => addText(), [addText]);
  const handleAddShape = useCallback(() => addRectangle(), [addRectangle]);
  const handleAddImage = useCallback(() => {
    console.log('Image functionality coming soon');
  }, []);
  
  // Enhanced element rendering
  const handleOptimizedRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    try {
      const result = renderElementsWithEmptyState(
        canvas, 
        elements, 
        slideSize,
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
  }, [elements, currentSlide, editable, isReady, slideSize, handleAddText, handleAddShape, handleAddImage]);
  
  useEffect(() => {
    if (isReady) {
      handleOptimizedRenderElements();
    }
  }, [handleOptimizedRenderElements, isReady]);

  // Show guide for first-time users
  useEffect(() => {
    if (isReady && editable && isEmpty && enablePerformanceMode) {
      const hasSeenGuide = localStorage.getItem('standard-slide-guide-seen');
      if (!hasSeenGuide) {
        setShowGuide(true);
        localStorage.setItem('standard-slide-guide-seen', 'true');
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

  // Use TouchOptimizedCanvas for mobile devices
  if (deviceType === 'mobile') {
    return (
      <TouchOptimizedCanvas
        currentSlide={currentSlide}
        zoomLevel={zoomLevel}
        editable={editable}
        userType={userType}
        containerWidth={slideSize.width}
        containerHeight={slideSize.height}
      />
    );
  }
  
  // Check if slides are loaded
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
      className="w-full h-full flex items-center justify-center bg-gray-50 overflow-auto relative"
    >
      {/* Guide overlay */}
      {showGuide && (
        <CanvasGuideOverlay
          deviceType={deviceType}
          onClose={() => setShowGuide(false)}
        />
      )}

      {/* Shortcuts guide in top-right corner */}
      {editable && (
        <div className="absolute top-4 right-4 z-10">
          <CanvasShortcutsGuide />
        </div>
      )}

      <div className="relative">
        {/* Fixed size slide container with context menu */}
        <CanvasContextMenu
          selectedObject={selectedObject}
          onCopy={copySelected}
          onPaste={paste}
          onDelete={deleteSelected}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
          onDuplicate={duplicate}
          onRotate={rotateObject}
          hasClipboard={hasClipboard}
        >
          <div 
            className="bg-white rounded-lg shadow-lg border relative"
            style={{
              width: slideSize.width,
              height: slideSize.height,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* Fabric.js Canvas */}
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
                  onAddText={handleAddText}
                  onAddShape={handleAddShape}
                  onAddImage={handleAddImage}
                  slideNumber={currentSlide}
                  editable={editable}
                />
              </div>
            )}
            
            {/* Loading state */}
            {!isReady && !error && (
              <CanvasLoadingState 
                progress={performance.metrics?.fps || 0}
                message="標準スライドを初期化中..."
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
        </CanvasContextMenu>

        {/* Performance information */}
        {enablePerformanceMode && performance.metrics && (
          <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded">
            FPS: {performance.metrics.fps} | Render: {performance.metrics.renderTime}ms
            {!performance.isPerformanceGood && (
              <span className="text-yellow-300 ml-2">⚡ 高速モード</span>
            )}
          </div>
        )}

        {/* High resolution display info */}
        {window.devicePixelRatio > 2 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
            高解像度最適化済み
          </div>
        )}

        {/* Slide size info */}
        <div className="absolute top-2 right-2 text-xs bg-blue-500 text-white px-2 py-1 rounded opacity-75">
          {slideSize.width}×{slideSize.height} (16:9)
        </div>
      </div>
    </div>
  );
});

OptimizedSlideCanvas.displayName = 'OptimizedSlideCanvas';

export default OptimizedSlideCanvas;
