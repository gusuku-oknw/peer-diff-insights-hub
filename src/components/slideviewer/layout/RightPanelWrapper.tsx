
import React from "react";
import SidePanel from "../panels/core/SidePanel";
import { useSlideStore } from "@/stores/slide.store";
import { useEnhancedPanelLayout } from "@/hooks/slideviewer/useEnhancedPanelLayout";
import type { ViewerMode } from "@/types/slide.types";

interface RightPanelWrapperProps {
  viewerMode: ViewerMode;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  userType: "student" | "enterprise";
}

export const RightPanelWrapper: React.FC<RightPanelWrapperProps> = ({
  viewerMode,
  showPresenterNotes,
  isFullScreen,
  currentSlide,
  totalSlides,
  presenterNotes,
  userType,
}) => {
  const {
    rightPanelHidden,
    setRightPanelHidden,
    getRightSidebarWidth,
  } = useSlideStore();

  const layout = useEnhancedPanelLayout();

  const shouldShowNotes =
    userType === "enterprise" &&
    ((viewerMode === "presentation" && showPresenterNotes) ||
      (viewerMode === "review" && showPresenterNotes));

  const shouldShowReviewPanel = viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  const hideRightPanelCompletely =
    (viewerMode === "presentation" && isFullScreen) || !shouldDisplayRightPanel;

  if (hideRightPanelCompletely || rightPanelHidden) {
    return null;
  }

  return (
    <SidePanel
      shouldShowNotes={shouldShowNotes}
      shouldShowReviewPanel={shouldShowReviewPanel}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      presenterNotes={presenterNotes}
      isHidden={false}
      onToggleHide={() => setRightPanelHidden(true)}
      userType={userType}
      onWidthChange={() => {}}
      initialWidth={layout.panelWidth}
    />
  );
};
