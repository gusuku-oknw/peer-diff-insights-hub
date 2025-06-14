
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Minus, Plus } from "lucide-react";

interface ThumbnailSizeControlsProps {
  currentSize: number;
  onSizeChange: (newSize: number) => void;
  minSize?: number;
  maxSize?: number;
  step?: number;
}

const ThumbnailSizeControls = ({
  currentSize,
  onSizeChange,
  minSize = 120,
  maxSize = 220,
  step = 20
}: ThumbnailSizeControlsProps) => {
  const canDecrease = currentSize > minSize;
  const canIncrease = currentSize < maxSize;

  const handleDecrease = () => {
    if (canDecrease) {
      onSizeChange(Math.max(minSize, currentSize - step));
    }
  };

  const handleIncrease = () => {
    if (canIncrease) {
      onSizeChange(Math.min(maxSize, currentSize + step));
    }
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/80 disabled:opacity-50"
            onClick={handleDecrease}
            disabled={!canDecrease}
            aria-label="サムネイルサイズを小さく"
          >
            <Minus className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>小さくする</TooltipContent>
      </Tooltip>
      
      <span className="text-xs font-medium text-gray-600 px-2 min-w-[3rem] text-center">
        {currentSize}px
      </span>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/80 disabled:opacity-50"
            onClick={handleIncrease}
            disabled={!canIncrease}
            aria-label="サムネイルサイズを大きく"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>大きくする</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ThumbnailSizeControls;
