
import React from "react";
import { LayoutProvider } from "./LayoutProvider";
import SidebarLeft from "./SidebarLeft";
import ContentArea from "./ContentArea";
import SidebarRight from "./SidebarRight";
import { FloatingToggleButton } from "./FloatingToggleButton";
import OverallReviewPanel from "../panels/OverallReviewPanel/OverallReviewPanel.tsx";
import type { ViewerMode } from "@/types/slide.types";
import { useSlideStore } from "@/stores/slide-store";

interface MainContainerProps {
  currentBranch: string;
  branches: string[];
  commitHistory: any[];
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: ViewerMode;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: Date | null;
  presenterNotes: Record<number, string>;
  elapsedTime: number;
  displayCount: number;
  commentedSlides: number[];
  mockComments: any[];
  userType: "student" | "enterprise";
  isOverallReviewPanelOpen: boolean;
  onBranchChange: (branch: string) => void;
  onSlideChange: (slide: number) => void;
  onToggleLeftSidebar: () => void;
  onOpenOverallReview: () => void;
  onCloseOverallReview: () => void;
}

const MainContainer: React.FC<MainContainerProps> = ({
  currentBranch,
  branches,
  commitHistory,
  currentSlide,
  totalSlides,
  zoom,
  viewerMode,
  leftSidebarOpen,
  showPresenterNotes,
  isFullScreen,
  presentationStartTime,
  presenterNotes,
  elapsedTime,
  displayCount,
  commentedSlides,
  mockComments,
  userType,
  isOverallReviewPanelOpen,
  onBranchChange,
  onSlideChange,
  onToggleLeftSidebar,
  onOpenOverallReview,
  onCloseOverallReview,
}) => {
  const { isRightPanelVisible } = useSlideStore();

  // Right panel display logic
  const shouldShowNotes =
      userType === "enterprise" &&
      ((viewerMode === "presentation" && showPresenterNotes) ||
          (viewerMode === "review" && showPresenterNotes));

  const shouldShowReviewPanel = viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  const hideRightPanelCompletely =
      (viewerMode === "presentation" && isFullScreen) || !shouldDisplayRightPanel;

  const rightPanelVisible = !hideRightPanelCompletely && isRightPanelVisible();

  return (
      <LayoutProvider>
        <div className="flex h-full w-full main-layout-container overflow-hidden">
          <SidebarLeft
            leftSidebarOpen={leftSidebarOpen}
            currentBranch={currentBranch}
            branches={branches}
            commitHistory={commitHistory}
            onBranchChange={onBranchChange}
            onToggleLeftSidebar={onToggleLeftSidebar}
          />
          
          <ContentArea
            viewerMode={viewerMode}
            userType={userType}
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            zoom={zoom}
            showPresenterNotes={showPresenterNotes}
            isFullScreen={isFullScreen}
            presentationStartTime={presentationStartTime}
            presenterNotes={presenterNotes}
            elapsedTime={elapsedTime}
            displayCount={displayCount}
            commentedSlides={commentedSlides}
            mockComments={mockComments}
            onSlideChange={onSlideChange}
            rightPanelVisible={rightPanelVisible}
            hideRightPanelCompletely={hideRightPanelCompletely}
            leftSidebarOpen={leftSidebarOpen}
            onOpenOverallReview={onOpenOverallReview}
          />
          
          {rightPanelVisible && (
            <SidebarRight
              viewerMode={viewerMode}
              showPresenterNotes={showPresenterNotes}
              isFullScreen={isFullScreen}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
              userType={userType}
            />
          )}
        </div>

        <FloatingToggleButton
            viewerMode={viewerMode}
            showPresenterNotes={showPresenterNotes}
            isFullScreen={isFullScreen}
        />

        <OverallReviewPanel
            isOpen={isOverallReviewPanelOpen}
            onClose={onCloseOverallReview}
            totalSlides={totalSlides}
            presenterNotes={presenterNotes}
        />
      </LayoutProvider>
  );
};

export default MainContainer;
