
import React from "react";
import { EditSidebarWrapper } from "../EditSidebarWrapper";
import { CentralContentArea } from "../CentralContentArea";
import { RightPanelWrapper } from "../RightPanelWrapper";
import { useSlideStore } from "@/stores/slide-store";
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
}) => {
  const showEditSidebar = viewerMode === "edit" && userType === "enterprise";

  return (
    <div className="flex h-full w-full">
      {showEditSidebar && (
        <EditSidebarWrapper
          viewerMode={viewerMode}
          userType={userType}
          currentSlide={currentSlide}
        />
      )}
      
      <div className="flex-1 min-w-0">
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
          onOpenOverallReview={() => {}}
        />
      </div>

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
