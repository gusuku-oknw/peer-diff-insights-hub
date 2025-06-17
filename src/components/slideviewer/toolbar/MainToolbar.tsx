
import React from "react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { useIsMobile } from "@/hooks/use-mobile";
import ModeSelector from "@/components/slideviewer/toolbar/ModeSelector.tsx";
import ModeSpecificActions from "@/components/slideviewer/toolbar/ModeSpecificActions.tsx";
import ImprovedZoomControls from "@/components/slideviewer/toolbar/ImprovedZoomControls";

interface MainToolbarProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: "presentation" | "edit" | "review";
  isFullScreen: boolean;
  showPresenterNotes: boolean;
  presentationStartTime: number | null;
  displayCount: number;
  userType: "student" | "enterprise";
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onZoomChange: (zoom: number) => void;
  onModeChange: (mode: "presentation" | "edit" | "review") => void;
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
  showPresenterNotes,
  presentationStartTime,
  displayCount,
  userType,
  onPreviousSlide,
  onNextSlide,
  onZoomChange,
  onModeChange,
  onFullScreenToggle,
  onShowPresenterNotesToggle,
  onStartPresentation,
  onSaveChanges
}) => {
  const isMobile = useIsMobile();


  return (
    <div className="modern-toolbar flex items-center justify-between p-3 lg:p-4 bg-white border-b border-gray-200 h-16 lg:h-20 shadow-sm">
      {/* Left section - Navigation */}
      <div className="flex items-center gap-1 lg:gap-3 flex-shrink-0 min-w-0">
        {/* Navigation controls */}
        <div className="flex items-center gap-2 lg:gap-3 bg-gray-50 rounded-lg p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreviousSlide}
                disabled={currentSlide <= 1}
                className="modern-button disabled:opacity-50 h-8 w-8 lg:h-10 lg:w-10 p-0"
              >
                <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>前のスライド (←)</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="slide-counter bg-white rounded px-3 lg:px-4 py-2 border border-gray-200">
            <span className="text-sm lg:text-base font-medium text-gray-700">
              {currentSlide} <span className="text-gray-400 hidden lg:inline">of</span> <span className="text-gray-400 lg:hidden">/</span> {totalSlides}
            </span>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNextSlide}
                disabled={currentSlide >= totalSlides}
                className="modern-button disabled:opacity-50 h-8 w-8 lg:h-10 lg:w-10 p-0"
              >
                <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>次のスライド (→)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Center section - Mode selector */}
      <div className="flex items-center mx-2 lg:mx-4 flex-shrink-0 min-w-0">
        <ModeSelector 
          currentMode={viewerMode} 
          onModeChange={onModeChange} 
          userType={userType}
        />
      </div>

      {/* Right section - Zoom and actions */}
      <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0 min-w-0">
        <ImprovedZoomControls 
          zoom={zoom} 
          onZoomChange={onZoomChange}
          userType={userType}
          isCompact={isMobile}
        />
        
        <Separator orientation="vertical" className="h-6 lg:h-8 bg-gray-300" />
        
        <div className="flex items-center gap-1 lg:gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFullScreenToggle}
                className="modern-button hover:bg-gray-50 transition-all duration-200 h-8 w-8 p-0 lg:h-auto lg:w-auto lg:p-2"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>全画面表示 (F11)</p>
            </TooltipContent>
          </Tooltip>
          
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

export default MainToolbar;
