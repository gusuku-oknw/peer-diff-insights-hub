
import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import SlideThumbnails from "../SlideThumbnails";
import ImprovedSidePanel from "../panels/ImprovedSidePanel";
import OverallReviewPanel from "../panels/OverallReviewPanel";
import EditSidebar from "../editor/EditSidebar";
import type { MainLayoutProps } from "@/types/slide-viewer/toolbar.types";

interface ExtendedMainLayoutProps extends MainLayoutProps {
  userType: "student" | "enterprise";
}

const MainLayout = ({
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
  onToggleLeftSidebar,
  onSlideChange,
}: ExtendedMainLayoutProps) => {
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [thumbnailsHeight, setThumbnailsHeight] = useState(128);
  const [isOverallReviewOpen, setIsOverallReviewOpen] = useState(false);
  
  // 右パネル表示ロジックを修正 - 学生のレビューモードでも台本を表示
  const shouldShowNotes = (viewerMode === "presentation" && showPresenterNotes) || 
                         (viewerMode === "review" && showPresenterNotes);
  const shouldShowReviewPanel = viewerMode === "review" && userType === "enterprise";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  
  // フルスクリーンプレゼンテーション時は右パネルを完全に非表示
  const hideRightPanelCompletely = (viewerMode === "presentation" && isFullScreen) || 
                                  !shouldDisplayRightPanel;

  console.log('MainLayout render:', {
    viewerMode,
    userType,
    shouldShowNotes,
    shouldShowReviewPanel,
    shouldDisplayRightPanel,
    hideRightPanelCompletely,
    rightPanelCollapsed
  });

  return (
    <div className="flex h-full bg-gray-50 relative">
      {/* Left Sidebar */}
      <LeftSidebar
        currentBranch={currentBranch}
        branches={branches}
        commitHistory={commitHistory}
        leftSidebarOpen={leftSidebarOpen}
        onBranchChange={onBranchChange}
        onToggleLeftSidebar={onToggleLeftSidebar}
      />

      {/* Main Content Area - Simplified Flexbox Layout */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Edit Sidebar - 企業ユーザーの編集モードのみ */}
        {viewerMode === "edit" && userType === "enterprise" && (
          <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white overflow-hidden">
            <EditSidebar currentSlide={currentSlide} />
          </div>
        )}

        {/* Central Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Main slide display area */}
          <div className="flex-1 overflow-hidden">
            <MainContent
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
              rightPanelCollapsed={hideRightPanelCompletely ? true : rightPanelCollapsed}
              onSlideChange={onSlideChange}
            />
          </div>

          {/* Bottom thumbnails - フルスクリーンプレゼンテーション時は非表示 */}
          {!(viewerMode === "presentation" && isFullScreen) && (
            <div className="flex-shrink-0 border-t border-gray-200">
              <SlideThumbnails
                currentSlide={currentSlide}
                onSlideClick={onSlideChange}
                onOpenOverallReview={() => setIsOverallReviewOpen(true)}
                height={thumbnailsHeight}
                onHeightChange={setThumbnailsHeight}
              />
            </div>
          )}
        </div>

        {/* Right Panel - サイズ管理をここで統一 */}
        {!hideRightPanelCompletely && shouldDisplayRightPanel && (
          <div className={`flex-shrink-0 transition-all duration-200 ease-in-out ${
            rightPanelCollapsed ? 'w-12' : 'w-80'
          }`}>
            <ImprovedSidePanel
              shouldShowNotes={shouldShowNotes}
              shouldShowReviewPanel={shouldShowReviewPanel}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
              isCollapsed={rightPanelCollapsed}
              onToggleCollapse={() => setRightPanelCollapsed(!rightPanelCollapsed)}
              userType={userType}
            />
          </div>
        )}
      </div>

      {/* Overall Review Panel */}
      <OverallReviewPanel
        isOpen={isOverallReviewOpen}
        onClose={() => setIsOverallReviewOpen(false)}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
      />
    </div>
  );
};

export default MainLayout;
