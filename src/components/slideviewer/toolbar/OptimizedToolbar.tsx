
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  PanelLeft, 
  Maximize,
  MoreHorizontal,
  Keyboard,
  Clock,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import ModeSelector from "./ModeSelector";
import ModeSpecificActions from "./ModeSpecificActions";

interface OptimizedToolbarProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: "presentation" | "edit" | "review";
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  presentationStartTime: number | null;
  displayCount: number;
  userType: "student" | "enterprise";
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onZoomChange: (zoom: number) => void;
  onModeChange: (mode: "presentation" | "edit" | "review") => void;
  onLeftSidebarToggle: () => void;
  onFullScreenToggle: () => void;
  onShowPresenterNotesToggle: () => void;
  onStartPresentation: () => void;
  onSaveChanges: () => void;
}

const OptimizedToolbar: React.FC<OptimizedToolbarProps> = ({
  currentSlide,
  totalSlides,
  zoom,
  viewerMode,
  isFullScreen,
  leftSidebarOpen,
  showPresenterNotes,
  presentationStartTime,
  displayCount,
  userType,
  onPreviousSlide,
  onNextSlide,
  onZoomChange,
  onModeChange,
  onLeftSidebarToggle,
  onFullScreenToggle,
  onShowPresenterNotesToggle,
  onStartPresentation,
  onSaveChanges
}) => {
  const isMobile = useIsMobile();
  const [showShortcuts, setShowShortcuts] = useState(false);

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

  // Calculate presentation time
  const presentationTime = presentationStartTime 
    ? Math.floor((Date.now() - presentationStartTime) / 1000 / 60)
    : 0;

  // Progress percentage
  const progress = totalSlides > 0 ? (currentSlide / totalSlides) * 100 : 0;

  // Keyboard shortcuts help
  const ShortcutsDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Keyboard className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50 w-64">
        <div className="p-3">
          <h4 className="font-medium text-sm mb-2">キーボードショートカット</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>前のスライド</span>
              <span className="bg-gray-100 px-1 rounded">←</span>
            </div>
            <div className="flex justify-between">
              <span>次のスライド</span>
              <span className="bg-gray-100 px-1 rounded">→</span>
            </div>
            <div className="flex justify-between">
              <span>全画面</span>
              <span className="bg-gray-100 px-1 rounded">F11</span>
            </div>
            <div className="flex justify-between">
              <span>拡大</span>
              <span className="bg-gray-100 px-1 rounded">+</span>
            </div>
            <div className="flex justify-between">
              <span>縮小</span>
              <span className="bg-gray-100 px-1 rounded">-</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Mobile overflow menu
  const MobileOverflowMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
        <DropdownMenuItem onClick={onFullScreenToggle}>
          <Maximize className="h-4 w-4 mr-2" />
          全画面表示
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLeftSidebarToggle}>
          <PanelLeft className="h-4 w-4 mr-2" />
          サイドバー切替
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Users className="h-4 w-4 mr-2" />
          参加者: {displayCount}
        </DropdownMenuItem>
        {presentationStartTime && (
          <DropdownMenuItem>
            <Clock className="h-4 w-4 mr-2" />
            経過時間: {presentationTime}分
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isMobile) {
    return (
      <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200 h-14 shadow-sm">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Left: Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousSlide}
            disabled={currentSlide <= 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium px-2 min-w-16 text-center">
            {currentSlide}/{totalSlides}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextSlide}
            disabled={currentSlide >= totalSlides}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Center: Mode indicator */}
        <div className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">
          {viewerMode === "presentation" ? "発表" : viewerMode === "edit" ? "編集" : "確認"}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <div className="text-xs bg-gray-100 px-1 py-0.5 rounded">
            {zoom}%
          </div>
          <MobileOverflowMenu />
        </div>
      </div>
    );
  }

  return (
    <div className="modern-toolbar flex items-center justify-between p-3 bg-white border-b border-gray-200 h-16 shadow-sm">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
        <div 
          className="h-full bg-blue-500 transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Left section */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLeftSidebarToggle}
              className={`modern-button transition-all duration-200 h-8 w-8 p-0 ${
                leftSidebarOpen ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
              }`}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>サイドバー表示/非表示</p>
          </TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8 bg-gray-300" />
        
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreviousSlide}
                disabled={currentSlide <= 1}
                className="modern-button disabled:opacity-50 h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>前のスライド (←)</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="slide-counter bg-white rounded px-3 py-1 border border-gray-200 min-w-20 text-center">
            <span className="text-sm font-medium text-gray-700">
              {currentSlide} / {totalSlides}
            </span>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNextSlide}
                disabled={currentSlide >= totalSlides}
                className="modern-button disabled:opacity-50 h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>次のスライド (→)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Context info */}
        {presentationStartTime && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{presentationTime}分</span>
          </div>
        )}
        
        {displayCount > 1 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{displayCount}</span>
          </div>
        )}
      </div>

      {/* Center section */}
      <div className="flex items-center mx-4 flex-shrink-0">
        <ModeSelector 
          currentMode={viewerMode} 
          onModeChange={onModeChange} 
          userType={userType}
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="zoom-controls flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 25}
                className="modern-button h-7 w-7 p-0 disabled:opacity-50"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>縮小 (-)</p>
            </TooltipContent>
          </Tooltip>
          
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
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="modern-button h-7 w-7 p-0 disabled:opacity-50"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>拡大 (+)</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <Separator orientation="vertical" className="h-8 bg-gray-300" />
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFullScreenToggle}
                className="modern-button hover:bg-gray-50 transition-all duration-200 h-8 w-8 p-0"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>全画面表示 (F11)</p>
            </TooltipContent>
          </Tooltip>
          
          <ShortcutsDropdown />
          
          <ModeSpecificActions
            mode={viewerMode}
            displayCount={displayCount}
            isFullScreen={isFullScreen}
            showPresenterNotes={showPresenterNotes}
            userType={userType}
            onSaveChanges={onSaveChanges}
            onShowPresenterNotesToggle={onShowPresenterNotesToggle}
            onStartPresentation={onStartPresentation}
          />
        </div>
      </div>
    </div>
  );
};

export default OptimizedToolbar;
