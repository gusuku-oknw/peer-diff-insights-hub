
import React from "react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  PanelLeft, 
  Maximize
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile.tsx";
import ModeSelector from "@/components/slideviewer/toolbar/ModeSelector.tsx";
import ModeSpecificActions from "@/components/slideviewer/toolbar/ModeSpecificActions.tsx";

interface SimpleMainToolbarProps {
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

const SimpleMainToolbar: React.FC<SimpleMainToolbarProps> = ({
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
    <div className="modern-toolbar flex items-center justify-between p-2 lg:p-3 bg-white border-b border-gray-200 h-14 lg:h-16 shadow-sm overflow-x-hidden">
      {/* Left section - Sidebar toggle and navigation */}
      <div className="flex items-center gap-1 lg:gap-3 flex-shrink-0">
        {/* Sidebar toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLeftSidebarToggle}
          className={`modern-button ${leftSidebarOpen ? "bg-blue-50 text-blue-700 border-blue-200" : "hover:bg-gray-50"} transition-all duration-200 h-8 w-8 p-0 lg:h-auto lg:w-auto lg:p-2`}
          title="サイドバー表示/非表示"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 lg:h-8 bg-gray-300" />
        
        {/* Navigation controls */}
        <div className="flex items-center gap-1 lg:gap-2 bg-gray-50 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousSlide}
            disabled={currentSlide <= 1}
            className="modern-button disabled:opacity-50 h-6 w-6 lg:h-8 lg:w-8 p-0"
            title="前のスライド (←)"
          >
            <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
          
          <div className="slide-counter bg-white rounded px-2 lg:px-3 py-1 border border-gray-200">
            <span className="text-xs lg:text-sm font-medium text-gray-700">
              {currentSlide} <span className="text-gray-400 hidden lg:inline">of</span> <span className="text-gray-400 lg:hidden">/</span> {totalSlides}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextSlide}
            disabled={currentSlide >= totalSlides}
            className="modern-button disabled:opacity-50 h-6 w-6 lg:h-8 lg:w-8 p-0"
            title="次のスライド (→)"
          >
            <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
      </div>

      {/* Center section - Mode selector */}
      <div className="flex items-center mx-2 lg:mx-4 flex-shrink-0">
        <ModeSelector 
          currentMode={viewerMode} 
          onModeChange={onModeChange} 
          userType={userType}
        />
      </div>

      {/* Right section - Zoom and actions */}
      <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
        {/* Enhanced zoom controls */}
        <div className="zoom-controls flex items-center gap-1 lg:gap-3 bg-gray-50 rounded-lg px-2 lg:px-4 py-1 lg:py-2 border border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 25}
            className="modern-button h-6 w-6 lg:h-7 lg:w-7 p-0 disabled:opacity-50"
            title="縮小 (-)"
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          
          <div className="hidden lg:flex items-center gap-3 min-w-24">
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
          
          <div className="lg:hidden text-xs font-mono text-gray-600 bg-white rounded px-1 py-0.5 border border-gray-200">
            {zoom}%
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="modern-button h-6 w-6 lg:h-7 lg:w-7 p-0 disabled:opacity-50"
            title="拡大 (+)"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6 lg:h-8 bg-gray-300" />
        
        <div className="flex items-center gap-1 lg:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFullScreenToggle}
            className="modern-button hover:bg-gray-50 transition-all duration-200 h-8 w-8 p-0 lg:h-auto lg:w-auto lg:p-2"
            title="全画面表示 (F11)"
          >
            <Maximize className="h-4 w-4" />
          </Button>
          
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

export default SimpleMainToolbar;
