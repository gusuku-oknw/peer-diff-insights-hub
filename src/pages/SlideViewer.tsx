
import React from "react";
import ProjectHeader from "@/components/slideviewer/layout/ProjectHeader";
import MobileWarning from "@/components/slideviewer/layout/MobileWarning";
import MainLayout from "@/components/slideviewer/core/MainLayout";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import { useSlideViewerLogic } from "@/hooks/slideviewer/useSlideViewerLogic";
import { useZoomGestures } from "@/hooks/slideviewer/useZoomGestures";

const SlideViewer: React.FC = () => {
  const { mobile } = useResponsiveLayout();
  const slideViewerLogic = useSlideViewerLogic();
  const responsiveLayout = useResponsiveLayout();
  
  // Enable zoom gestures
  useZoomGestures({
    onZoomChange: slideViewerLogic.handleZoomChange,
    currentZoom: slideViewerLogic.zoom,
    minZoom: 25,
    maxZoom: slideViewerLogic.userType === "student" ? 100 : 100,
    enabled: !mobile // Disable on mobile to avoid conflicts
  });

  // Show mobile warning for screens smaller than tablet (640px)
  if (mobile) {
    return <MobileWarning />;
  }

  // Convert number timestamp to Date object
  const presentationStartTimeDate = slideViewerLogic.presentationStartTime 
    ? new Date(slideViewerLogic.presentationStartTime) 
    : null;

  return (
    <div className="slide-viewer-container h-screen flex flex-col">
      <ProjectHeader />
      <div className="flex-1 min-h-0">
        <MainLayout
          // Slide viewer logic props
          currentSlide={slideViewerLogic.currentSlideNumber}
          totalSlides={slideViewerLogic.slides.length}
          presenterNotes={slideViewerLogic.presenterNotes}
          userType={slideViewerLogic.userType}
          presentationStartTime={presentationStartTimeDate}
          
          // Responsive layout props
          windowDimensions={responsiveLayout.windowDimensions}
          rightPanelWidth={responsiveLayout.rightPanelWidth}
          isRightPanelOpen={responsiveLayout.isRightPanelOpen}
          contentAreaDimensions={responsiveLayout.contentAreaDimensions}
          mobile={responsiveLayout.mobile}
          tablet={responsiveLayout.tablet}
          desktop={responsiveLayout.desktop}
          isMobile={responsiveLayout.isMobile}
          isTablet={responsiveLayout.isTablet}
          isDesktop={responsiveLayout.isDesktop}

          // Handler props
          handlePreviousSlide={slideViewerLogic.handlePreviousSlide}
          handleNextSlide={slideViewerLogic.handleNextSlide}
          handleZoomChange={slideViewerLogic.handleZoomChange}
          handleModeChange={slideViewerLogic.handleModeChange}
          handleSaveChanges={slideViewerLogic.handleSaveChanges}
          handleStartPresentation={slideViewerLogic.handleStartPresentation}
          togglePresenterNotes={slideViewerLogic.togglePresenterNotes}
        />
      </div>
    </div>
  );
};

export default SlideViewer;
