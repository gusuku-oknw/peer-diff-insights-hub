import React, { useCallback, memo, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { debounce } from "lodash";

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ZoomControls = ({ zoom, onZoomChange }: ZoomControlsProps) => {
  console.log(`Rendering ZoomControls - Current zoom: ${zoom}%`);
  
  // Keep internal state for smooth UI updates
  const [internalZoom, setInternalZoom] = useState(zoom);
  
  // Update internal zoom when prop changes
  useEffect(() => {
    setInternalZoom(zoom);
  }, [zoom]);
  
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
  
  // Create debounced zoom handler that only triggers actual zoom change after delay
  // leading: falseでズーム操作開始時のレンダリングを抑制
  // trailing: trueでズーム操作終了時のみレンダリングを発生させる
  const debouncedZoomChange = useMemo(() => 
    debounce((newZoom: number) => {
      onZoomChange(newZoom);
    }, 150, { leading: false, trailing: true }),
    [onZoomChange]
  );

  // バウンド付きズーム変更ハンドラをメモ化
  const handleZoomChange = useCallback((newZoom: number) => {
    // Ensure zoom stays between 25% and 200%
    const boundedZoom = Math.min(Math.max(newZoom, 25), 200);
    
    // 変更がない場合は処理をスキップ
    if (boundedZoom === internalZoom) return;
    
    // Update internal state immediately for responsive UI
    setInternalZoom(boundedZoom);
    
    // Debounce the actual propagation to parent
    debouncedZoomChange(boundedZoom);
  }, [internalZoom, debouncedZoomChange]);

  // Increment/decrement zoom by a fixed percentage
  const incrementZoom = useCallback(() => {
    handleZoomChange(internalZoom + 10);
  }, [internalZoom, handleZoomChange]);

  // Decrement zoom by a fixed percentage
  const decrementZoom = useCallback(() => {
    handleZoomChange(internalZoom - 10);
  }, [internalZoom, handleZoomChange]);
  
  // Reset zoom to 100%
  const resetZoom = useCallback(() => {
    handleZoomChange(100);
  }, [handleZoomChange]);
  
  // Clean up the debounce on unmount
  useEffect(() => {
    return () => {
      debouncedZoomChange.cancel();
    };
  }, [debouncedZoomChange]);

  // ドロップダウンメニュー項目をメモ化
  const dropdownItems = useMemo(() => (
    zoomPresets.map(preset => (
      <DropdownMenuItem 
        key={preset.value} 
        onClick={() => handleZoomChange(preset.value)}
      >
        {preset.label}
      </DropdownMenuItem>
    ))
  ), [zoomPresets, handleZoomChange]);

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            onClick={resetZoom}
            title="クリックして100%に戻す"
          >
            <span className="font-medium">{internalZoom}%</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>ズーム設定</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dropdownItems}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        onClick={decrementZoom} 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50"
        title="縮小"
      >
        <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      
      <Button 
        onClick={incrementZoom} 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50"
        title="拡大"
      >
        <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
};

// メモ化を最適化
export default memo(ZoomControls, (prevProps, nextProps) => {
  // 本当にzoomが変わった時だけ再レンダリング
  return prevProps.zoom === nextProps.zoom;
});
