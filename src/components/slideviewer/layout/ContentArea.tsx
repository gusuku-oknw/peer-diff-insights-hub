
import React from "react";
import { EditSidebarWrapper } from "./EditSidebarWrapper";
import SlideContent from "../slides/SlideContent";
import type { ViewerMode } from "@/types/slide.types";

interface ContentAreaProps {
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

const ContentArea: React.FC<ContentAreaProps> = ({
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
      <SlideContent
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
    </div>
  );
};

export default ContentArea;
