
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsEnhancedProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isCompact?: boolean;
}

const ZoomControlsEnhanced: React.FC<ZoomControlsEnhancedProps> = ({
  zoom,
  onZoomChange,
  isCompact = false
}) => {
  const handleZoomSliderChange = (value: number[]) => {
    onZoomChange(value[0]);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(200, zoom + 10);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(25, zoom - 10);
    onZoomChange(newZoom);
  };

  if (isCompact) {
    return (
      <div className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
        <span className="text-xs">{zoom}%</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 25}
          className="h-6 w-6 p-0"
        >
          <ZoomOut className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          className="h-6 w-6 p-0"
        >
          <ZoomIn className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="zoom-controls flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= 25}
        className="modern-button h-7 w-7 p-0 disabled:opacity-50"
        title="縮小 (-)"
      >
        <ZoomOut className="h-3 w-3" />
      </Button>
      
      <div className="flex items-center gap-3 min-w-24">
        <Slider
          value={[zoom]}
          onValueChange={handleZoomSliderChange}
          max={200}
          min={25}
          step={5}
          className="w-20 zoom-slider"
        />
        <span className="text-sm font-mono text-gray-600 min-w-12 text-center bg-white rounded px-2 py-1 border border-gray-200">
          {zoom}%
        </span>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= 200}
        className="modern-button h-7 w-7 p-0 disabled:opacity-50"
        title="拡大 (+)"
      >
        <ZoomIn className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ZoomControlsEnhanced;
