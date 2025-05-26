
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
  
  const shouldShowNotes = (viewerMode === "presentation" && showPresenterNotes) || 
                         (viewerMode === "review" && showPresenterNotes);
  const shouldShowReviewPanel = viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  const hideRightPanelCompletely = (viewerMode === "presentation" && isFullScreen) || 
                                  !shouldDisplayRightPanel;

  console.log('MainLayout render:', {
    viewerMode,
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

      {/* Main Content Area - CSS Grid Layout */}
      <div className="flex-1 min-w-0 grid grid-cols-1 overflow-hidden" 
           style={{
             gridTemplateColumns: `${viewerMode === "edit" && userType === "enterprise" ? "320px " : ""}1fr${!hideRightPanelCompletely ? (rightPanelCollapsed ? " 48px" : " 320px") : ""}`
           }}>
        
        {/* Edit Sidebar */}
        {viewerMode === "edit" && userType === "enterprise" && (
          <div className="border-r border-gray-200 bg-white overflow-hidden">
            <EditSidebar currentSlide={currentSlide} />
          </div>
        )}

        {/* Main Content Column */}
        <div className="flex flex-col overflow-hidden min-w-0">
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

          {/* Bottom thumbnails */}
          {!(viewerMode === "presentation" && isFullScreen) && (
            <div className="flex-shrink-0">
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

        {/* Right Panel */}
        {!hideRightPanelCompletely && shouldDisplayRightPanel && (
          <div className="bg-gray-50 border-l border-gray-200 overflow-hidden">
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
