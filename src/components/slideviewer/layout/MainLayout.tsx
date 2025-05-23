
import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import SlideViewerPanel from "@/components/slideviewer/panel/SlideViewerPanel";
import HistorySidebar from "@/components/slideviewer/HistorySidebar";
import SlideThumbnails from "@/components/slideviewer/SlideThumbnails";
import type { ViewerMode } from "@/stores/slideStore";

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
  elapsedTime: string;
  displayCount: number;
  commentedSlides: number[];
  mockComments: Record<number, any[]>;
  userType: "student" | "enterprise";
  onBranchChange: (branch: string) => void;
  onToggleLeftSidebar: () => void;
  onSlideChange: (slide: number) => void;
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
  onSlideChange
}: MainLayoutProps) => {
  // プレゼンテーションモードでフルスクリーン時は特別なレイアウト
  if (viewerMode === "presentation" && isFullScreen) {
    return (
      <SlideViewerPanel
        currentSlide={currentSlide}
        zoom={zoom}
        viewerMode={viewerMode}
        showPresenterNotes={showPresenterNotes}
        isFullScreen={isFullScreen}
        presentationStartTime={presentationStartTime}
        presenterNotes={presenterNotes}
        totalSlides={totalSlides}
        elapsedTime={elapsedTime}
        displayCount={displayCount}
        onSlideChange={onSlideChange}
      />
    );
  }

  // 通常のエディターレイアウト
  return (
    <ResizablePanelGroup direction="vertical" className="h-full w-full" id="slide-layout-vertical">
      {/* Main content panel */}
      <ResizablePanel defaultSize={80} minSize={50} id="main-content" order={1} className="flex-grow">
        <ResizablePanelGroup direction="horizontal" className="h-full" id="slide-layout-horizontal">
          {/* Left sidebar with history (conditionally displayed) */}
          {leftSidebarOpen && (
            <>
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50} id="history-sidebar" order={1} className="bg-white border-r border-gray-100 shadow-sm">
                <HistorySidebar 
                  currentBranch={currentBranch}
                  branches={branches}
                  commitHistory={commitHistory}
                  onBranchChange={onBranchChange}
                  onClose={onToggleLeftSidebar}
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
            </>
          )}
          
          {/* Main slide viewer */}
          <ResizablePanel id="slide-viewer" order={2} className="bg-slate-100">
            <SlideViewerPanel
              currentSlide={currentSlide}
              zoom={zoom}
              viewerMode={viewerMode}
              showPresenterNotes={showPresenterNotes}
              isFullScreen={isFullScreen}
              presentationStartTime={presentationStartTime}
              presenterNotes={presenterNotes}
              totalSlides={totalSlides}
              elapsedTime={elapsedTime}
              displayCount={displayCount}
              onSlideChange={onSlideChange}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      
      {/* Slide thumbnails */}
      <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
      <ResizablePanel defaultSize={20} minSize={15} id="thumbnails" order={2} className="min-h-[180px]">
        <SlideThumbnails
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          commentedSlides={commentedSlides}
          mockComments={mockComments}
          userType={userType}
          onSlideSelect={onSlideChange}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default MainLayout;
