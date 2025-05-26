
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  GitCommitHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Monitor, 
  Edit3, 
  MessageSquare, 
  PanelLeft, 
  Maximize, 
  BookOpen,
  RotateCcw,
  RotateCw,
  Settings
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MainToolbarProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: "presentation" | "edit" | "review";
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  presentationStartTime: number | null;
  displayCount: number;
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

const MainToolbar: React.FC<MainToolbarProps> = ({
  currentSlide,
  totalSlides,
  zoom,
  viewerMode,
  isFullScreen,
  leftSidebarOpen,
  showPresenterNotes,
  presentationStartTime,
  displayCount,
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

  const getModeColor = (mode: "presentation" | "edit" | "review") => {
    switch (mode) {
      case "presentation":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "edit":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "review":
        return "bg-purple-500 hover:bg-purple-600 text-white";
      default:
        return "bg-gray-100 hover:bg-gray-200 text-gray-700";
    }
  };

  const getModeTooltip = (mode: "presentation" | "edit" | "review") => {
    switch (mode) {
      case "presentation":
        return "プレゼンテーションモード - 発表用の画面表示";
      case "edit":
        return "編集モード - スライドの内容を編集";
      case "review":
        return "レビューモード - コメントやフィードバック";
      default:
        return "";
    }
  };

  return (
    <div className="modern-toolbar flex items-center justify-between p-3 bg-white border-b border-gray-200 h-16 shadow-sm">
      {/* Left section - Navigation and sidebar toggle */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLeftSidebarToggle}
              className={`modern-button ${leftSidebarOpen ? "bg-blue-50 text-blue-700 border-blue-200" : "hover:bg-gray-50"} transition-all duration-200`}
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
          
          <div className="slide-counter bg-white rounded px-3 py-1 border border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              {currentSlide} <span className="text-gray-400">of</span> {totalSlides}
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
      </div>

      {/* Center section - Mode selector */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 shadow-inner">
        {(["presentation", "edit", "review"] as const).map((mode) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant={viewerMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => onModeChange(mode)}
                className={`mode-button transition-all duration-200 ${
                  viewerMode === mode 
                    ? getModeColor(mode) + " shadow-sm" 
                    : "hover:bg-white hover:shadow-sm text-gray-600"
                }`}
              >
                {mode === "presentation" && <Monitor className="h-4 w-4 mr-2" />}
                {mode === "edit" && <Edit3 className="h-4 w-4 mr-2" />}
                {mode === "review" && <MessageSquare className="h-4 w-4 mr-2" />}
                {mode === "presentation" && "プレゼン"}
                {mode === "edit" && "編集"}
                {mode === "review" && "レビュー"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getModeTooltip(mode)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Right section - Zoom and actions */}
      <div className="flex items-center gap-4">
        {/* Enhanced zoom controls */}
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
          {viewerMode === "presentation" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowPresenterNotesToggle}
                  className={`modern-button ${showPresenterNotes ? "bg-blue-50 text-blue-700 border-blue-200" : "hover:bg-gray-50"} transition-all duration-200`}
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>プレゼンターノート表示/非表示</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFullScreenToggle}
                className="modern-button hover:bg-gray-50 transition-all duration-200"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>全画面表示 (F11)</p>
            </TooltipContent>
          </Tooltip>
          
          {viewerMode === "presentation" ? (
            <Button 
              onClick={onStartPresentation} 
              size="sm"
              className="action-button bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Play className="h-4 w-4 mr-2" />
              プレゼン開始
            </Button>
          ) : (
            <Button 
              onClick={onSaveChanges} 
              size="sm"
              className="action-button bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <GitCommitHorizontal className="h-4 w-4 mr-2" />
              変更保存
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainToolbar;
