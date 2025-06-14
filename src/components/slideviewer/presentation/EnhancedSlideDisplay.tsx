
import React, { useRef, useEffect, useState, useCallback } from "react";
import OptimizedSlideCanvas from "@/features/slideviewer/components/canvas/OptimizedSlideCanvas";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedSlideDisplayProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: "presentation" | "edit" | "review";
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: Date | null;
  presenterNotes: Record<number, string>;
  elapsedTime: number;
  displayCount: number;
  commentedSlides: number[];
  mockComments: any[];
  userType: "student" | "enterprise";
  rightPanelCollapsed: boolean;
  onSlideChange: (slide: number) => void;
  onZoomChange?: (zoom: number) => void;
}

const EnhancedSlideDisplay: React.FC<EnhancedSlideDisplayProps> = ({
  currentSlide,
  totalSlides,
  zoom,
  viewerMode,
  showPresenterNotes,
  isFullScreen,
  presentationStartTime,
  presenterNotes,
  elapsedTime,
  displayCount,
  commentedSlides,
  mockComments,
  userType,
  rightPanelCollapsed,
  onSlideChange,
  onZoomChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  // Calculate available container size
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height
        });
      }
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    
    updateSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Pan functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 100 || viewerMode === "edit") return;
    
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  }, [zoom, viewerMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;

    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;

    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Touch support for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom <= 100 || viewerMode === "edit" || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    setIsPanning(true);
    setLastPanPoint({ x: touch.clientX, y: touch.clientY });
    e.preventDefault();
  }, [zoom, viewerMode]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPanning || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - lastPanPoint.x;
    const deltaY = touch.clientY - lastPanPoint.y;

    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setLastPanPoint({ x: touch.clientX, y: touch.clientY });
    e.preventDefault();
  }, [isPanning, lastPanPoint]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Reset pan when zoom changes
  useEffect(() => {
    if (zoom <= 100) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Quick zoom controls
  const handleQuickZoomIn = () => {
    if (onZoomChange) {
      const newZoom = Math.min(200, zoom + 25);
      onZoomChange(newZoom);
      toast({
        title: `ズーム: ${newZoom}%`,
        duration: 1000,
      });
    }
  };

  const handleQuickZoomOut = () => {
    if (onZoomChange) {
      const newZoom = Math.max(25, zoom - 25);
      onZoomChange(newZoom);
      toast({
        title: `ズーム: ${newZoom}%`,
        duration: 1000,
      });
    }
  };

  const handleResetView = () => {
    if (onZoomChange) {
      onZoomChange(100);
    }
    setPanOffset({ x: 0, y: 0 });
    toast({
      title: "表示をリセットしました",
      duration: 1000,
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          if (currentSlide > 1) {
            onSlideChange(currentSlide - 1);
          }
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (currentSlide < totalSlides) {
            onSlideChange(currentSlide + 1);
          }
          e.preventDefault();
          break;
        case '+':
        case '=':
          handleQuickZoomIn();
          e.preventDefault();
          break;
        case '-':
          handleQuickZoomOut();
          e.preventDefault();
          break;
        case '0':
          handleResetView();
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, totalSlides, onSlideChange]);

  const canShowQuickControls = !isFullScreen && zoom > 100;
  const zoomScale = zoom / 100;

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Quick zoom controls */}
      {canShowQuickControls && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleQuickZoomIn}
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleQuickZoomOut}
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetView}
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Zoom indicator */}
      {zoom !== 100 && (
        <div className="absolute top-4 left-4 z-10 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
          {zoom}%
        </div>
      )}

      {/* Loading state */}
      {containerSize.width === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Slide viewer - Main area */}
      <div
        ref={containerRef}
        className={`flex-1 relative bg-gray-50 w-full h-full min-h-0 min-h-[300px] overflow-hidden ${
          isPanning ? 'cursor-grabbing' : zoom > 100 ? 'cursor-grab' : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="absolute inset-0 flex items-center justify-center p-4 transition-transform duration-200"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          <div 
            ref={canvasRef}
            className="transform transition-transform duration-300 origin-center"
            style={{
              transform: `scale(${zoomScale})`,
            }}
          >
            <SlideCanvas
              currentSlide={currentSlide}
              zoomLevel={100}
              editable={viewerMode === "edit"}
              userType={userType}
              containerWidth={containerSize.width}
              containerHeight={containerSize.height}
            />
          </div>
        </div>
      </div>

      {/* Slide navigation hints for mobile */}
      {containerSize.width < 768 && !isFullScreen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          スワイプでスライド移動
        </div>
      )}
    </main>
  );
};

export default EnhancedSlideDisplay;
