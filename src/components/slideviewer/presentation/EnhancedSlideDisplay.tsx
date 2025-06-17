import React, { useRef, useEffect, useState, useCallback } from "react";
import UnifiedSlideCanvas from "@/components/slideviewer/canvas/UnifiedSlideCanvas";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface EnhancedSlideDisplayProps {
  currentSlide: number;
  zoomLevel: number;
  editable: boolean;
  userType: "student" | "enterprise";
  containerWidth: number;
  containerHeight: number;
  onZoomChange: (zoom: number) => void;
}
const EnhancedSlideDisplay: React.FC<EnhancedSlideDisplayProps> = ({
  currentSlide,
  zoomLevel,
  editable,
  userType,
  containerWidth,
  containerHeight,
  onZoomChange
}) => {
  const {
    toast
  } = useToast();
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(100, zoomLevel + 10); // Changed max from 200 to 100
    onZoomChange(newZoom);
    toast({
      title: "ズーム",
      description: `${newZoom}%に拡大しました`,
      duration: 1000
    });
  }, [zoomLevel, onZoomChange, toast]);
  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(25, zoomLevel - 10);
    onZoomChange(newZoom);
    toast({
      title: "ズーム",
      description: `${newZoom}%に縮小しました`,
      duration: 1000
    });
  }, [zoomLevel, onZoomChange, toast]);
  const handleResetZoom = useCallback(() => {
    onZoomChange(100);
    toast({
      title: "ズーム",
      description: "100%にリセットしました",
      duration: 1000
    });
  }, [onZoomChange, toast]);
  return <div className="relative w-full h-full flex flex-col">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 25} className="bg-white shadow-md">
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 100} // Changed max from 200 to 100
      className="bg-white shadow-md">
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Unified Canvas Container with zoom level */}
      <div className="flex-1 flex items-center justify-center p-4">
        <UnifiedSlideCanvas currentSlide={currentSlide} zoomLevel={zoomLevel} editable={editable} userType={userType} containerWidth={containerWidth} containerHeight={containerHeight} enablePerformanceMode={true} onZoomChange={onZoomChange} />
      </div>
    </div>;
};
export default EnhancedSlideDisplay;