
import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSlideStore } from "@/stores/slide.store";

export const useMainLayoutLogic = (
  windowDimensions: { width: number; height: number },
  contentAreaDimensions: any,
  isResponsiveMobile: boolean
) => {
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
  const canvasHeight = windowDimensions.height - (isMobile ? 260 : 280);

  const handleToggleRightPanel = () => {
    const currentVisible = isRightPanelVisible();
    setRightPanelHidden(currentVisible);
  };

  const handleFullScreenToggle = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  // Determine if we should show the right panel content
  const shouldShowNotes = (viewerMode === "presentation" && showPresenterNotes) || 
                         (viewerMode === "review" && showPresenterNotes);
  const shouldShowReviewPanel = viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  
  // Hide right panel completely in presentation fullscreen mode only
  const hideRightPanelCompletely = (viewerMode === "presentation" && isFullScreen);

  return {
    isMobile,
    leftSidebarOpen,
    viewerMode,
    zoom,
    showPresenterNotes,
    displayCount,
    isFullScreen,
    canvasWidth,
    canvasHeight,
    shouldShowNotes,
    shouldShowReviewPanel,
    shouldDisplayRightPanel,
    hideRightPanelCompletely,
    goToSlide,
    toggleLeftSidebar,
    isRightPanelVisible,
    handleToggleRightPanel,
    handleFullScreenToggle,
  };
};
