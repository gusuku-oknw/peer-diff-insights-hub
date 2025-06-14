import React from "react";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import PresentationContent from "../presentation/PresentationContent";
import { FloatingToggleButton } from "./FloatingToggleButton";
import OverallReviewPanel from "../panels/OverallReviewPanel/OverallReviewPanel.tsx";
import OptimizedToolbar from "../toolbar/OptimizedToolbar";
import type { ViewerMode } from "@/types/slide.types";
import { useSlideStore } from "@/stores/slide-store";

// MainLayoutProps型の修正: presentationStartTimeはDate | null
interface MainLayoutProps {
  currentBranch: string;
  branches: string[];
  commitHistory: any[];
  currentSlideNumber: number;
  zoom: number;
  viewerMode: ViewerMode;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: Date | null;
  presenterNotes: Record<number, string>;
  elapsedTimeInSeconds: number;
  displayCount: number;
  slides: any[];
  userType: "student" | "enterprise";
  handlePreviousSlide: () => void;
  handleNextSlide: () => void;
  handleZoomChange: (zoom: number) => void;
  handleModeChange: (mode: ViewerMode) => void;
  handleSaveChanges: () => void;
  handleStartPresentation: () => void;
  setCurrentBranch: (branch: string) => void;
  setLeftSidebarOpen: (open: boolean) => void;
  generateThumbnails: () => void;
  setDisplayCount: (count: number) => void;
  windowDimensions: { width: number; height: number };
  rightPanelWidth: number;
  isRightPanelOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  currentBranch,
  branches,
  commitHistory,
  currentSlideNumber,
  zoom,
  viewerMode,
  leftSidebarOpen,
  showPresenterNotes,
  isFullScreen,
  presentationStartTime,
  presenterNotes,
  elapsedTimeInSeconds,
  displayCount,
  slides,
  userType,
  handlePreviousSlide,
  handleNextSlide,
  handleZoomChange,
  handleModeChange,
  handleSaveChanges,
  handleStartPresentation,
  setCurrentBranch,
  setLeftSidebarOpen,
  generateThumbnails,
  setDisplayCount,
  windowDimensions,
  rightPanelWidth,
  isRightPanelOpen,
  isMobile,
  isTablet,
  isDesktop,
}) => {
  const totalSlides = slides.length;
  const { isRightPanelVisible } = useSlideStore();
  const rightPanelVisible = isRightPanelVisible();

  // dummyデータ(移植元ContentAreaのレビューやコメント例)
  const commentedSlides = [1, 2];
  const mockComments = [
    { id: 1, text: "とても分かりやすいスライドです！", slideId: 1 },
    { id: 2, text: "この数値の根拠は？", slideId: 3 }
  ];

  return (
    <div className="flex flex-col h-full w-full main-layout-container overflow-hidden">
      {/* 1: 最適化されたツールバー */}
      <OptimizedToolbar
        currentSlide={currentSlideNumber}
        totalSlides={totalSlides}
        zoom={zoom}
        viewerMode={viewerMode}
        isFullScreen={isFullScreen}
        leftSidebarOpen={leftSidebarOpen}
        showPresenterNotes={showPresenterNotes}
        presentationStartTime={presentationStartTime ? +presentationStartTime : null}
        displayCount={displayCount}
        userType={userType}
        onPreviousSlide={handlePreviousSlide}
        onNextSlide={handleNextSlide}
        onZoomChange={handleZoomChange}
        onModeChange={handleModeChange}
        onLeftSidebarToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onFullScreenToggle={handleStartPresentation}
        onShowPresenterNotesToggle={() => {}}
        onStartPresentation={handleStartPresentation}
        onSaveChanges={handleSaveChanges}
      />

      <div className="flex flex-1 min-h-0">
        {/* サイドバー */}
        <SidebarLeft
          leftSidebarOpen={leftSidebarOpen}
          currentBranch={currentBranch}
          branches={branches}
          commitHistory={commitHistory}
          onBranchChange={setCurrentBranch}
          onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        />

        {/* コアContent。レビューパネル等との連携 */}
        <PresentationContent
          viewerMode={viewerMode}
          userType={userType}
          currentSlide={currentSlideNumber}
          totalSlides={totalSlides}
          zoom={zoom}
          showPresenterNotes={showPresenterNotes}
          isFullScreen={isFullScreen}
          presentationStartTime={presentationStartTime}
          presenterNotes={presenterNotes}
          elapsedTime={elapsedTimeInSeconds}
          displayCount={displayCount}
          commentedSlides={commentedSlides}
          mockComments={mockComments}
          onSlideChange={(slide: number) => useSlideStore.getState().setCurrentSlide(slide)}
          rightPanelVisible={rightPanelVisible}
          hideRightPanelCompletely={
            (viewerMode === "presentation" && isFullScreen) ||
            !rightPanelVisible
          }
          leftSidebarOpen={leftSidebarOpen}
          onOpenOverallReview={() => {}}
        />

        {/* サイドバー等は既存MainContainer通り */}
        {rightPanelVisible && (
          <SidebarRight
            viewerMode={viewerMode}
            showPresenterNotes={showPresenterNotes}
            isFullScreen={isFullScreen}
            currentSlide={currentSlideNumber}
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
        isOpen={false}
        onClose={() => {}}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
      />
    </div>
  );
};

export default MainLayout;
