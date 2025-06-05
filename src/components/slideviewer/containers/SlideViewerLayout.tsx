
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import ResponsiveToolbar from "../toolbar/ResponsiveToolbar";
import MainContainer from "../layout/MainContainer";
import { useSlideStore } from "@/stores/slide-store";
import type { ViewerMode } from "@/types/slide.types";

interface SlideViewerLayoutProps {
  // From useSlideViewerLogic
  currentSlideNumber: number;
  userType: "student" | "enterprise";
  zoom: number;
  viewerMode: ViewerMode;
  showPresenterNotes: boolean;
  presentationStartTime: number | null;
  displayCount: number;
  slides: any[];
  leftSidebarOpen: boolean;
  isFullScreen: boolean;
  currentBranch: string;
  branches: string[];
  commitHistory: any[];
  presenterNotes: Record<number, string>;
  elapsedTimeInSeconds: number;
  handlePreviousSlide: () => void;
  handleNextSlide: () => void;
  handleZoomChange: (zoom: number) => void;
  handleModeChange: (mode: ViewerMode) => void;
  handleSaveChanges: () => void;
  handleStartPresentation: () => void;
  setCurrentBranch: (branch: string) => void;
  setLeftSidebarOpen: (open: boolean) => void;
  generateThumbnails: () => void;
  setDisplayCount: (count: number) => void;
  
  // From useResponsiveLayout
  windowDimensions: { width: number; height: number };
  rightPanelWidth: number;
  isRightPanelOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const SlideViewerLayout: React.FC<SlideViewerLayoutProps> = ({
  currentSlideNumber,
  userType,
  zoom,
  viewerMode,
  showPresenterNotes,
  presentationStartTime,
  displayCount,
  slides,
  leftSidebarOpen,
  isFullScreen,
  currentBranch,
  branches,
  commitHistory,
  presenterNotes,
  elapsedTimeInSeconds,
  handlePreviousSlide,
  handleNextSlide,
  handleZoomChange,
  handleModeChange,
  handleSaveChanges,
  handleStartPresentation,
  setCurrentBranch,
  setLeftSidebarOpen,
  generateThumbnails,
  setDisplayCount,
  windowDimensions,
  rightPanelWidth,
  isRightPanelOpen,
  isMobile,
  isTablet,
  isDesktop,
}) => {
  const [isOverallReviewPanelOpen, setIsOverallReviewPanelOpen] = useState(false);
  const { setViewerMode } = useSlideStore();

  // Student account initialization
  useEffect(() => {
    console.log('SlideViewerLayout: Initializing for user type:', userType, 'viewerMode:', viewerMode);
    
    if (userType === "student" && (viewerMode === "edit" || viewerMode === "presentation")) {
      console.log("Student detected in non-review mode, switching to review");
      setViewerMode("review");
    }
    
    if (userType === "student" && !viewerMode) {
      console.log("Setting default mode for student to review");
      setViewerMode("review");
    }
  }, [userType, viewerMode, setViewerMode]);

  // Generate thumbnails when the page loads
  useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails]);

  // Detect number of displays
  useEffect(() => {
    const checkDisplays = () => {
      if (window.screen && 'availWidth' in window.screen) {
        const estimatedDisplays = Math.round(window.screen.width / window.screen.availWidth) || 1;
        setDisplayCount(Math.max(1, estimatedDisplays));
      }
    };
    
    checkDisplays();
    
    if (typeof window !== 'undefined' && 'screen' in window && 'orientation' in window) {
      window.addEventListener('resize', checkDisplays);
    }
    
    return () => {
      if (typeof window !== 'undefined' && 'screen' in window && 'orientation' in window) {
        window.removeEventListener('resize', checkDisplays);
      }
    };
  }, [setDisplayCount]);

  const totalSlides = slides.length;
  const commentedSlides = [1, 2];
  const mockComments = [
    { id: 1, text: "とても分かりやすいスライドです！", slideId: 1 },
    { id: 2, text: "この数値の根拠は？", slideId: 3 }
  ];

  const handleOpenOverallReview = () => {
    console.log('Opening overall review panel');
    setIsOverallReviewPanelOpen(true);
  };

  const handleCloseOverallReview = () => {
    console.log('Closing overall review panel');
    setIsOverallReviewPanelOpen(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {!(viewerMode === "presentation" && isFullScreen) && <Navigation />}
      
      <div className={`flex-grow flex flex-col ${!(viewerMode === "presentation" && isFullScreen) ? "pt-16" : ""} bg-slate-50 h-full`}>
        {!(viewerMode === "presentation" && isFullScreen) && (
          <ResponsiveToolbar
            currentSlide={currentSlideNumber}
            totalSlides={totalSlides}
            zoom={zoom}
            viewerMode={viewerMode}
            isFullScreen={isFullScreen}
            leftSidebarOpen={leftSidebarOpen}
            showPresenterNotes={showPresenterNotes}
            presentationStartTime={presentationStartTime}
            displayCount={displayCount}
            userType={userType}
            onPreviousSlide={handlePreviousSlide}
            onNextSlide={handleNextSlide}
            onZoomChange={handleZoomChange}
            onModeChange={handleModeChange}
            onLeftSidebarToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
            onFullScreenToggle={() => {}}
            onShowPresenterNotesToggle={() => {}}
            onStartPresentation={handleStartPresentation}
            onSaveChanges={handleSaveChanges}
          />
        )}
        
        <div className={`flex flex-grow overflow-hidden ${!(viewerMode === "presentation" && isFullScreen) ? "h-[calc(100vh-4rem)]" : "h-full"}`}>
          <MainContainer
            currentBranch={currentBranch}
            branches={branches}
            commitHistory={commitHistory}
            currentSlide={currentSlideNumber}
            totalSlides={totalSlides}
            zoom={zoom}
            viewerMode={viewerMode}
            leftSidebarOpen={leftSidebarOpen}
            showPresenterNotes={showPresenterNotes}
            isFullScreen={isFullScreen}
            presentationStartTime={presentationStartTime ? new Date(presentationStartTime) : null}
            presenterNotes={presenterNotes}
            elapsedTime={elapsedTimeInSeconds}
            displayCount={displayCount}
            commentedSlides={commentedSlides}
            mockComments={mockComments}
            userType={userType}
            onBranchChange={setCurrentBranch}
            onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
            onSlideChange={(slide: number) => useSlideStore.getState().setCurrentSlide(slide)}
            onOpenOverallReview={handleOpenOverallReview}
            isOverallReviewPanelOpen={isOverallReviewPanelOpen}
            onCloseOverallReview={handleCloseOverallReview}
          />
        </div>
      </div>
    </div>
  );
};

export default SlideViewerLayout;
