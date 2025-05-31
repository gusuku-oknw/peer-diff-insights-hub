
import React from "react";
import { SplitPaneLayout } from "./SplitPaneLayout";
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
  const { 
    rightSidebarWidth, 
    editSidebarWidth,
    setRightSidebarWidth,
    leftSidebarWidth,
  } = useSlideStore();

  return (
    <SplitPaneLayout
      split="vertical"
      primary="first"
      minSize={400}
      maxSize={rightPanelVisible ? -200 : undefined}
      defaultSize={rightPanelVisible ? `calc(100% - ${rightSidebarWidth}px)` : "100%"}
      size={rightPanelVisible ? `calc(100% - ${rightSidebarWidth}px)` : "100%"}
      onDragFinished={(size) => {
        if (rightPanelVisible) {
          const containerWidth = window.innerWidth - (leftSidebarOpen ? leftSidebarWidth : 0);
          const newRightPanelWidth = containerWidth - size;
          setRightSidebarWidth(Math.max(200, Math.min(500, newRightPanelWidth)));
        }
      }}
      allowResize={rightPanelVisible}
      resizerStyle={rightPanelVisible ? { 
        backgroundColor: '#e5e7eb', 
        width: '4px',
        cursor: 'col-resize'
      } : { display: 'none' }}
    >
      <SplitPaneLayout
        split="vertical"
        primary="first"
        minSize={viewerMode === "edit" && userType === "enterprise" ? 220 : 0}
        maxSize={viewerMode === "edit" && userType === "enterprise" ? 400 : 0}
        defaultSize={viewerMode === "edit" && userType === "enterprise" ? editSidebarWidth : 0}
        size={viewerMode === "edit" && userType === "enterprise" ? editSidebarWidth : 0}
        onDragFinished={() => {}}
        allowResize={viewerMode === "edit" && userType === "enterprise"}
        resizerStyle={viewerMode === "edit" && userType === "enterprise" ? { 
          backgroundColor: '#e5e7eb', 
          width: '4px',
          cursor: 'col-resize'
        } : { display: 'none' }}
      >
        {viewerMode === "edit" && userType === "enterprise" ? (
          <EditSidebarWrapper
            viewerMode={viewerMode}
            userType={userType}
            currentSlide={currentSlide}
          />
        ) : (
          <div style={{ width: 0 }} />
        )}
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
      </SplitPaneLayout>
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
    </SplitPaneLayout>
  );
};
