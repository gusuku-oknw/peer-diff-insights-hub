import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useOptimizedSlideCanvas } from "@/hooks/slideviewer/useOptimizedSlideCanvas";
import { useStandardSlideSize } from "@/hooks/slideviewer/useStandardSlideSize";
import { useEnhancedCanvasActions } from "@/hooks/slideviewer/canvas/useEnhancedCanvasActions";
import { useCanvasShortcuts } from "@/hooks/slideviewer/canvas/useCanvasShortcuts";
import { renderElementsWithEmptyState } from "@/utils/slideCanvas/enhancedElementRenderer";
import { detectDisplayCapabilities } from "@/utils/slideCanvas/standardSlideSizes";
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

  // 超高解像度ディスプレイ検出と最適化
  const displayCapabilities = useMemo(() => detectDisplayCapabilities(), []);
  
  // Super High-DPI スケーリング（最大6倍まで対応）
  const pixelRatio = useMemo(() => {
    const maxRatio = displayCapabilities.is8KCapable ? 6 : 
                    displayCapabilities.is4KCapable ? 4 : 
                    displayCapabilities.isUltraHighDPI ? 3 : 2;
    return Math.min(displayCapabilities.pixelRatio || 1, maxRatio);
  }, [displayCapabilities]);

  // Use standard slide sizes with ultra-high resolution support
  const { slideSize, deviceType } = useStandardSlideSize({
    containerWidth,
    containerHeight,
    preferredAspectRatio: 16 / 9
  });

  // Ultra-high resolution slide size with Super High-DPI scaling
  const ultraSlideSize = useMemo(() => {
    // 基本解像度をpixelRatioで拡大
    const scaledWidth = slideSize.width * pixelRatio;
    const scaledHeight = slideSize.height * pixelRatio;
    
    // 表示サイズは元のサイズを維持
    const displayWidth = slideSize.width;
    const displayHeight = slideSize.height;
    
    return {
      width: scaledWidth,
      height: scaledHeight,
      displayWidth,
      displayHeight,
      scale: pixelRatio,
      baseWidth: slideSize.width,
      baseHeight: slideSize.height,
      resolution: `${scaledWidth}x${scaledHeight}`,
      displayResolution: `${displayWidth}x${displayHeight}`
    };
  }, [slideSize, pixelRatio]);

  // Memoize canvas configuration
  const canvasConfig = useMemo(() => ({
    currentSlide,
    editable,
    containerWidth: ultraSlideSize.width,
    containerHeight: ultraSlideSize.height,
    enablePerformanceMode
  }), [currentSlide, editable, ultraSlideSize.width, ultraSlideSize.height, enablePerformanceMode]);

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

  // Ultra-high resolution canvas setup with maximum quality
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const canvasElement = canvasRef.current;
    
    if (!canvas || !canvasElement || !isReady) return;

    console.log('Setting up ultra-high resolution canvas:', {
      resolution: ultraSlideSize.resolution,
      displaySize: ultraSlideSize.displayResolution,
      pixelRatio,
      displayCapabilities
    });

    // Set ultra-high resolution canvas dimensions
    canvasElement.width = ultraSlideSize.width;
    canvasElement.height = ultraSlideSize.height;
    
    // Scale the CSS size back down for proper display
    canvasElement.style.width = `${ultraSlideSize.displayWidth}px`;
    canvasElement.style.height = `${ultraSlideSize.displayHeight}px`;
    
    // Update Fabric.js canvas dimensions
    canvas.setDimensions({
      width: ultraSlideSize.width,
      height: ultraSlideSize.height
    });
    
    // Get context and apply ultra-high quality settings
    const ctx = canvasElement.getContext('2d');
    if (ctx) {
      // Scale context for ultra-high DPI
      if (pixelRatio > 1) {
        ctx.scale(pixelRatio, pixelRatio);
      }
      
      // Maximum quality rendering settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Enhanced text rendering
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'start';
      
      // Anti-aliasing and quality optimizations
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.miterLimit = 10;
    }
    
    // Update Fabric.js zoom to compensate for ultra-high scaling
    canvas.setZoom(pixelRatio);
    
    // Enable enhanced rendering options in Fabric.js
    canvas.enableRetinaScaling = true;
    canvas.imageSmoothingEnabled = true;
    
    canvas.renderAll();
    
    console.log(`Ultra-high DPI canvas ready: ${ultraSlideSize.resolution} (${pixelRatio}x scale)`);
  }, [fabricCanvasRef.current, isReady, ultraSlideSize, pixelRatio, displayCapabilities]);

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
  
  // Ultra-high resolution element rendering
  const handleUltraRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    try {
      const result = renderElementsWithEmptyState(
        canvas, 
        elements, 
        ultraSlideSize,
        editable, 
        currentSlide,
        handleAddText,
        handleAddShape,
        handleAddImage
      );
      setIsEmpty(result.isEmpty);
    } catch (err) {
      console.error('Ultra rendering failed:', err);
    }
  }, [elements, currentSlide, editable, isReady, ultraSlideSize, handleAddText, handleAddShape, handleAddImage]);
  
  useEffect(() => {
    if (isReady) {
      handleUltraRenderElements();
    }
  }, [handleUltraRenderElements, isReady]);

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
        containerWidth={ultraSlideSize.displayWidth}
        containerHeight={ultraSlideSize.displayHeight}
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

        {/* Ultra-high resolution slide container with context menu */}
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
              width: ultraSlideSize.displayWidth,
              height: ultraSlideSize.displayHeight,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* Ultra-High Resolution Fabric.js Canvas */}
            <canvas 
              ref={canvasRef}
              className="block rounded-lg"
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'high-quality'
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

      {/* Enhanced Information Bar - Bottom */}
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
            解像度: {ultraSlideSize.resolution} ({pixelRatio}x)
          </div>
          {displayCapabilities.is8KCapable && (
            <div className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
              8K対応
            </div>
          )}
          {displayCapabilities.is4KCapable && (
            <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              4K対応
            </div>
          )}
        </div>

        {/* Right: Display & Resolution Information */}
        <div className="flex items-center gap-2">
          <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
            {ultraSlideSize.displayResolution} (16:9)
          </div>
          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
            物理: {displayCapabilities.physicalWidth}×{displayCapabilities.physicalHeight}
          </div>
          {pixelRatio > 2 && (
            <div className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded border">
              Super High-DPI ({pixelRatio}x)
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

OptimizedSlideCanvas.displayName = 'OptimizedSlideCanvas';

export default OptimizedSlideCanvas;
