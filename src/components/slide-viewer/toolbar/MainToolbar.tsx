
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Monitor, 
  Edit3, 
  MessageSquare, 
  SidebarLeft, 
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
  return (
    <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200 h-12">
      {/* Left section - Navigation and sidebar toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLeftSidebarToggle}
          className={leftSidebarOpen ? "bg-blue-100" : ""}
        >
          <SidebarLeft className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousSlide}
          disabled={currentSlide <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-gray-600 min-w-16 text-center">
          {currentSlide} / {totalSlides}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextSlide}
          disabled={currentSlide >= totalSlides}
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
        >
          <Monitor className="h-4 w-4 mr-1" />
          プレゼン
        </Button>
        <Button
          variant={viewerMode === "edit" ? "default" : "ghost"}
          size="sm"
          onClick={() => onModeChange("edit")}
        >
          <Edit3 className="h-4 w-4 mr-1" />
          編集
        </Button>
        <Button
          variant={viewerMode === "review" ? "default" : "ghost"}
          size="sm"
          onClick={() => onModeChange("review")}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          レビュー
        </Button>
      </div>

      {/* Right section - Actions and zoom */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onZoomChange(Math.max(50, zoom - 10))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-gray-600 min-w-12 text-center">
          {zoom}%
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onZoomChange(Math.min(200, zoom + 10))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        {viewerMode === "presentation" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowPresenterNotesToggle}
            className={showPresenterNotes ? "bg-blue-100" : ""}
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullScreenToggle}
        >
          <Maximize className="h-4 w-4" />
        </Button>
        
        {viewerMode === "presentation" ? (
          <Button onClick={onStartPresentation} size="sm">
            <Play className="h-4 w-4 mr-1" />
            開始
          </Button>
        ) : (
          <Button onClick={onSaveChanges} size="sm">
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
        )}
      </div>
    </div>
  );
};

export default MainToolbar;
