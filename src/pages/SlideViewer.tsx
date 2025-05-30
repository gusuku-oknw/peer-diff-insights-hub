import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import ResponsiveToolbar from "@/components/slide-viewer/toolbar/ResponsiveToolbar";
import MainLayout from "@/components/slideviewer/layout/MainLayout";
import { useSlideStore } from "@/stores/slide-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSlideViewerLogic } from "@/hooks/slideviewer/useSlideViewerLogic";

// Define commented slides for student progress tracking
const commentedSlides = [1, 2];
const mockComments = [
  { id: 1, text: "とても分かりやすいスライドです！", slideId: 1 },
  { id: 2, text: "この数値の根拠は？", slideId: 3 }
];

const SlideViewer = () => {
  const {
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
    setDisplayCount
  } = useSlideViewerLogic();

  const { setViewerMode } = useSlideStore();

  // Student account initialization
  useEffect(() => {
    console.log('SlideViewer: Initializing for user type:', userType, 'viewerMode:', viewerMode);
    
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

  const isMobile = useIsMobile();
  const totalSlides = slides.length;

  // Ensure userType is properly typed for components
  const typedUserType: "student" | "enterprise" = userType === "student" ? "student" : "enterprise";

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
            userType={typedUserType}
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
          <MainLayout
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
            userType={typedUserType}
            onBranchChange={setCurrentBranch}
            onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
            onSlideChange={(slide: number) => useSlideStore.getState().setCurrentSlide(slide)}
          />
        </div>
      </div>
    </div>
  );
};

export default SlideViewer;
