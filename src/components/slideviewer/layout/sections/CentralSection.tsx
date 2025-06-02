
import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
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

  // If no sidebars are shown, just render the central content
  if (!showEditSidebar && !rightPanelVisible) {
    return (
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
    );
  }

  // Calculate layout percentages
  const { editSidebarWidth, rightSidebarWidth } = useSlideStore();
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  
  let editSidebarPercentage = 0;
  let rightPanelPercentage = 0;
  
  if (showEditSidebar) {
    editSidebarPercentage = Math.min(35, Math.max(15, (editSidebarWidth / windowWidth) * 100));
  }
  
  if (rightPanelVisible) {
    rightPanelPercentage = Math.min(40, Math.max(15, (rightSidebarWidth / windowWidth) * 100));
  }
  
  const centralPercentage = 100 - editSidebarPercentage - rightPanelPercentage;

  return (
    <div className="flex h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {showEditSidebar && (
          <>
            <EditSidebarWrapper
              viewerMode={viewerMode}
              userType={userType}
              currentSlide={currentSlide}
            />
            <ResizableHandle withHandle />
          </>
        )}
        
        <ResizablePanel 
          defaultSize={centralPercentage}
          minSize={30}
        >
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
        </ResizablePanel>

        {rightPanelVisible && (
          <>
            <ResizableHandle withHandle />
            <RightPanelWrapper
              viewerMode={viewerMode}
              showPresenterNotes={showPresenterNotes}
              isFullScreen={isFullScreen}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
              userType={userType}
            />
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};
