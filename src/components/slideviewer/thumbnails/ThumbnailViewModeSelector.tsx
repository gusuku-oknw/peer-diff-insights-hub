
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutGrid, List, Layers } from "lucide-react";

type ViewMode = 'horizontal' | 'grid' | 'list';

interface ThumbnailViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ThumbnailViewModeSelector = ({
  viewMode,
  onViewModeChange
}: ThumbnailViewModeSelectorProps) => {
  const viewModeIcons = {
    horizontal: Layers,
    grid: LayoutGrid,
    list: List
  };

  const viewModeLabels = {
    horizontal: '水平スクロール',
    grid: 'グリッド',
    list: 'リスト'
  };

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-md p-0.5">
      {Object.entries(viewModeIcons).map(([mode, Icon]) => (
        <Tooltip key={mode}>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === mode ? "default" : "ghost"}
              size="sm"
              className={`h-6 w-6 p-0 transition-all duration-200 ${
                viewMode === mode 
                  ? "bg-white shadow-sm text-blue-600 ring-1 ring-blue-200" 
                  : "hover:bg-white/70 text-gray-600"
              }`}
              onClick={() => onViewModeChange(mode as ViewMode)}
              aria-label={`${viewModeLabels[mode as ViewMode]}モードに切り替え`}
            >
              <Icon className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {viewModeLabels[mode as ViewMode]}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default ThumbnailViewModeSelector;
