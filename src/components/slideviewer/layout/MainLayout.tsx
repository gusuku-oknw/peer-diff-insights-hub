
import React from "react";
import SplitPane from "react-split-pane";
import { LayoutProvider } from "./LayoutProvider";
import { LeftSidebarWrapper } from "./LeftSidebarWrapper";
import { EditSidebarWrapper } from "./EditSidebarWrapper";
import { CentralContentArea } from "./CentralContentArea";
import { RightPanelWrapper } from "./RightPanelWrapper";
import { FloatingToggleButton } from "./FloatingToggleButton";
import OverallReviewPanel from "../panels/OverallReviewPanel";
import type { ViewerMode } from "@/types/slide.types";
import { useSlideStore } from "@/stores/slide-store";

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
  const { 
    leftSidebarWidth, 
    rightSidebarWidth, 
    editSidebarWidth,
    setLeftSidebarWidth, 
    setRightSidebarWidth,
    setEditSidebarWidth,
    isRightPanelVisible 
  } = useSlideStore();

  // 右パネル表示判定
  const shouldShowNotes =
      userType === "enterprise" &&
      ((viewerMode === "presentation" && showPresenterNotes) ||
          (viewerMode === "review" && showPresenterNotes));

  const shouldShowReviewPanel = viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  const hideRightPanelCompletely =
      (viewerMode === "presentation" && isFullScreen) || !shouldDisplayRightPanel;

  const rightPanelVisible = !hideRightPanelCompletely && isRightPanelVisible();

  return (
      <LayoutProvider>
        <div className="flex h-full w-full">
          <SplitPane
              split="vertical"
              minSize={leftSidebarOpen ? 180 : 0}
              maxSize={leftSidebarOpen ? 400 : 0}
              defaultSize={leftSidebarOpen ? leftSidebarWidth : 0}
              size={leftSidebarOpen ? leftSidebarWidth : 0}
              onDragFinished={(size) => {
                if (leftSidebarOpen) {
                  setLeftSidebarWidth(size);
                }
              }}
              allowResize={leftSidebarOpen}
              resizerStyle={leftSidebarOpen ? { 
                backgroundColor: '#e5e7eb', 
                width: '4px',
                cursor: 'col-resize'
              } : { display: 'none' }}
          >
            {leftSidebarOpen ? (
                <LeftSidebarWrapper
                    currentBranch={currentBranch}
                    branches={branches}
                    commitHistory={commitHistory}
                    leftSidebarOpen={leftSidebarOpen}
                    onBranchChange={onBranchChange}
                    onToggleLeftSidebar={onToggleLeftSidebar}
                />
            ) : (
                <div style={{ width: 0 }} />
            )}

            <SplitPane
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
              <SplitPane
                  split="vertical"
                  primary="first"
                  minSize={viewerMode === "edit" && userType === "enterprise" ? 220 : 0}
                  maxSize={viewerMode === "edit" && userType === "enterprise" ? 400 : 0}
                  defaultSize={viewerMode === "edit" && userType === "enterprise" ? editSidebarWidth : 0}
                  size={viewerMode === "edit" && userType === "enterprise" ? editSidebarWidth : 0}
                  onDragFinished={(size) => {
                    if (viewerMode === "edit" && userType === "enterprise") {
                      setEditSidebarWidth(size);
                    }
                  }}
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
                    onOpenOverallReview={onOpenOverallReview}
                />
              </SplitPane>

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
            </SplitPane>
          </SplitPane>
        </div>

        <FloatingToggleButton
            viewerMode={viewerMode}
            showPresenterNotes={showPresenterNotes}
            isFullScreen={isFullScreen}
        />

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
