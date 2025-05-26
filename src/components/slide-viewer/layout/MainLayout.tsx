import React, { useState } from "react";
import LeftSidebar from "../../slideviewer/layout/LeftSidebar";
import MainContent from "../../slideviewer/layout/MainContent";
import SlideThumbnails from "../SlideThumbnails";
import ImprovedSidePanel from "../panels/ImprovedSidePanel";
import OverallReviewPanel from "../../slideviewer/panels/OverallReviewPanel";
import EditSidebar from "../../slideviewer/editor/EditSidebar";
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
  
  // Determine when to show panels based on mode and necessity
  const shouldShowNotes = (viewerMode === "presentation" && showPresenterNotes) || 
                         (viewerMode === "review" && showPresenterNotes);
  const shouldShowReviewPanel = viewerMode === "review";
  
  // Auto-hide right panel when it's not needed
  const shouldShowRightPanel = shouldShowNotes || shouldShowReviewPanel;

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

      {/* Main Content Area with improved layout */}
      <div className="flex-grow flex overflow-hidden min-w-0">
        {/* Edit Sidebar - only show for enterprise users in edit mode */}
        {viewerMode === "edit" && userType === "enterprise" && (
          <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white">
            <EditSidebar currentSlide={currentSlide} />
          </div>
        )}

        <div className="flex-grow flex flex-col overflow-hidden min-w-0">
          {/* Main slide display area */}
          <div className="flex-grow overflow-hidden relative">
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
              rightPanelCollapsed={rightPanelCollapsed || !shouldShowRightPanel}
              onSlideChange={onSlideChange}
            />
          </div>

          {/* Bottom thumbnails - hide in presentation mode when fullscreen */}
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
      </div>

      {/* Right Panel - only show when needed and not in fullscreen presentation */}
      {shouldShowRightPanel && !(viewerMode === "presentation" && isFullScreen) && (
        <div className={`transition-all duration-300 ease-in-out ${rightPanelCollapsed ? 'w-12' : 'w-80'} flex-shrink-0`}>
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
