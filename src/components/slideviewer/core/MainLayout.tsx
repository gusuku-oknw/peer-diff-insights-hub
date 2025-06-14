
import React from "react";
import { useSlideStore } from "@/stores/slide-store";
import { useIsMobile } from "@/hooks/use-mobile";
import LeftSidebar from "../layout/LeftSidebar";
import RightSidebar from "../layout/RightSidebar";
import OptimizedSlideCanvas from "../features/canvas/OptimizedSlideCanvas";
import SlideThumbnails from "../SlideThumbnails";
import FloatingToggleButton from "../layout/FloatingToggleButton";

interface MainLayoutProps {
  // Props from useSlideViewerLogic
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  userType: "student" | "enterprise";
  presentationStartTime: Date | null;
  
  // Props from useResponsiveLayout
  windowDimensions: { width: number; height: number };
  rightPanelWidth: number;
  isRightPanelOpen: boolean;
  contentAreaDimensions: any;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  currentSlide,
  totalSlides,
  presenterNotes,
  userType,
  presentationStartTime,
  windowDimensions,
  rightPanelWidth,
  isRightPanelOpen,
  contentAreaDimensions,
  isMobile: isResponsiveMobile,
}) => {
  const isMobileHook = useIsMobile();
  const isMobile = isMobileHook || isResponsiveMobile;
  
  const {
    leftSidebarOpen,
    viewerMode,
    zoom,
    goToSlide,
    toggleLeftSidebar,
    setRightPanelHidden,
    setZoom,
  } = useSlideStore();

  const canvasWidth = contentAreaDimensions.availableWidth - (isMobile ? 20 : 40);
  const canvasHeight = windowDimensions.height - (isMobile ? 180 : 200);

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar */}
      <LeftSidebar 
        isOpen={leftSidebarOpen}
        onToggle={toggleLeftSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <OptimizedSlideCanvas
            currentSlide={currentSlide}
            zoomLevel={zoom}
            editable={viewerMode === "edit"}
            userType={userType}
            containerWidth={canvasWidth}
            containerHeight={canvasHeight}
            enablePerformanceMode={true}
          />
        </div>

        {/* Thumbnails */}
        <div className="border-t border-gray-200 bg-white">
          <SlideThumbnails
            currentSlide={currentSlide}
            onSlideClick={goToSlide}
            onOpenOverallReview={() => {}}
            height={120}
            containerWidth={contentAreaDimensions.thumbnailsWidth}
            userType={userType}
            showAsPopup={isMobile}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar
        isOpen={isRightPanelOpen}
        width={rightPanelWidth}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
        userType={userType}
        onToggle={() => setRightPanelHidden(!isRightPanelOpen)}
        isMobile={isMobile}
      />

      {/* Floating Toggle Button for Mobile */}
      {isMobile && (
        <FloatingToggleButton
          onToggleLeft={toggleLeftSidebar}
          onToggleRight={() => setRightPanelHidden(!isRightPanelOpen)}
          leftOpen={leftSidebarOpen}
          rightOpen={isRightPanelOpen}
        />
      )}
    </div>
  );
};

export default MainLayout;
