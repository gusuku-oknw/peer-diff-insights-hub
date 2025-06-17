
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
  BookOpen 
} from "lucide-react";

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

  return (
    <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200 h-14">
      {/* Left section - Navigation and sidebar toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLeftSidebarToggle}
          className={`${leftSidebarOpen ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"} transition-colors`}
          title="サイドバー表示/非表示"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousSlide}
          disabled={currentSlide <= 1}
          className="disabled:opacity-50 hover:bg-gray-100 transition-colors"
          title="前のスライド"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-gray-600 min-w-16 text-center font-medium">
          {currentSlide} / {totalSlides}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextSlide}
          disabled={currentSlide >= totalSlides}
          className="disabled:opacity-50 hover:bg-gray-100 transition-colors"
          title="次のスライド"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Center section - Mode selector */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <Button
          variant={viewerMode === "presentation" ? "default" : "ghost"}
          size="sm"
          onClick={() => onModeChange("presentation")}
          className={`transition-all ${viewerMode === "presentation" ? "shadow-sm" : "hover:bg-gray-200"}`}
        >
          <Monitor className="h-4 w-4 mr-1" />
          プレゼン
        </Button>
        <Button
          variant={viewerMode === "edit" ? "default" : "ghost"}
          size="sm"
          onClick={() => onModeChange("edit")}
          className={`transition-all ${viewerMode === "edit" ? "shadow-sm" : "hover:bg-gray-200"}`}
        >
          <Edit3 className="h-4 w-4 mr-1" />
          編集
        </Button>
        <Button
          variant={viewerMode === "review" ? "default" : "ghost"}
          size="sm"
          onClick={() => onModeChange("review")}
          className={`transition-all ${viewerMode === "review" ? "shadow-sm" : "hover:bg-gray-200"}`}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          レビュー
        </Button>
      </div>

      {/* Right section - Zoom and actions */}
      <div className="flex items-center gap-3">
        {/* Improved zoom controls */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 25}
            className="h-7 w-7 p-0 hover:bg-gray-200 disabled:opacity-50"
            title="縮小"
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          
          <div className="flex items-center gap-2 min-w-20">
            <Slider
              value={[zoom]}
              onValueChange={handleZoomSliderChange}
              max={200}
              min={25}
              step={5}
              className="w-16"
            />
            <span className="text-xs text-gray-600 min-w-10 text-center font-mono">
              {zoom}%
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="h-7 w-7 p-0 hover:bg-gray-200 disabled:opacity-50"
            title="拡大"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        {viewerMode === "presentation" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowPresenterNotesToggle}
            className={`${showPresenterNotes ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"} transition-colors`}
            title="プレゼンターノート表示/非表示"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullScreenToggle}
          className="hover:bg-gray-100 transition-colors"
          title="全画面表示"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        
        {viewerMode === "presentation" ? (
          <Button 
            onClick={onStartPresentation} 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <Play className="h-4 w-4 mr-1" />
            開始
          </Button>
        ) : (
          <Button 
            onClick={onSaveChanges} 
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-colors"
          >
            <GitCommitHorizontal className="h-4 w-4 mr-1" />
            コミット
          </Button>
        )}
      </div>
    </div>
  );
};

export default MainToolbar;
