
import React, { useCallback, memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ZoomControls = ({ zoom, onZoomChange }: ZoomControlsProps) => {
  // 確実に100をデフォルト値とする
  const currentZoom = typeof zoom === 'number' && zoom > 0 ? zoom : 100;
  
  console.log(`Rendering ZoomControls - Current zoom: ${currentZoom}%`);
  
  const zoomPresets = useMemo(() => [
    { label: "25%", value: 25 },
    { label: "50%", value: 50 },
    { label: "75%", value: 75 },
    { label: "100% (デフォルト)", value: 100 },
    { label: "125%", value: 125 },
    { label: "150%", value: 150 },
    { label: "200%", value: 200 },
  ], []);
  
  const handleZoomChange = useCallback((newZoom: number) => {
    const boundedZoom = Math.min(Math.max(newZoom, 25), 200);
    
    if (boundedZoom === currentZoom) return;
    
    console.log(`Zoom changing from ${currentZoom}% to ${boundedZoom}%`);
    onZoomChange(boundedZoom);
  }, [currentZoom, onZoomChange]);

  const incrementZoom = useCallback(() => {
    handleZoomChange(currentZoom + 10);
  }, [currentZoom, handleZoomChange]);

  const decrementZoom = useCallback(() => {
    handleZoomChange(currentZoom - 10);
  }, [currentZoom, handleZoomChange]);
  
  const resetZoom = useCallback(() => {
    handleZoomChange(100);
  }, [handleZoomChange]);

  const handleSliderChange = useCallback((value: number[]) => {
    handleZoomChange(value[0]);
  }, [handleZoomChange]);

  const dropdownItems = useMemo(() => (
    zoomPresets.map(preset => (
      <DropdownMenuItem 
        key={preset.value} 
        onClick={() => handleZoomChange(preset.value)}
        className={currentZoom === preset.value ? "bg-blue-50 text-blue-700 font-medium" : ""}
      >
        {preset.label}
        {currentZoom === preset.value && (
          <span className="ml-auto text-blue-600">✓</span>
        )}
      </DropdownMenuItem>
    ))
  ), [zoomPresets, handleZoomChange, currentZoom]);

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="ズーム設定を開く"
          >
            <span className="font-medium min-w-12 text-center">{currentZoom}%</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>ズーム設定</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dropdownItems}
          <DropdownMenuSeparator />
          <div className="p-3">
            <div className="text-xs text-gray-500 mb-2 font-medium">カスタム調整</div>
            <Slider
              value={[currentZoom]}
              onValueChange={handleSliderChange}
              max={200}
              min={25}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>25%</span>
              <span>200%</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={resetZoom} className="text-center justify-center">
            <span>100%にリセット</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        onClick={decrementZoom} 
        variant="ghost" 
        size="icon" 
        disabled={currentZoom <= 25}
        className="rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={`縮小 (現在: ${currentZoom}%)`}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Button 
        onClick={incrementZoom} 
        variant="ghost" 
        size="icon" 
        disabled={currentZoom >= 200}
        className="rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={`拡大 (現在: ${currentZoom}%)`}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default memo(ZoomControls, (prevProps, nextProps) => {
  const prevZoom = typeof prevProps.zoom === 'number' && prevProps.zoom > 0 ? prevProps.zoom : 100;
  const nextZoom = typeof nextProps.zoom === 'number' && nextProps.zoom > 0 ? nextProps.zoom : 100;
  return prevZoom === nextZoom;
});
