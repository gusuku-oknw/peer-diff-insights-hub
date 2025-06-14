
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

  // Calculate high-resolution scaling factor
  const pixelRatio = useMemo(() => {
    return Math.min(window.devicePixelRatio || 1, 3); // Cap at 3x for performance
  }, []);

  // Use standard slide sizes with enhanced resolution
  const { slideSize, deviceType } = useStandardSlideSize({
    containerWidth,
    containerHeight,
    preferredAspectRatio: 16 / 9
  });

  // Enhanced slide size with high DPI scaling
  const enhancedSlideSize = useMemo(() => ({
    width: slideSize.width * pixelRatio,
    height: slideSize.height * pixelRatio,
    displayWidth: slideSize.width,
    displayHeight: slideSize.height,
    scale: pixelRatio
  }), [slideSize, pixelRatio]);

  // Memoize canvas configuration
  const canvasConfig = useMemo(() => ({
    currentSlide,
    editable,
    containerWidth: enhancedSlideSize.width,
    containerHeight: enhancedSlideSize.height,
    enablePerformanceMode
  }), [currentSlide, editable, enhancedSlideSize.width, enhancedSlideSize.height, enablePerformanceMode]);

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

  // Enhanced canvas setup with high DPI support
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const canvasElement = canvasRef.current;
    
    if (!canvas || !canvasElement || !isReady) return;

    // Set high-resolution canvas dimensions
    canvasElement.width = enhancedSlideSize.width;
    canvasElement.height = enhancedSlideSize.height;
    
    // Scale the CSS size back down
    canvasElement.style.width = `${enhancedSlideSize.displayWidth}px`;
    canvasElement.style.height = `${enhancedSlideSize.displayHeight}px`;
    
    // Update Fabric.js canvas dimensions
    canvas.setDimensions({
      width: enhancedSlideSize.width,
      height: enhancedSlideSize.height
    });
    
    // Scale the canvas context for high DPI
    const ctx = canvasElement.getContext('2d');
    if (ctx && pixelRatio > 1) {
      ctx.scale(pixelRatio, pixelRatio);
      
      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
    
    // Update Fabric.js zoom to compensate for scaling
    canvas.setZoom(pixelRatio);
    
    canvas.renderAll();
    
    console.log(`High-DPI canvas setup: ${enhancedSlideSize.width}x${enhancedSlideSize.height} (${pixelRatio}x scale)`);
  }, [fabricCanvasRef.current, isReady, enhancedSlideSize, pixelRatio]);

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
  
  // Enhanced element rendering with high DPI support
  const handleOptimizedRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    try {
      const result = renderElementsWithEmptyState(
        canvas, 
        elements, 
        enhancedSlideSize,
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
  }, [elements, currentSlide, editable, isReady, enhancedSlideSize, handleAddText, handleAddShape, handleAddImage]);
  
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
        containerWidth={enhancedSlideSize.displayWidth}
        containerHeight={enhancedSlideSize.displayHeight}
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
      className="w-full h-full flex flex-col bg-gray-50 overflow-auto relative"
    >
      {/* Canvas Container */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
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
              width: enhancedSlideSize.displayWidth,
              height: enhancedSlideSize.displayHeight,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* High-Resolution Fabric.js Canvas */}
            <canvas 
              ref={canvasRef}
              className="block rounded-lg"
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'crisp-edges'
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
                message="高解像度スライドを初期化中..."
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
      </div>

      {/* Information Bar - Bottom */}
      <div className="flex justify-between items-center p-2 bg-gray-100 border-t border-gray-200">
        {/* Left: Performance Information */}
        <div className="flex items-center gap-4">
          {enablePerformanceMode && performance.metrics && (
            <div className="text-xs bg-black text-white px-2 py-1 rounded">
              FPS: {performance.metrics.fps} | Render: {performance.metrics.renderTime}ms
              {!performance.isPerformanceGood && (
                <span className="text-yellow-300 ml-2">⚡ 高速モード</span>
              )}
            </div>
          )}
          <div className="text-xs bg-green-600 text-white px-2 py-1 rounded">
            解像度: {enhancedSlideSize.width}×{enhancedSlideSize.height} ({pixelRatio}x)
          </div>
        </div>

        {/* Right: Slide Size Information */}
        <div className="flex items-center gap-2">
          <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
            {enhancedSlideSize.displayWidth}×{enhancedSlideSize.displayHeight} (16:9)
          </div>
          {pixelRatio > 1 && (
            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
              高DPI最適化済み ({pixelRatio}x)
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

OptimizedSlideCanvas.displayName = 'OptimizedSlideCanvas';

export default OptimizedSlideCanvas;
