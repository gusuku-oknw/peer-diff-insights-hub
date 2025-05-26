
import React from "react";
import { ResizablePanel } from "@/components/slide-viewer/layout/ResizablePanel";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import SlideThumbnails from "../SlideThumbnails";
import ImprovedSidePanel from "../panels/ImprovedSidePanel";
import OverallReviewPanel from "../panels/OverallReviewPanel";
import EditSidebar from "../editor/EditSidebar";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";
import { useSlideStore } from "@/stores/slide-store";
import type { UserRole } from "@/types/common.types";
import type { ViewerMode } from "@/types/slide.types";

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
  onSlideChange,
  onToggleLeftSidebar,
}: MainLayoutProps) => {
  // Use layout state from store
  const {
    leftSidebarWidth,
    rightSidebarWidth,
    editSidebarWidth,
    thumbnailsHeight,
    rightPanelHidden,
    isFullScreen,
    setLeftSidebarWidth,
    setRightSidebarWidth,
    setEditSidebarWidth,
    setThumbnailsHeight,
    setRightPanelHidden,
    getSlideThumbnailsWidth
  } = useSlideStore();
  
  // 右パネル表示ロジック - 学生もレビューモードでアクセス可能に修正
  const shouldShowNotes = (viewerMode === "presentation" && showPresenterNotes) || 
                         (viewerMode === "review" && showPresenterNotes);
  const shouldShowReviewPanel = viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  
  const hideRightPanelCompletely = (viewerMode === "presentation" && isFullScreen) || 
                                  !shouldDisplayRightPanel;

  const thumbnailsWidth = getSlideThumbnailsWidth();

  console.log('MainLayout render:', {
    viewerMode,
    userType,
    shouldShowNotes,
    shouldShowReviewPanel,
    shouldDisplayRightPanel,
    hideRightPanelCompletely,
    rightPanelHidden,
    thumbnailsWidth
  });

  return (
    <div className="flex h-full bg-gray-50 relative">
      {/* Left Sidebar with resize functionality */}
      {leftSidebarOpen && (
        <ResizablePanel
          initialWidth={leftSidebarWidth}
          minWidth={200}
          maxWidth={400}
          onWidthChange={setLeftSidebarWidth}
          className="bg-gray-50 border-r border-gray-200"
          resizePosition="right"
        >
          <LeftSidebar
            currentBranch={currentBranch}
            branches={branches}
            commitHistory={commitHistory}
            leftSidebarOpen={leftSidebarOpen}
            onBranchChange={onBranchChange}
            onToggleLeftSidebar={onToggleLeftSidebar}
          />
        </ResizablePanel>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Edit Sidebar - 企業ユーザーの編集モードのみ */}
        {viewerMode === "edit" && userType === "enterprise" && (
          <ResizablePanel
            initialWidth={editSidebarWidth}
            minWidth={240}
            maxWidth={400}
            onWidthChange={setEditSidebarWidth}
            className="border-r border-gray-200 bg-white"
            resizePosition="right"
          >
            <EditSidebar currentSlide={currentSlide} />
          </ResizablePanel>
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
              rightPanelCollapsed={false}
              onSlideChange={onSlideChange}
            />
          </div>

          {/* Bottom thumbnails with dynamic sizing */}
          {!(viewerMode === "presentation" && isFullScreen) && (
            <ResizablePanel
              initialWidth={thumbnailsHeight}
              minWidth={80}
              maxWidth={400}
              onWidthChange={setThumbnailsHeight}
              orientation="horizontal"
              resizePosition="top"
              className="border-t border-gray-200"
            >
              <div style={{ width: `${thumbnailsWidth}px` }}>
                <SlideThumbnails
                  currentSlide={currentSlide}
                  onSlideClick={onSlideChange}
                  onOpenOverallReview={() => {}}
                  height={thumbnailsHeight}
                  onHeightChange={setThumbnailsHeight}
                />
              </div>
            </ResizablePanel>
          )}
        </div>

        {/* Right Panel with resize functionality */}
        {!hideRightPanelCompletely && shouldDisplayRightPanel && !rightPanelHidden && (
          <ResizablePanel
            initialWidth={rightSidebarWidth}
            minWidth={240}
            maxWidth={500}
            onWidthChange={setRightSidebarWidth}
            resizePosition="left"
            className="border-l border-gray-200"
          >
            <ImprovedSidePanel
              shouldShowNotes={shouldShowNotes}
              shouldShowReviewPanel={shouldShowReviewPanel}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
              isHidden={false}
              onToggleHide={() => setRightPanelHidden(true)}
              userType={userType}
            />
          </ResizablePanel>
        )}
      </div>

      {/* Floating button to show right panel when hidden */}
      {!hideRightPanelCompletely && shouldDisplayRightPanel && rightPanelHidden && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRightPanelHidden(false)}
          className="fixed top-1/2 right-4 z-50 shadow-lg bg-white hover:bg-gray-50 border-2 transition-all duration-200 hover:scale-105 h-10 w-10 p-0"
          title="右パネルを表示"
        >
          <PanelRightOpen className="h-4 w-4 text-gray-600" />
        </Button>
      )}

      {/* Overall Review Panel */}
      <OverallReviewPanel
        isOpen={false}
        onClose={() => {}}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
      />
    </div>
  );
};

export default MainLayout;
