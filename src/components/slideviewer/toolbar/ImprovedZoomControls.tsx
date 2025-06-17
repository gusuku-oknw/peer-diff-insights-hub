import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  Minimize2
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ImprovedZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isCompact?: boolean;
  userType?: "student" | "enterprise";
}

const ZOOM_PRESETS = [25, 50, 75, 100];
const ZOOM_STEP = 10;

const ImprovedZoomControls: React.FC<ImprovedZoomControlsProps> = ({
  zoom,
  onZoomChange,
  isCompact = false,
  userType = "student"
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Determine max zoom based on user type
  const maxZoom = userType === "student" ? 100 : 100; // Both limited to 100% for now
  const minZoom = 25;

  const handleZoomSliderChange = (value: number[]) => {
    onZoomChange(value[0]);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(maxZoom, zoom + ZOOM_STEP);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(minZoom, zoom - ZOOM_STEP);
    onZoomChange(newZoom);
  };

  const handleZoomPreset = (presetZoom: number) => {
    onZoomChange(presetZoom);
    setIsPopoverOpen(false);
  };

  const handleZoomReset = () => {
    onZoomChange(100);
    setIsPopoverOpen(false);
  };

  const handleZoomFit = () => {
    onZoomChange(75); // Fit to container
    setIsPopoverOpen(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === '=' || event.key === '+') {
          event.preventDefault();
          handleZoomIn();
        } else if (event.key === '-') {
          event.preventDefault();
          handleZoomOut();
        } else if (event.key === '0') {
          event.preventDefault();
          handleZoomReset();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoom]);

  // Get zoom level indicator color
  const getZoomColor = () => {
    if (zoom < 50) return "text-orange-600 bg-orange-50 border-orange-200";
    if (zoom === 100) return "text-green-600 bg-green-50 border-green-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  if (isCompact) {
    return (
      <div className="flex items-center gap-1">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 px-2 text-xs font-mono ${getZoomColor()}`}
            >
              {zoom}%
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="end">
            <ZoomPopoverContent 
              zoom={zoom}
              maxZoom={maxZoom}
              minZoom={minZoom}
              onZoomChange={onZoomChange}
              onZoomPreset={handleZoomPreset}
              onZoomReset={handleZoomReset}
              onZoomFit={handleZoomFit}
            />
          </PopoverContent>
        </Popover>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= minZoom}
          className="h-8 w-8 p-0 disabled:opacity-50"
        >
          <ZoomOut className="h-3 w-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= maxZoom}
          className="h-8 w-8 p-0 disabled:opacity-50"
        >
          <ZoomIn className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= minZoom}
            className="modern-button h-9 w-9 p-0 disabled:opacity-50 hover:bg-white hover:shadow-sm"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>縮小 (Ctrl + -)</p>
        </TooltipContent>
      </Tooltip>
      
      <div className="flex items-center gap-4 min-w-32">
        <Slider
          value={[zoom]}
          onValueChange={handleZoomSliderChange}
          max={maxZoom}
          min={minZoom}
          step={5}
          className="w-24 zoom-slider-enhanced"
        />
        
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`min-w-16 h-8 text-sm font-mono font-semibold ${getZoomColor()} hover:shadow-md transition-all duration-200`}
            >
              {zoom}%
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="center">
            <ZoomPopoverContent 
              zoom={zoom}
              maxZoom={maxZoom}
              minZoom={minZoom}
              onZoomChange={onZoomChange}
              onZoomPreset={handleZoomPreset}
              onZoomReset={handleZoomReset}
              onZoomFit={handleZoomFit}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= maxZoom}
            className="modern-button h-9 w-9 p-0 disabled:opacity-50 hover:bg-white hover:shadow-sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>拡大 (Ctrl + +)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

// Zoom popover content component
const ZoomPopoverContent: React.FC<{
  zoom: number;
  maxZoom: number;
  minZoom: number;
  onZoomChange: (zoom: number) => void;
  onZoomPreset: (zoom: number) => void;
  onZoomReset: () => void;
  onZoomFit: () => void;
}> = ({ zoom, maxZoom, minZoom, onZoomChange, onZoomPreset, onZoomReset, onZoomFit }) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">ズームレベル</h4>
        <Slider
          value={[zoom]}
          onValueChange={(value) => onZoomChange(value[0])}
          max={maxZoom}
          min={minZoom}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{minZoom}%</span>
          <span>{maxZoom}%</span>
        </div>
      </div>

      <div>
        <h5 className="text-xs font-medium text-gray-700 mb-2">プリセット</h5>
        <div className="grid grid-cols-4 gap-1">
          {ZOOM_PRESETS.filter(preset => preset <= maxZoom).map((preset) => (
            <Button
              key={preset}
              variant={zoom === preset ? "default" : "outline"}
              size="sm"
              onClick={() => onZoomPreset(preset)}
              className="text-xs h-7"
            >
              {preset}%
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomFit}
            className="flex-1 text-xs h-8"
          >
            <Minimize2 className="h-3 w-3 mr-1" />
            フィット
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomReset}
            className="flex-1 text-xs h-8"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            リセット
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Ctrl + / Ctrl - でズーム</p>
        <p>• Ctrl + 0 でリセット</p>
        <p>• スライダーで細かい調整</p>
      </div>
    </div>
  );
};

export default ImprovedZoomControls;