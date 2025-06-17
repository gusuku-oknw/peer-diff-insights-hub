
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  ChevronRight, 
  PanelLeft, 
  Maximize,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import ModeSelector from "@/components/slideviewer/toolbar/ModeSelector";
import ModeSpecificActions from "@/components/slideviewer/toolbar/ModeSpecificActions";
import ZoomControlsEnhanced from "@/components/slideviewer/toolbar/ZoomControlsEnhanced";

interface ResponsiveToolbarProps {
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

const ResponsiveToolbar: React.FC<ResponsiveToolbarProps> = ({
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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive breakpoints
  const isVerySmall = windowWidth < 640;
  const isSmall = windowWidth < 768;
  const isMedium = windowWidth < 1024;

  // Mobile dropdown menu for secondary actions
  const SecondaryActionsDropdown = () => (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isVerySmall) {
    return (
      <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200 h-12 shadow-sm overflow-hidden">
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
          
          <span className="text-xs font-medium px-2">
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

        <div className="flex items-center gap-2">
          <div className="text-xs bg-gray-100 px-2 py-1 rounded">
            {viewerMode === "presentation" ? "発表" : viewerMode === "edit" ? "編集" : "確認"}
          </div>
          <SecondaryActionsDropdown />
        </div>
      </div>
    );
  }

  if (isSmall) {
    return (
      <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200 h-14 shadow-sm overflow-x-hidden">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLeftSidebarToggle}
            className={`h-8 w-8 p-0 ${leftSidebarOpen ? "bg-blue-50" : ""}`}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1 bg-gray-50 rounded p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreviousSlide}
              disabled={currentSlide <= 1}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            
            <span className="text-sm font-medium px-2">
              {currentSlide}/{totalSlides}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onNextSlide}
              disabled={currentSlide >= totalSlides}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <ModeSelector 
            currentMode={viewerMode} 
            onModeChange={onModeChange} 
            userType={userType}
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ZoomControlsEnhanced 
            zoom={zoom} 
            onZoomChange={onZoomChange} 
            isCompact={true}
          />
          <SecondaryActionsDropdown />
        </div>
      </div>
    );
  }

  if (isMedium) {
    return (
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 h-16 shadow-sm overflow-x-hidden">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLeftSidebarToggle}
            className={`modern-button ${leftSidebarOpen ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"} h-8 w-8 p-0`}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-8 bg-gray-300" />
          
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreviousSlide}
              disabled={currentSlide <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="bg-white rounded px-3 py-1 border">
              <span className="text-sm font-medium text-gray-700">
                {currentSlide} of {totalSlides}
              </span>
            </div>
            
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
        </div>

        <div className="flex items-center mx-4 flex-shrink-0">
          <ModeSelector 
            currentMode={viewerMode} 
            onModeChange={onModeChange} 
            userType={userType}
          />
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <ZoomControlsEnhanced zoom={zoom} onZoomChange={onZoomChange} />
          
          <Separator orientation="vertical" className="h-8 bg-gray-300" />
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullScreenToggle}
              className="hover:bg-gray-50 h-8 w-8 p-0"
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
  }

  // Large screens
  return (
    <div className="modern-toolbar flex items-center justify-between p-3 bg-white border-b border-gray-200 h-16 shadow-sm overflow-x-hidden">
      <div className="flex items-center gap-3 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLeftSidebarToggle}
          className={`modern-button ${leftSidebarOpen ? "bg-blue-50 text-blue-700 border-blue-200" : "hover:bg-gray-50"} transition-all duration-200 h-auto w-auto p-2`}
          title="サイドバー表示/非表示"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-8 bg-gray-300" />
        
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousSlide}
            disabled={currentSlide <= 1}
            className="modern-button disabled:opacity-50 h-8 w-8 p-0"
            title="前のスライド (←)"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="slide-counter bg-white rounded px-3 py-1 border border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              {currentSlide} of {totalSlides}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextSlide}
            disabled={currentSlide >= totalSlides}
            className="modern-button disabled:opacity-50 h-8 w-8 p-0"
            title="次のスライド (→)"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center mx-4 flex-shrink-0">
        <ModeSelector 
          currentMode={viewerMode} 
          onModeChange={onModeChange} 
          userType={userType}
        />
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <ZoomControlsEnhanced zoom={zoom} onZoomChange={onZoomChange} />
        
        <Separator orientation="vertical" className="h-8 bg-gray-300" />
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFullScreenToggle}
            className="modern-button hover:bg-gray-50 transition-all duration-200 h-auto w-auto p-2"
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

export default ResponsiveToolbar;
