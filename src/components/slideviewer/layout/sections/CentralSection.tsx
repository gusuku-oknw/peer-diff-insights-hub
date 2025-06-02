
import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import EditSidebar from "../../../slideviewer/editor/EditSidebar";
import { CentralContentArea } from "../CentralContentArea";
import ImprovedSidePanel from "../../panels/ImprovedSidePanel";
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
  const { editSidebarWidth, rightSidebarWidth, setEditSidebarWidth, setRightSidebarWidth } = useSlideStore();
  
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
            <ResizablePanel
              defaultSize={editSidebarPercentage}
              minSize={15}
              maxSize={35}
              className="border-r border-gray-200 bg-white"
              onResize={(size) => {
                const newWidth = (size / 100) * windowWidth;
                setEditSidebarWidth(Math.max(220, Math.min(400, newWidth)));
              }}
            >
              <EditSidebar currentSlide={currentSlide} />
            </ResizablePanel>
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
            <ResizablePanel
              defaultSize={rightPanelPercentage}
              minSize={15}
              maxSize={40}
              className="border-l border-gray-200 bg-white"
              onResize={(size) => {
                const newWidth = (size / 100) * windowWidth;
                setRightSidebarWidth(Math.max(200, Math.min(500, newWidth)));
              }}
            >
              <ImprovedSidePanel
                shouldShowNotes={showPresenterNotes && userType === "enterprise"}
                shouldShowReviewPanel={viewerMode === "review"}
                currentSlide={currentSlide}
                totalSlides={totalSlides}
                presenterNotes={presenterNotes}
                isHidden={false}
                onToggleHide={() => {}}
                userType={userType}
                onWidthChange={setRightSidebarWidth}
                initialWidth={rightSidebarWidth}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};
