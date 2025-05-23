
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize,
  PanelLeftOpen,
  PanelLeftClose,
  BookOpen,
  Monitor,
  Edit,
  Eye,
  MessageSquare
} from "lucide-react";
import type { ViewerMode } from "@/types/common.types";

interface MainToolbarProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: ViewerMode;
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  presentationStartTime: number | null;
  displayCount: number;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onZoomChange: (zoom: number) => void;
  onModeChange: (mode: ViewerMode) => void;
  onLeftSidebarToggle: () => void;
  onFullScreenToggle: () => void;
  onShowPresenterNotesToggle: () => void;
  onStartPresentation: () => void;
  onSaveChanges: () => void;
}

const MainToolbar = ({
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
  onSaveChanges,
}: MainToolbarProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      {/* Left section - Navigation and mode */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onLeftSidebarToggle}
        >
          {leftSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* Mode selection */}
        <div className="flex items-center space-x-1">
          <Button
            variant={viewerMode === "edit" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("edit")}
          >
            <Edit className="h-4 w-4 mr-1" />
            編集
          </Button>
          <Button
            variant={viewerMode === "presentation" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("presentation")}
          >
            <Eye className="h-4 w-4 mr-1" />
            発表
          </Button>
          <Button
            variant={viewerMode === "review" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("review")}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            レビュー
          </Button>
        </div>
      </div>

      {/* Center section - Slide navigation */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousSlide}
          disabled={currentSlide <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Badge variant="outline" className="px-3 py-1">
          {currentSlide} / {totalSlides}
        </Badge>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNextSlide}
          disabled={currentSlide >= totalSlides}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Right section - Tools and controls */}
      <div className="flex items-center space-x-2">
        {/* Zoom controls */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(zoom - 10)}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm min-w-[3rem] text-center">{zoom}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(zoom + 10)}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* Display info */}
        {displayCount > 1 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Monitor className="h-3 w-3" />
            {displayCount}画面
          </Badge>
        )}
        
        {/* Presenter notes toggle */}
        <Button
          variant={showPresenterNotes ? "default" : "outline"}
          size="sm"
          onClick={onShowPresenterNotesToggle}
        >
          <BookOpen className="h-4 w-4 mr-1" />
          メモ
        </Button>
        
        {/* Full screen toggle */}
        <Button
          variant={isFullScreen ? "default" : "outline"}
          size="sm"
          onClick={onFullScreenToggle}
        >
          {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* Action buttons */}
        {viewerMode === "edit" && (
          <Button size="sm" onClick={onSaveChanges}>
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
        )}
        
        {viewerMode === "presentation" && (
          <Button size="sm" onClick={onStartPresentation}>
            <Play className="h-4 w-4 mr-1" />
            開始
          </Button>
        )}
      </div>
    </div>
  );
};

export default MainToolbar;
