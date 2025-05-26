
import React from "react";
import { ResizablePanel } from "@/components/slide-viewer/layout/ResizablePanel";
import MainContent from "./MainContent";
import SlideThumbnails from "@/components/slide-viewer/SlideThumbnails";
import { useSlideStore } from "@/stores/slide-store";
import type { ViewerMode } from "@/types/slide.types";

interface CentralContentAreaProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: ViewerMode;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: Date | null;
  presenterNotes: Record<number, string>;
  elapsedTime: number;
  displayCount: number;
  commentedSlides: number[];
  mockComments: any[];
  userType: "student" | "enterprise";
  onSlideChange: (slide: number) => void;
}

export const CentralContentArea: React.FC<CentralContentAreaProps> = ({
  currentSlide,
  totalSlides,
  zoom,
  viewerMode,
  showPresenterNotes,
  isFullScreen,
  presentationStartTime,
  presenterNotes,
  elapsedTime,
  displayCount,
  commentedSlides,
  mockComments,
  userType,
  onSlideChange,
}) => {
  const { thumbnailsHeight, setThumbnailsHeight, getSlideThumbnailsWidth } = useSlideStore();
  const thumbnailsWidth = getSlideThumbnailsWidth();

  return (
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

      {/* Bottom thumbnails with improved resizing */}
      {!(viewerMode === "presentation" && isFullScreen) && (
        <ResizablePanel
          initialWidth={thumbnailsHeight}
          minWidth={100}
          maxWidth={300}
          onWidthChange={setThumbnailsHeight}
          orientation="horizontal"
          resizePosition="top"
          className="border-t border-gray-200 bg-white"
        >
          <SlideThumbnails
            currentSlide={currentSlide}
            onSlideClick={onSlideChange}
            onOpenOverallReview={() => {}}
            height={thumbnailsHeight}
            containerWidth={thumbnailsWidth}
            userType={userType}
          />
        </ResizablePanel>
      )}
    </div>
  );
};
