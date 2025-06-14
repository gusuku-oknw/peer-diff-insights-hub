
import React from "react";
import EnhancedSlideDisplay from "../presentation/EnhancedSlideDisplay";
import SlideThumbnails from "../SlideThumbnails";
import MainToolbar from "../toolbar/MainToolbar";
import MobileOptimizedToolbar from "../toolbar/MobileOptimizedToolbar";

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
    <div className="flex-1 flex flex-col min-w-0">
      {/* Toolbar */}
      {isMobile ? (
        <MobileOptimizedToolbar
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          zoom={zoom}
          viewerMode={viewerMode}
          isFullScreen={isFullScreen}
          onPreviousSlide={onPreviousSlide}
          onNextSlide={onNextSlide}
          onZoomIn={() => onZoomChange(Math.min(100, zoom + 10))} // Limited to 100%
          onZoomOut={() => onZoomChange(Math.max(25, zoom - 10))}
          onResetZoom={() => onZoomChange(100)}
          onFullScreenToggle={onFullScreenToggle}
          canZoomIn={zoom < 100} // Limited to 100%
          canZoomOut={zoom > 25}
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

      {/* Enhanced Slide Display */}
      <div className="flex-1 flex items-center justify-center p-4">
        <EnhancedSlideDisplay
          currentSlide={currentSlide}
          zoomLevel={zoom}
          editable={viewerMode === "edit"}
          userType={userType}
          containerWidth={canvasWidth}
          containerHeight={canvasHeight}
          onZoomChange={onZoomChange}
        />
      </div>

      {/* Thumbnails */}
      <div className="border-t border-gray-200 bg-white">
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
