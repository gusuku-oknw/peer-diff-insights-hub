
import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
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

  // Calculate size percentage based on rightSidebarWidth
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const sizePercentage = Math.min(40, Math.max(15, (rightSidebarWidth / windowWidth) * 100));

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        defaultSize={100 - sizePercentage}
        minSize={60}
        maxSize={85}
      >
        {/* This panel is handled by the parent component */}
        <div className="w-full h-full" />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel
        defaultSize={sizePercentage}
        minSize={15}
        maxSize={40}
        className="border-l border-gray-200 bg-white"
        onResize={(size) => {
          const newWidth = (size / 100) * windowWidth;
          setRightSidebarWidth(Math.max(200, Math.min(500, newWidth)));
        }}
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
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
