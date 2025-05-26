
import React from "react";
import ImprovedSidePanel from "../panels/ImprovedSidePanel";
import { useSlideStore } from "@/stores/slide-store";
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
  const { rightSidebarWidth, rightPanelHidden, setRightSidebarWidth, setRightPanelHidden } = useSlideStore();

  // Simplified panel display logic
  const shouldShowNotes = userType === "enterprise" && 
                         ((viewerMode === "presentation" && showPresenterNotes) || 
                          (viewerMode === "review" && showPresenterNotes));
  
  // Review panel is available for both student and enterprise users in review mode
  const shouldShowReviewPanel = viewerMode === "review";
  
  // Panel should display if either notes or review panel should be shown
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  
  // Hide panel completely in fullscreen presentation mode or when no content to show
  const hideRightPanelCompletely = (viewerMode === "presentation" && isFullScreen) || 
                                  !shouldDisplayRightPanel;

  if (hideRightPanelCompletely || rightPanelHidden) {
    return null;
  }

  return (
    <div className="h-full" style={{ width: rightSidebarWidth }}>
      <ImprovedSidePanel
        shouldShowNotes={shouldShowNotes}
        shouldShowReviewPanel={shouldShowReviewPanel}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
        isHidden={false}
        onToggleHide={() => setRightPanelHidden(true)}
        userType={userType}
        onWidthChange={setRightSidebarWidth}
        initialWidth={rightSidebarWidth}
      />
    </div>
  );
};
