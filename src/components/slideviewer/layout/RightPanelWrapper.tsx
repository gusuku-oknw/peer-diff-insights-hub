
import React from "react";
import { ResizablePanel } from "@/components/slide-viewer/layout/ResizablePanel";
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

  // 右パネル表示ロジック - 学生もレビューモードでアクセス可能に修正
  const shouldShowNotes = (viewerMode === "presentation" && showPresenterNotes) || 
                         (viewerMode === "review" && showPresenterNotes);
  const shouldShowReviewPanel = viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  
  const hideRightPanelCompletely = (viewerMode === "presentation" && isFullScreen) || 
                                  !shouldDisplayRightPanel;

  if (hideRightPanelCompletely || !shouldDisplayRightPanel || rightPanelHidden) {
    return null;
  }

  return (
    <ResizablePanel
      initialWidth={rightSidebarWidth}
      minWidth={220}
      maxWidth={500}
      onWidthChange={setRightSidebarWidth}
      resizePosition="left"
      className="border-l border-gray-200"
    >
      <ImprovedSidePanel
        shouldShowNotes={shouldShowNotes}
        shouldShowReviewPanel={shouldShowReviewPanel}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
        isHidden={false}
        onToggleHide={() => setRightPanelHidden(true)}
        userType={userType}
      />
    </ResizablePanel>
  );
};
