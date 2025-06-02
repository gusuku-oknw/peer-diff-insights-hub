
import React from "react";
import { LayoutProvider } from "./LayoutProvider";
import { LeftSidebarSection } from "./sections/LeftSidebarSection";
import { CentralSection } from "./sections/CentralSection";
import { FloatingToggleButton } from "./FloatingToggleButton";
import OverallReviewPanel from "../panels/OverallReviewPanel";
import type { ViewerMode } from "@/types/slide.types";
import { useSlideStore } from "@/stores/slide-store";

interface MainLayoutProps {
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
  onBranchChange: (branch: string) => void;
  onSlideChange: (slide: number) => void;
  onToggleLeftSidebar: () => void;
  onOpenOverallReview: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
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
  onBranchChange,
  onSlideChange,
  onToggleLeftSidebar,
  onOpenOverallReview,
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
          <LeftSidebarSection
            leftSidebarOpen={leftSidebarOpen}
            currentBranch={currentBranch}
            branches={branches}
            commitHistory={commitHistory}
            onBranchChange={onBranchChange}
            onToggleLeftSidebar={onToggleLeftSidebar}
          >
            <CentralSection
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
            />
          </LeftSidebarSection>
        </div>

        <FloatingToggleButton
            viewerMode={viewerMode}
            showPresenterNotes={showPresenterNotes}
            isFullScreen={isFullScreen}
        />

        <OverallReviewPanel
            isOpen={false}
            onClose={() => {}}
            totalSlides={totalSlides}
            presenterNotes={presenterNotes}
        />
      </LayoutProvider>
  );
};

export default MainLayout;
