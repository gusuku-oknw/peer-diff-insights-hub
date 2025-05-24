
import React, { useCallback, memo, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ZoomControls = ({ zoom, onZoomChange }: ZoomControlsProps) => {
  console.log(`Rendering ZoomControls - Current zoom: ${zoom}%`);
  
  // プリセットズームレベルをメモ化
  const zoomPresets = useMemo(() => [
    { label: "25%", value: 25 },
    { label: "50%", value: 50 },
    { label: "75%", value: 75 },
    { label: "100% (デフォルト)", value: 100 },
    { label: "125%", value: 125 },
    { label: "150%", value: 150 },
    { label: "200%", value: 200 },
  ], []);
  
  // バウンド付きズーム変更ハンドラをメモ化
  const handleZoomChange = useCallback((newZoom: number) => {
    // Ensure zoom stays between 25% and 200%
    const boundedZoom = Math.min(Math.max(newZoom, 25), 200);
    
    // 変更がない場合は処理をスキップ
    if (boundedZoom === zoom) return;
    
    // 即座に変更を適用
    onZoomChange(boundedZoom);
  }, [zoom, onZoomChange]);

  // Increment/decrement zoom by a fixed percentage
  const incrementZoom = useCallback(() => {
    handleZoomChange(zoom + 10);
  }, [zoom, handleZoomChange]);

  // Decrement zoom by a fixed percentage
  const decrementZoom = useCallback(() => {
    handleZoomChange(zoom - 10);
  }, [zoom, handleZoomChange]);
  
  // Reset zoom to 100%
  const resetZoom = useCallback(() => {
    handleZoomChange(100);
  }, [handleZoomChange]);

  // スライダー変更ハンドラ
  const handleSliderChange = useCallback((value: number[]) => {
    handleZoomChange(value[0]);
  }, [handleZoomChange]);

  // ドロップダウンメニュー項目をメモ化
  const dropdownItems = useMemo(() => (
    zoomPresets.map(preset => (
      <DropdownMenuItem 
        key={preset.value} 
        onClick={() => handleZoomChange(preset.value)}
        className={zoom === preset.value ? "bg-blue-50 text-blue-700" : ""}
      >
        {preset.label}
      </DropdownMenuItem>
    ))
  ), [zoomPresets, handleZoomChange, zoom]);

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:bg-gray-100"
            title="ズーム設定を開く"
          >
            <span className="font-medium min-w-10 text-center">{zoom}%</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>ズーム設定</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dropdownItems}
          <DropdownMenuSeparator />
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2">スライダー調整</div>
            <Slider
              value={[zoom]}
              onValueChange={handleSliderChange}
              max={200}
              min={25}
              step={5}
              className="w-full"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        onClick={decrementZoom} 
        variant="ghost" 
        size="icon" 
        disabled={zoom <= 25}
        className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50 disabled:opacity-50"
        title="縮小 (10%)"
      >
        <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      
      <Button 
        onClick={incrementZoom} 
        variant="ghost" 
        size="icon" 
        disabled={zoom >= 200}
        className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50 disabled:opacity-50"
        title="拡大 (10%)"
      >
        <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
};

// メモ化を最適化
export default memo(ZoomControls, (prevProps, nextProps) => {
  // ズームが変わった時だけ再レンダリング
  return prevProps.zoom === nextProps.zoom;
});
