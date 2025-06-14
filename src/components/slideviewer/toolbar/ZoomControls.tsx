
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
  // 確実なデフォルト値設定と検証 - 最大値を100%に制限
  const currentZoom = useMemo(() => {
    // より厳密な検証
    if (zoom === null || zoom === undefined || typeof zoom !== 'number' || isNaN(zoom) || zoom <= 0) {
      console.warn(`Invalid zoom value: ${zoom}, using default 100%`);
      return 100;
    }
    return Math.max(25, Math.min(100, Math.round(zoom))); // Limited to 100%
  }, [zoom]);
  
  console.log(`ZoomControls rendering - input zoom: ${zoom}, computed currentZoom: ${currentZoom}`);
  
  // Updated zoom presets to remove values above 100%
  const zoomPresets = useMemo(() => [
    { label: "25%", value: 25 },
    { label: "50%", value: 50 },
    { label: "75%", value: 75 },
    { label: "100%", value: 100 },
  ], []);
  
  const handleZoomChange = useCallback((newZoom: number) => {
    // 入力値の厳密な検証 - 最大値を100%に制限
    if (typeof newZoom !== 'number' || isNaN(newZoom)) {
      console.warn(`Invalid zoom input: ${newZoom}`);
      return;
    }
    
    const boundedZoom = Math.max(25, Math.min(100, Math.round(newZoom))); // Limited to 100%
    
    // 同じ値の場合はスキップ
    if (boundedZoom === currentZoom) {
      console.log(`Zoom unchanged: ${boundedZoom}%`);
      return;
    }
    
    console.log(`Zoom changing from ${currentZoom}% to ${boundedZoom}%`);
    onZoomChange(boundedZoom);
  }, [currentZoom, onZoomChange]);

  const incrementZoom = useCallback(() => {
    const newZoom = Math.min(100, currentZoom + 25); // Limited to 100%
    handleZoomChange(newZoom);
  }, [currentZoom, handleZoomChange]);

  const decrementZoom = useCallback(() => {
    const newZoom = Math.max(25, currentZoom - 25);
    handleZoomChange(newZoom);
  }, [currentZoom, handleZoomChange]);
  
  const resetZoom = useCallback(() => {
    handleZoomChange(100);
  }, [handleZoomChange]);

  const handleSliderChange = useCallback((value: number[]) => {
    if (value && value.length > 0 && typeof value[0] === 'number') {
      handleZoomChange(value[0]);
    }
  }, [handleZoomChange]);

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2 text-sm hover:bg-blue-50 hover:text-blue-600"
          >
            <span className="font-medium min-w-12 text-center">{currentZoom}%</span>
            <ChevronRight className="h-4 w-4 rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>ズーム設定 (25%-100%)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {zoomPresets.map(preset => (
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
          ))}
          <DropdownMenuSeparator />
          <div className="p-3">
            <div className="text-xs text-gray-500 mb-2">カスタム調整</div>
            <Slider
              value={[currentZoom]}
              onValueChange={handleSliderChange}
              max={100} // Limited to 100%
              min={25}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>25%</span>
              <span>100%</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={resetZoom} className="text-center justify-center">
            100%にリセット
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        onClick={decrementZoom} 
        variant="ghost" 
        size="icon" 
        disabled={currentZoom <= 25}
        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Button 
        onClick={incrementZoom} 
        variant="ghost" 
        size="icon" 
        disabled={currentZoom >= 100} // Limited to 100%
        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default memo(ZoomControls, (prevProps, nextProps) => {
  // より安全な比較
  const prevZoom = typeof prevProps.zoom === 'number' && prevProps.zoom > 0 ? Math.round(prevProps.zoom) : 100;
  const nextZoom = typeof nextProps.zoom === 'number' && nextProps.zoom > 0 ? Math.round(nextProps.zoom) : 100;
  return prevZoom === nextZoom;
});
