
import React from "react";
import { useSlideViewerLogic } from "@/hooks/slideviewer/useSlideViewerLogic";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import MainLayout from "./MainLayout";

const SlideViewerCore: React.FC = () => {
  const slideViewerLogic = useSlideViewerLogic();
  const responsiveLayout = useResponsiveLayout();

  // Convert number timestamp to Date object
  const presentationStartTimeDate = slideViewerLogic.presentationStartTime 
    ? new Date(slideViewerLogic.presentationStartTime) 
    : null;

  return (
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
  );
};

export default SlideViewerCore;
