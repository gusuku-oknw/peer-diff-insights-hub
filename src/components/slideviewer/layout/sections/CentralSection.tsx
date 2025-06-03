
import React from "react";
import { EditSidebarWrapper } from "../EditSidebarWrapper";
import { CentralContentArea } from "../CentralContentArea";
import { RightPanelWrapper } from "../RightPanelWrapper";
import type { ViewerMode } from "@/types/slide.types";

interface CentralSectionProps {
  viewerMode: ViewerMode;
  userType: "student" | "enterprise";
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: Date | null;
  presenterNotes: Record<number, string>;
  elapsedTime: number;
  displayCount: number;
  commentedSlides: number[];
  mockComments: any[];
  onSlideChange: (slide: number) => void;
  rightPanelVisible: boolean;
  hideRightPanelCompletely: boolean;
  leftSidebarOpen: boolean;
  onOpenOverallReview: () => void;
}

export const CentralSection: React.FC<CentralSectionProps> = ({
  viewerMode,
  userType,
  currentSlide,
  totalSlides,
  zoom,
  showPresenterNotes,
  isFullScreen,
  presentationStartTime,
  presenterNotes,
  elapsedTime,
  displayCount,
  commentedSlides,
  mockComments,
  onSlideChange,
  rightPanelVisible,
  hideRightPanelCompletely,
  leftSidebarOpen,
  onOpenOverallReview,
}) => {
  return (
    <div className="flex-1 flex overflow-hidden min-w-0 h-full">
      {/* Edit Sidebar (left of content) */}
      {viewerMode === "edit" && (
        <EditSidebarWrapper 
          viewerMode={viewerMode}
          userType={userType}
          currentSlide={currentSlide}
        />
      )}

      {/* Central Content */}
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
        rightPanelCollapsed={!rightPanelVisible}
        onOpenOverallReview={onOpenOverallReview}
      />

      {/* Right Panel */}
      {rightPanelVisible && (
        <RightPanelWrapper
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
  );
};
