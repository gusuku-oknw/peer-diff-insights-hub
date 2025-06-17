
import React from "react";
import UnifiedSlideCanvas from "../canvas/UnifiedSlideCanvas";
import SlideThumbnails from "../thumbnails/SlideThumbnails";
import MainToolbar from "../toolbar/MainToolbar";
import ResponsiveToolbar from "../toolbar/ResponsiveToolbar";

interface MainContentAreaProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: "presentation" | "edit" | "review";
  isFullScreen: boolean;
  showPresenterNotes: boolean;
  presentationStartTimeNumber: number | null;
  displayCount: number;
  userType: "student" | "enterprise";
  canvasWidth: number;
  canvasHeight: number;
  contentAreaDimensions: any;
  isMobile: boolean;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onZoomChange: (zoom: number) => void;
  onModeChange: (mode: "presentation" | "edit" | "review") => void;
  onFullScreenToggle: () => void;
  onShowPresenterNotesToggle: () => void;
  onStartPresentation: () => void;
  onSaveChanges: () => void;
  onSlideClick: (slideIndex: number) => void;
}

const MainContentArea: React.FC<MainContentAreaProps> = ({
  currentSlide,
  totalSlides,
  zoom,
  viewerMode,
  isFullScreen,
  showPresenterNotes,
  presentationStartTimeNumber,
  displayCount,
  userType,
  canvasWidth,
  canvasHeight,
  contentAreaDimensions,
  isMobile,
  onPreviousSlide,
  onNextSlide,
  onZoomChange,
  onModeChange,
  onFullScreenToggle,
  onShowPresenterNotesToggle,
  onStartPresentation,
  onSaveChanges,
  onSlideClick,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="flex-shrink-0">
        {isMobile ? (
          <ResponsiveToolbar
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            zoom={zoom}
            viewerMode={viewerMode}
            isFullScreen={isFullScreen}
            showPresenterNotes={showPresenterNotes}
            presentationStartTime={presentationStartTimeNumber}
            displayCount={displayCount}
            userType={userType}
            onPreviousSlide={onPreviousSlide}
            onNextSlide={onNextSlide}
            onZoomChange={onZoomChange}
            onModeChange={onModeChange}
            onFullScreenToggle={onFullScreenToggle}
            onShowPresenterNotesToggle={onShowPresenterNotesToggle}
            onStartPresentation={onStartPresentation}
            onSaveChanges={onSaveChanges}
          />
        ) : (
          <MainToolbar
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            zoom={zoom}
            viewerMode={viewerMode}
            isFullScreen={isFullScreen}
            showPresenterNotes={showPresenterNotes}
            presentationStartTime={presentationStartTimeNumber}
            displayCount={displayCount}
            userType={userType}
            onPreviousSlide={onPreviousSlide}
            onNextSlide={onNextSlide}
            onZoomChange={onZoomChange}
            onModeChange={onModeChange}
            onFullScreenToggle={onFullScreenToggle}
            onShowPresenterNotesToggle={onShowPresenterNotesToggle}
            onStartPresentation={onStartPresentation}
            onSaveChanges={onSaveChanges}
          />
        )}
      </div>

      {/* Slide Canvas */}
      <div className="flex-1 overflow-hidden p-4">
        <UnifiedSlideCanvas
          currentSlide={currentSlide}
          zoomLevel={zoom}
          editable={viewerMode === "edit"}
          userType={userType}
          containerWidth={canvasWidth}
          containerHeight={canvasHeight}
          enablePerformanceMode={true}
          onZoomChange={onZoomChange}
        />
      </div>

      {/* Thumbnails */}
      <div className="border-t border-gray-200 bg-white flex-shrink-0 h-[120px] overflow-hidden">
        <SlideThumbnails
          currentSlide={currentSlide}
          onSlideClick={onSlideClick}
          onOpenOverallReview={() => {}}
          height={120}
          containerWidth={contentAreaDimensions.thumbnailsWidth}
          userType={userType}
          showAsPopup={isMobile}
        />
      </div>
    </div>
  );
};

export default MainContentArea;
