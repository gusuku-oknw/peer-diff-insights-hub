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
  const {
    rightSidebarWidth,
    rightPanelHidden,
    setRightSidebarWidth,
    setRightPanelHidden,
  } = useSlideStore();

  // ノート表示判定
  const shouldShowNotes =
      userType === "enterprise" &&
      ((viewerMode === "presentation" && showPresenterNotes) ||
          (viewerMode === "review" && showPresenterNotes));

  // レビューパネル表示判定
  const shouldShowReviewPanel = viewerMode === "review";

  // 右パネルを表示すべきか
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;

  // フルスクリーン発表時 or 表示内容なしのときは非表示
  const hideRightPanelCompletely =
      (viewerMode === "presentation" && isFullScreen) || !shouldDisplayRightPanel;

  // 非表示フラグ or ユーザーが隠した時は何もレンダーしない
  if (hideRightPanelCompletely || rightPanelHidden) {
    return null;
  }

  return (
      <div
          className="h-full flex-shrink-0"
          style={{ width: `${rightSidebarWidth}px` }}
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
            onWidthChange={setRightSidebarWidth}
            initialWidth={rightSidebarWidth}
        />
      </div>
  );
};
