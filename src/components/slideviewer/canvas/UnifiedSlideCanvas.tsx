
import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useOptimizedSlideCanvas } from "@/hooks/slideviewer/useOptimizedSlideCanvas";
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

interface UnifiedSlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
  containerWidth?: number;
  containerHeight?: number;
  enablePerformanceMode?: boolean;
}

const UnifiedSlideCanvas = React.memo(({ 
  currentSlide, 
  zoomLevel = 100, 
  editable = false,
  userType = "enterprise",
  containerWidth = 0,
  containerHeight = 0,
  enablePerformanceMode = true
}: UnifiedSlideCanvasProps) => {
  console.log(`UnifiedSlideCanvas rendering - Slide: ${currentSlide}, Zoom: ${zoomLevel}%, Container: ${containerWidth}x${containerHeight}`);
  
  const [showGuide, setShowGuide] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedObject, setSelectedObject] = useState<any>(null);

  // Use unified high-resolution canvas hook
  const {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error,
    elements,
    slides,
    canvasConfig,
    performance
  } = useOptimizedSlideCanvas({
    currentSlide,
    editable,
    containerWidth,
    containerHeight,
    enablePerformanceMode
  });

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
  
  // High resolution element rendering - memoized to prevent unnecessary re-renders
  const handleRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady || !canvasConfig) return;
    
    try {
      const result = renderElementsWithEmptyState(
        canvas, 
        elements, 
        canvasConfig,
        editable, 
        currentSlide,
        handleAddText,
        handleAddShape,
        handleAddImage
      );
      setIsEmpty(result.isEmpty);
      
      console.log(`Unified canvas rendered ${elements.length} elements at ${canvasConfig.width}x${canvasConfig.height} resolution`);
    } catch (err) {
      console.error('Unified rendering failed:', err);
    }
  }, [elements, currentSlide, editable, isReady, canvasConfig, handleAddText, handleAddShape, handleAddImage, fabricCanvasRef.current]);
  
  useEffect(() => {
    if (isReady && canvasConfig) {
      handleRenderElements();
    }
  }, [handleRenderElements, isReady, canvasConfig]);

  // Show guide for first-time users
  useEffect(() => {
    if (isReady && editable && isEmpty && enablePerformanceMode) {
      const hasSeenGuide = localStorage.getItem('unified-slide-guide-seen');
      if (!hasSeenGuide) {
        setShowGuide(true);
        localStorage.setItem('unified-slide-guide-seen', 'true');
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

  // Device type detection for mobile optimization
  const deviceType = useMemo(() => {
    if (containerWidth < 768) return 'mobile';
    if (containerWidth < 1024) return 'tablet';
    return 'desktop';
  }, [containerWidth]);

  // Use TouchOptimizedCanvas for mobile devices
  if (deviceType === 'mobile') {
    return (
      <TouchOptimizedCanvas
        currentSlide={currentSlide}
        zoomLevel={zoomLevel}
        editable={editable}
        userType={userType}
        containerWidth={canvasConfig?.displayWidth || containerWidth}
        containerHeight={canvasConfig?.displayHeight || containerHeight}
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
  
  if (!canvasConfig) {
    return (
      <CanvasLoadingState 
        progress={0}
        message="高解像度設定を初期化中..."
      />
    );
  }
  
  return (
    <div className="w-full h-full flex flex-col bg-gray-50 overflow-auto relative">
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

        {/* High resolution slide container with context menu */}
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
              width: canvasConfig.displayWidth,
              height: canvasConfig.displayHeight,
              // Apply zoom only once here - no duplicate scaling
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* High Resolution Fabric.js Canvas */}
            <canvas 
              ref={canvasRef}
              className="block rounded-lg"
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'auto'
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
                message="統合キャンバスを初期化中..."
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
            </div>
          )}
          <div className="text-xs bg-green-600 text-white px-2 py-1 rounded">
            統合解像度: {canvasConfig.width}×{canvasConfig.height} ({canvasConfig.pixelRatio}x)
          </div>
          {canvasConfig.displayCapabilities?.is8KCapable && (
            <div className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
              8K対応
            </div>
          )}
          {canvasConfig.displayCapabilities?.is4KCapable && (
            <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              4K対応
            </div>
          )}
        </div>

        {/* Right: Display & Resolution Information */}
        <div className="flex items-center gap-2">
          <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
            表示: {canvasConfig.displayWidth}×{canvasConfig.displayHeight}
          </div>
          {canvasConfig.displayCapabilities && (
            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
              物理: {canvasConfig.displayCapabilities.physicalWidth}×{canvasConfig.displayCapabilities.physicalHeight}
            </div>
          )}
          {canvasConfig.pixelRatio > 2 && (
            <div className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded border">
              統合High-DPI ({canvasConfig.pixelRatio}x)
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

UnifiedSlideCanvas.displayName = 'UnifiedSlideCanvas';

export default UnifiedSlideCanvas;
