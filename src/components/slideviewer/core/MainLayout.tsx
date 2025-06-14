
import React from "react";
import { useSlideStore } from "@/stores/slide.store";
import { useIsMobile } from "@/hooks/use-mobile";
import LeftSidebar from "../layout/LeftSidebar";
import RightSidebar from "../layout/RightSidebar";
import OptimizedSlideCanvas from "@/features/slideviewer/components/canvas/OptimizedSlideCanvas";
import SlideThumbnails from "../SlideThumbnails";
import FloatingToggleButton from "../layout/FloatingToggleButton";
import MainToolbar from "../toolbar/MainToolbar";
import MobileOptimizedToolbar from "../toolbar/MobileOptimizedToolbar";

interface MainLayoutProps {
  // Props from useSlideViewerLogic
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  userType: "student" | "enterprise";
  presentationStartTime: Date | null;
  
  // Props from useResponsiveLayout
  windowDimensions: { width: number; height: number };
  rightPanelWidth: number;
  isRightPanelOpen: boolean;
  contentAreaDimensions: any;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // Handlers from useSlideViewerLogic
  handlePreviousSlide: () => void;
  handleNextSlide: () => void;
  handleZoomChange: (zoom: number) => void;
  handleModeChange: (mode: "presentation" | "edit" | "review") => void;
  handleSaveChanges: () => void;
  handleStartPresentation: () => void;
  togglePresenterNotes: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  currentSlide,
  totalSlides,
  presenterNotes,
  userType,
  presentationStartTime,
  windowDimensions,
  rightPanelWidth,
  isRightPanelOpen,
  contentAreaDimensions,
  isMobile: isResponsiveMobile,
  handlePreviousSlide,
  handleNextSlide,
  handleZoomChange,
  handleModeChange,
  handleSaveChanges,
  handleStartPresentation,
  togglePresenterNotes,
}) => {
  const isMobileHook = useIsMobile();
  const isMobile = isMobileHook || isResponsiveMobile;
  
  const {
    leftSidebarOpen,
    viewerMode,
    zoom,
    showPresenterNotes,
    displayCount,
    isFullScreen,
    goToSlide,
    toggleLeftSidebar,
    setRightPanelHidden,
    isRightPanelVisible,
    setZoom,
  } = useSlideStore();

  const canvasWidth = contentAreaDimensions.availableWidth - (isMobile ? 20 : 40);
  const canvasHeight = windowDimensions.height - (isMobile ? 260 : 280); // Adjusted for toolbar

  const handleToggleRightPanel = () => {
    setRightPanelHidden(!isRightPanelVisible());
  };

  const handleFullScreenToggle = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  // Calculate presentation start time as number
  const presentationStartTimeNumber = presentationStartTime ? presentationStartTime.getTime() : null;

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar */}
      <LeftSidebar 
        isOpen={leftSidebarOpen}
        onToggle={toggleLeftSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        {isMobile ? (
          <MobileOptimizedToolbar
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            zoom={zoom}
            viewerMode={viewerMode}
            isFullScreen={isFullScreen}
            leftSidebarOpen={leftSidebarOpen}
            onPreviousSlide={handlePreviousSlide}
            onNextSlide={handleNextSlide}
            onZoomIn={() => handleZoomChange(Math.min(200, zoom + 10))}
            onZoomOut={() => handleZoomChange(Math.max(25, zoom - 10))}
            onResetZoom={() => handleZoomChange(100)}
            onLeftSidebarToggle={toggleLeftSidebar}
            onFullScreenToggle={handleFullScreenToggle}
            canZoomIn={zoom < 200}
            canZoomOut={zoom > 25}
          />
        ) : (
          <MainToolbar
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            zoom={zoom}
            viewerMode={viewerMode}
            isFullScreen={isFullScreen}
            leftSidebarOpen={leftSidebarOpen}
            showPresenterNotes={showPresenterNotes}
            presentationStartTime={presentationStartTimeNumber}
            displayCount={displayCount}
            userType={userType}
            onPreviousSlide={handlePreviousSlide}
            onNextSlide={handleNextSlide}
            onZoomChange={handleZoomChange}
            onModeChange={handleModeChange}
            onLeftSidebarToggle={toggleLeftSidebar}
            onFullScreenToggle={handleFullScreenToggle}
            onShowPresenterNotesToggle={togglePresenterNotes}
            onStartPresentation={handleStartPresentation}
            onSaveChanges={handleSaveChanges}
          />
        )}

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <OptimizedSlideCanvas
            currentSlide={currentSlide}
            zoomLevel={zoom}
            editable={viewerMode === "edit"}
            userType={userType}
            containerWidth={canvasWidth}
            containerHeight={canvasHeight}
            enablePerformanceMode={true}
          />
        </div>

        {/* Thumbnails */}
        <div className="border-t border-gray-200 bg-white">
          <SlideThumbnails
            currentSlide={currentSlide}
            onSlideClick={goToSlide}
            onOpenOverallReview={() => {}}
            height={120}
            containerWidth={contentAreaDimensions.thumbnailsWidth}
            userType={userType}
            showAsPopup={isMobile}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar
        isOpen={isRightPanelVisible()}
        width={rightPanelWidth}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
        userType={userType}
        onToggle={handleToggleRightPanel}
        isMobile={isMobile}
      />

      {/* Floating Toggle Button for Mobile */}
      {isMobile && (
        <FloatingToggleButton
          onToggleLeft={toggleLeftSidebar}
          onToggleRight={handleToggleRightPanel}
          leftOpen={leftSidebarOpen}
          rightOpen={isRightPanelVisible()}
        />
      )}
    </div>
  );
};

export default MainLayout;
