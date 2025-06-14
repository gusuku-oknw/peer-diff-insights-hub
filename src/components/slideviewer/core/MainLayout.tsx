
import React from "react";
import LeftSidebar from "../layout/LeftSidebar";
import RightSidebar from "../layout/RightSidebar";
import MainContentArea from "../layout/MainContentArea";
import FloatingButtons from "../layout/FloatingButtons";
import { useMainLayoutLogic } from "@/hooks/slideviewer/useMainLayoutLogic";

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
  const {
    isMobile,
    leftSidebarOpen,
    viewerMode,
    zoom,
    showPresenterNotes,
    displayCount,
    isFullScreen,
    canvasWidth,
    canvasHeight,
    hideRightPanelCompletely,
    goToSlide,
    toggleLeftSidebar,
    isRightPanelVisible,
    handleToggleRightPanel,
    handleFullScreenToggle,
  } = useMainLayoutLogic(windowDimensions, contentAreaDimensions, isResponsiveMobile);

  // Calculate presentation start time as number
  const presentationStartTimeNumber = presentationStartTime ? presentationStartTime.getTime() : null;

  return (
    <div className="h-full flex bg-gray-50 relative">
      {/* Left Sidebar */}
      <LeftSidebar 
        isOpen={leftSidebarOpen}
        onToggle={toggleLeftSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <MainContentArea
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        zoom={zoom}
        viewerMode={viewerMode}
        isFullScreen={isFullScreen}
        showPresenterNotes={showPresenterNotes}
        presentationStartTimeNumber={presentationStartTimeNumber}
        displayCount={displayCount}
        userType={userType}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        contentAreaDimensions={contentAreaDimensions}
        isMobile={isMobile}
        onPreviousSlide={handlePreviousSlide}
        onNextSlide={handleNextSlide}
        onZoomChange={handleZoomChange}
        onModeChange={handleModeChange}
        onFullScreenToggle={handleFullScreenToggle}
        onShowPresenterNotesToggle={togglePresenterNotes}
        onStartPresentation={handleStartPresentation}
        onSaveChanges={handleSaveChanges}
        onSlideClick={goToSlide}
      />

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

      {/* Floating Action Buttons */}
      <FloatingButtons
        isMobile={isMobile}
        leftSidebarOpen={leftSidebarOpen}
        hideRightPanelCompletely={hideRightPanelCompletely}
        isRightPanelVisible={isRightPanelVisible()}
        onToggleLeftSidebar={toggleLeftSidebar}
        onToggleRightPanel={handleToggleRightPanel}
      />
    </div>
  );
};

export default MainLayout;
