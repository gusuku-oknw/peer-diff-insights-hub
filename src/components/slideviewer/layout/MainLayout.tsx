
import React from "react";
import { LayoutProvider } from "./LayoutProvider";
import { LeftSidebarWrapper } from "./LeftSidebarWrapper";
import { EditSidebarWrapper } from "./EditSidebarWrapper";
import { CentralContentArea } from "./CentralContentArea";
import { RightPanelWrapper } from "./RightPanelWrapper";
import { FloatingToggleButton } from "./FloatingToggleButton";
import OverallReviewPanel from "../panels/OverallReviewPanel";
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

const MainLayout = (props: MainLayoutProps) => {
  console.log('MainLayout render:', {
    viewerMode: props.viewerMode,
    userType: props.userType,
    currentSlide: props.currentSlide
  });

  // Calculate if right panel should be displayed
  const shouldShowNotes = props.userType === "enterprise" && 
                         ((props.viewerMode === "presentation" && props.showPresenterNotes) || 
                          (props.viewerMode === "review" && props.showPresenterNotes));
  
  const shouldShowReviewPanel = props.viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  const hideRightPanelCompletely = (props.viewerMode === "presentation" && props.isFullScreen) || 
                                  !shouldDisplayRightPanel;

  return (
    <LayoutProvider>
      <div className="flex h-full relative">
        {/* Left Sidebar */}
        <LeftSidebarWrapper
          currentBranch={props.currentBranch}
          branches={props.branches}
          commitHistory={props.commitHistory}
          leftSidebarOpen={props.leftSidebarOpen}
          onBranchChange={props.onBranchChange}
          onToggleLeftSidebar={props.onToggleLeftSidebar}
        />

        {/* Main Content Area with Edit Sidebar */}
        <div className="flex-1 flex overflow-hidden min-w-0 relative">
          {/* Edit Sidebar */}
          <EditSidebarWrapper
            viewerMode={props.viewerMode}
            userType={props.userType}
            currentSlide={props.currentSlide}
          />

          {/* Central Content Area */}
          <div className="flex-1 min-w-0">
            <CentralContentArea
              currentSlide={props.currentSlide}
              totalSlides={props.totalSlides}
              zoom={props.zoom}
              viewerMode={props.viewerMode}
              showPresenterNotes={props.showPresenterNotes}
              isFullScreen={props.isFullScreen}
              presentationStartTime={props.presentationStartTime}
              presenterNotes={props.presenterNotes}
              elapsedTime={props.elapsedTime}
              displayCount={props.displayCount}
              commentedSlides={props.commentedSlides}
              mockComments={props.mockComments}
              userType={props.userType}
              onSlideChange={props.onSlideChange}
              rightPanelCollapsed={hideRightPanelCompletely}
            />
          </div>
        </div>

        {/* Right Panel - Fixed to right edge */}
        <div className="absolute top-0 right-0 h-full z-20">
          <RightPanelWrapper
            viewerMode={props.viewerMode}
            showPresenterNotes={props.showPresenterNotes}
            isFullScreen={props.isFullScreen}
            currentSlide={props.currentSlide}
            totalSlides={props.totalSlides}
            presenterNotes={props.presenterNotes}
            userType={props.userType}
          />
        </div>
      </div>

      {/* Floating Toggle Button */}
      <FloatingToggleButton
        viewerMode={props.viewerMode}
        showPresenterNotes={props.showPresenterNotes}
        isFullScreen={props.isFullScreen}
      />

      {/* Overall Review Panel */}
      <OverallReviewPanel
        isOpen={false}
        onClose={() => {}}
        totalSlides={props.totalSlides}
        presenterNotes={props.presenterNotes}
      />
    </LayoutProvider>
  );
};

export default MainLayout;
