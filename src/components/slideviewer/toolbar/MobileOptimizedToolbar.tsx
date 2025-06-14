
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  MoreHorizontal,
  Maximize,
  PanelLeft
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface MobileOptimizedToolbarProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: "presentation" | "edit" | "review";
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onLeftSidebarToggle: () => void;
  onFullScreenToggle: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

const MobileOptimizedToolbar: React.FC<MobileOptimizedToolbarProps> = ({
  currentSlide,
  totalSlides,
  zoom,
  viewerMode,
  isFullScreen,
  leftSidebarOpen,
  onPreviousSlide,
  onNextSlide,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onLeftSidebarToggle,
  onFullScreenToggle,
  canZoomIn,
  canZoomOut
}) => {
  const [showZoomControls, setShowZoomControls] = useState(false);

  const getModeDisplayText = () => {
    switch (viewerMode) {
      case "presentation": return "発表";
      case "edit": return "編集";
      case "review": return "確認";
      default: return "表示";
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200 h-12 shadow-sm">
      {/* Left section - Navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousSlide}
          disabled={currentSlide <= 1}
          className="h-8 w-8 p-0 touch-manipulation"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-xs font-medium px-2 py-1 bg-gray-50 rounded min-w-12 text-center">
          {currentSlide}/{totalSlides}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextSlide}
          disabled={currentSlide >= totalSlides}
          className="h-8 w-8 p-0 touch-manipulation"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Center section - Mode indicator */}
      <div className="flex items-center">
        <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
          {getModeDisplayText()}
        </div>
      </div>

      {/* Right section - Controls */}
      <div className="flex items-center gap-1">
        {/* Quick zoom toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowZoomControls(!showZoomControls)}
          className="h-8 w-8 p-0 touch-manipulation"
        >
          <span className="text-xs font-mono">{zoom}%</span>
        </Button>

        {/* More options dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 touch-manipulation"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={onZoomIn}
              disabled={!canZoomIn}
              className="flex items-center gap-2"
            >
              <ZoomIn className="h-4 w-4" />
              拡大
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onZoomOut}
              disabled={!canZoomOut}
              className="flex items-center gap-2"
            >
              <ZoomOut className="h-4 w-4" />
              縮小
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onResetZoom}
              className="flex items-center gap-2"
            >
              <span className="text-xs font-mono w-4">100%</span>
              リセット
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem 
              onClick={onLeftSidebarToggle}
              className="flex items-center gap-2"
            >
              <PanelLeft className="h-4 w-4" />
              サイドバー
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onFullScreenToggle}
              className="flex items-center gap-2"
            >
              <Maximize className="h-4 w-4" />
              全画面
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapsible zoom controls */}
      {showZoomControls && (
        <div className="absolute top-12 right-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              disabled={!canZoomOut}
              className="h-8 w-8 p-0 touch-manipulation"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <div className="text-xs font-mono bg-gray-50 px-2 py-1 rounded min-w-12 text-center">
              {zoom}%
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              disabled={!canZoomIn}
              className="h-8 w-8 p-0 touch-manipulation"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedToolbar;
