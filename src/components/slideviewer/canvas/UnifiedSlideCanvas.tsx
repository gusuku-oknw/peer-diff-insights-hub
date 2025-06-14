
import React, { useRef, useEffect, useCallback } from "react";
import { useOptimizedSlideCanvas } from "@/hooks/slideviewer/useOptimizedSlideCanvas";
import { useEnhancedCanvasActions } from "@/hooks/slideviewer/canvas/useEnhancedCanvasActions";
import { useCanvasShortcuts } from "@/hooks/slideviewer/canvas/useCanvasShortcuts";
import { useCanvasState } from "@/hooks/slideviewer/canvas/useCanvasState";
import { useCanvasConfig } from "@/hooks/slideviewer/canvas/useCanvasConfig";
import { renderElementsWithEmptyState } from "@/utils/slideCanvas/enhancedElementRenderer";
import TouchOptimizedCanvas from "@/features/slideviewer/components/canvas/TouchOptimizedCanvas";
import CanvasContainer from "./CanvasContainer";
import CanvasHeader from "./CanvasHeader";
import CanvasInfoBar from "./CanvasInfoBar";

interface UnifiedSlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
  containerWidth?: number;
  containerHeight?: number;
  enablePerformanceMode?: boolean;
  onZoomChange?: (zoom: number) => void;
}

const UnifiedSlideCanvas = React.memo(({ 
  currentSlide, 
  zoomLevel = 100, 
  editable = false,
  userType = "enterprise",
  containerWidth = 0,
  containerHeight = 0,
  enablePerformanceMode = true,
  onZoomChange
}: UnifiedSlideCanvasProps) => {
  console.log(`UnifiedSlideCanvas rendering - Slide: ${currentSlide}, Zoom: ${zoomLevel}%, Container: ${containerWidth}x${containerHeight}`);
  
  // Use unified canvas configuration
  const { canvasConfig } = useCanvasConfig({
    containerWidth,
    containerHeight
  });

  // Use optimized canvas hook with simplified config
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
    canvasConfig,
    enablePerformanceMode
  });

  // Canvas state management
  const {
    showGuide,
    selectedObject,
    deviceType,
    setSelectedObject,
    handleRetry,
    handleCloseGuide
  } = useCanvasState({
    currentSlide,
    containerWidth,
    editable,
    isReady,
    isEmpty: elements.length === 0,
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

  // Handle zoom changes - apply zoom only via Fabric.js
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady || !canvasConfig) return;
    
    try {
      const zoomValue = zoomLevel / 100;
      canvas.setZoom(zoomValue);
      canvas.renderAll();
      console.log(`Canvas zoom applied: ${zoomLevel}% (value: ${zoomValue}) on canvas ${canvasConfig.displayWidth}x${canvasConfig.displayHeight}`);
    } catch (err) {
      console.error('Canvas zoom error:', err);
    }
  }, [zoomLevel, isReady, fabricCanvasRef.current, canvasConfig]);

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
  }, [fabricCanvasRef.current, setSelectedObject]);

  // Create wrapper functions for EmptyCanvasState compatibility
  const handleAddText = useCallback(() => addText(), [addText]);
  const handleAddShape = useCallback(() => addRectangle(), [addRectangle]);
  const handleAddImage = useCallback(() => {
    console.log('Image functionality coming soon');
  }, []);
  
  const handleReset = useCallback(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#ffffff';
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    if (onZoomChange) {
      onZoomChange(newZoom);
    }
  }, [onZoomChange]);

  // Simplified element rendering
  const handleRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady || !canvasConfig) return;
    
    try {
      renderElementsWithEmptyState(
        canvas, 
        elements, 
        canvasConfig,
        editable, 
        currentSlide,
        handleAddText,
        handleAddShape,
        handleAddImage
      );
      
      console.log(`Canvas rendered ${elements.length} elements`);
    } catch (err) {
      console.error('Canvas rendering failed:', err);
    }
  }, [elements, currentSlide, editable, isReady, canvasConfig, handleAddText, handleAddShape, handleAddImage, fabricCanvasRef.current]);
  
  useEffect(() => {
    if (isReady && canvasConfig) {
      handleRenderElements();
    }
  }, [handleRenderElements, isReady, canvasConfig]);

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
        <div className="text-center p-8 bg-white rounded-lg shadow border animate-fade-in">
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
      <div className="flex items-center justify-center w-full h-full bg-gray-50">
        <div className="text-center p-8 animate-fade-in">
          <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Canvas設定を初期化中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex flex-col bg-gray-50 overflow-hidden relative">
      {/* Canvas Container */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <CanvasHeader
          showGuide={showGuide}
          editable={editable}
          deviceType={deviceType}
          zoomLevel={zoomLevel}
          onCloseGuide={handleCloseGuide}
          onZoomChange={handleZoomChange}
        />

        <CanvasContainer
          canvasRef={canvasRef}
          canvasConfig={canvasConfig}
          zoomLevel={zoomLevel}
          selectedObject={selectedObject}
          isEmpty={elements.length === 0}
          isReady={isReady}
          error={error}
          editable={editable}
          currentSlide={currentSlide}
          performance={performance}
          onCopy={copySelected}
          onPaste={paste}
          onDelete={deleteSelected}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
          onDuplicate={duplicate}
          onRotate={() => rotateObject()}
          onAddText={handleAddText}
          onAddShape={handleAddShape}
          onAddImage={handleAddImage}
          onRetry={handleRetry}
          onReset={handleReset}
          hasClipboard={hasClipboard}
        />
      </div>

      {/* Enhanced Information Bar - Bottom */}
      <CanvasInfoBar
        enablePerformanceMode={enablePerformanceMode}
        performance={performance}
        canvasConfig={canvasConfig}
        zoomLevel={zoomLevel}
      />
    </div>
  );
});

UnifiedSlideCanvas.displayName = 'UnifiedSlideCanvas';

export default UnifiedSlideCanvas;
