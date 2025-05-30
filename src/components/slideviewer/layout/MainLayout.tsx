import React from "react";
import { LayoutProvider } from "./LayoutProvider";
import { LeftSidebarWrapper } from "./LeftSidebarWrapper";
import { EditSidebarWrapper } from "./EditSidebarWrapper";
import { CentralContentArea } from "./CentralContentArea";
import { RightPanelWrapper } from "./RightPanelWrapper";
import { FloatingToggleButton } from "./FloatingToggleButton";
import OverallReviewPanel from "../panels/OverallReviewPanel";
import type { ViewerMode } from "@/types/slide.types";

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
  // 右パネル表示判定
  const shouldShowNotes =
      userType === "enterprise" &&
      ((viewerMode === "presentation" && showPresenterNotes) ||
          (viewerMode === "review" && showPresenterNotes));

  const shouldShowReviewPanel = viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  const hideRightPanelCompletely =
      (viewerMode === "presentation" && isFullScreen) || !shouldDisplayRightPanel;

  return (
      <LayoutProvider>
        <div className="flex h-full w-full">
          {/* 左サイドバー */}
          <LeftSidebarWrapper
              currentBranch={currentBranch}
              branches={branches}
              commitHistory={commitHistory}
              leftSidebarOpen={leftSidebarOpen}
              onBranchChange={onBranchChange}
              onToggleLeftSidebar={onToggleLeftSidebar}
          />

          {/* 中央＋右カラムを flex で並べる */}
          <div className="flex-1 flex overflow-hidden min-w-0">
            {/* 編集用サイドバー */}
            <EditSidebarWrapper
                viewerMode={viewerMode}
                userType={userType}
                currentSlide={currentSlide}
            />

            {/* メインコンテンツ領域 */}
            <CentralContentArea
                currentSlide={currentSlide}
                totalSlides={totalSlides}
                zoom={zoom}
                viewerMode={viewerMode}
                showPresenterNotes={showPresenterNotes}
                isFullScreen={isFullScreen}
                presentationStartTime={presentationStartTime}
                presenterNotes={presenterNotes}
                elapsedTime={elapsedTime}
                displayCount={displayCount}
                commentedSlides={commentedSlides}
                mockComments={mockComments}
                userType={userType}
                onSlideChange={onSlideChange}
                rightPanelCollapsed={hideRightPanelCompletely}
                onOpenOverallReview={onOpenOverallReview}
            />

            {/* 右サイドパネル：collapse 状態に応じて存在を切り替え */}
            {!hideRightPanelCompletely && (
                <div className="flex-shrink-0 w-80 border-l border-gray-200 bg-white">
                  <RightPanelWrapper
                      viewerMode={viewerMode}
                      showPresenterNotes={showPresenterNotes}
                      isFullScreen={isFullScreen}
                      currentSlide={currentSlide}
                      totalSlides={totalSlides}
                      presenterNotes={presenterNotes}
                      userType={userType}
                  />
                </div>
            )}
          </div>
        </div>

        {/* 浮遊切り替えボタン */}
        <FloatingToggleButton
            viewerMode={viewerMode}
            showPresenterNotes={showPresenterNotes}
            isFullScreen={isFullScreen}
        />

        {/* 全体レビュー用パネル */}
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
