
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MainToolbar from "@/components/slideviewer/toolbars/MainToolbar";
import MainLayout from "@/components/slideviewer/layout/MainLayout";
import { useSlideStore } from "@/stores/slideStore";
import useSlideNavigation from "@/hooks/slideviewer/useSlideNavigation";
import usePresentationMode from "@/hooks/slideviewer/usePresentationMode";

// Define commented slides for student progress tracking
const commentedSlides = [1, 2]; // Slides where the current student has already commented
const mockComments = {
  1: [{ id: 1, text: "とても分かりやすいスライドです！" }],
  3: [{ id: 2, text: "この数値の根拠は？" }]
};

const SlideViewer = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  
  // Use Zustand store for state management
  const { 
    currentSlide, 
    zoom, 
    viewerMode, 
    isFullScreen,
    leftSidebarOpen,
    showPresenterNotes,
    presentationStartTime,
    displayCount,
    slides,
    setZoom,
    setViewerMode,
    toggleLeftSidebar,
    togglePresenterNotes,
    generateThumbnails,
    setDisplayCount
  } = useSlideStore();
  
  const { elapsedTime, toggleFullScreenWithEffects } = usePresentationMode();
  const { handlePreviousSlide, handleNextSlide } = useSlideNavigation({
    totalSlides: slides.length
  });
  
  const totalSlides = slides.length;

  // Generate thumbnails when the page loads
  useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails]);

  // Mock data for branch and commit history
  const [currentBranch, setCurrentBranch] = useState("main");
  const branches = ["main", "feature/new-slides", "hotfix/typo"];
  const commitHistory = [
    { id: "a1b2c3d", message: "スライド5を追加", author: "田中さん", date: "2025年5月22日", reviewStatus: "reviewing" },
    { id: "e4f5g6h", message: "グラフのデータを更新", author: "佐藤さん", date: "2025年5月21日", reviewStatus: "approved" },
    { id: "i7j8k9l", message: "タイトルのフォント修正", author: "鈴木さん", date: "2025年5月20日", reviewStatus: "approved" },
    { id: "m1n2o3p", message: "初回コミット", author: "山本さん", date: "2025年5月19日", reviewStatus: "approved" }
  ];

  // Mock presenter notes from our slides data
  const presenterNotes = useMemo(() => {
    return Object.fromEntries(
      slides.map(slide => [slide.id, slide.notes])
    );
  }, [slides]);

  // Detect number of displays
  useEffect(() => {
    const checkDisplays = () => {
      if (window.screen && 'availWidth' in window.screen) {
        // This is a rough estimate - assuming displays with similar resolutions
        const estimatedDisplays = Math.round(window.screen.width / window.screen.availWidth) || 1;
        setDisplayCount(Math.max(1, estimatedDisplays));
      }
    };
    
    checkDisplays();
    
    // Try to use the Screen API if available
    if (typeof window !== 'undefined' && 'screen' in window && 'orientation' in window) {
      window.addEventListener('resize', checkDisplays);
    }
    
    return () => {
      if (typeof window !== 'undefined' && 'screen' in window && 'orientation' in window) {
        window.removeEventListener('resize', checkDisplays);
      }
    };
  }, [setDisplayCount]);

  const handleZoomChange = (newZoom: number) => {
    if (newZoom >= 50 && newZoom <= 200) {
      setZoom(newZoom);
    }
  };

  // モード切替をデバウンスなしで即時適用するように変更
  const handleModeChange = (mode: "presentation" | "edit" | "review") => {
    console.log(`Mode change requested: ${mode} (current: ${viewerMode})`);
    
    // 同じモードの場合はスキップ
    if (mode === viewerMode) {
      console.log("Same mode selected, skipping update");
      return;
    }
    
    setViewerMode(mode);
    
    toast({
      title: mode === "presentation" 
        ? "プレゼンテーションモードに切り替えました" 
        : mode === "edit" 
          ? "編集モードに切り替えました" 
          : "レビューモードに切り替えました",
      description: mode === "presentation" 
        ? "発表用のプレゼンテーションを準備できます" 
        : mode === "edit" 
          ? "スライドの編集が可能になります"
          : "コメントやフィードバックに集中できます",
    });
  };

  // Save changes functionality
  const handleSaveChanges = () => {
    toast({
      title: "変更が保存されました",
      description: "すべての変更が正常に保存されました。",
      variant: "default"
    });
  };

  // Start presentation
  const handleStartPresentation = () => {
    toggleFullScreenWithEffects();
    
    toast({
      title: "プレゼンテーションが開始されました",
      description: "ESCキーで終了、矢印キーでスライド移動ができます",
      variant: "default"
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Hide navigation when in presentation mode and fullscreen */}
      {!(viewerMode === "presentation" && isFullScreen) && <Navigation />}
      
      {/* Main content area */}
      <div className={`flex-grow flex flex-col ${!(viewerMode === "presentation" && isFullScreen) ? "pt-16 pb-16" : ""} bg-slate-50 h-full`}>
        {/* Hide toolbar when in presentation mode and fullscreen */}
        {!(viewerMode === "presentation" && isFullScreen) && (
          <MainToolbar
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            zoom={zoom}
            viewerMode={viewerMode}
            isFullScreen={isFullScreen}
            leftSidebarOpen={leftSidebarOpen}
            showPresenterNotes={showPresenterNotes}
            presentationStartTime={presentationStartTime}
            displayCount={displayCount}
            onPreviousSlide={handlePreviousSlide}
            onNextSlide={handleNextSlide}
            onZoomChange={handleZoomChange}
            onModeChange={handleModeChange}
            onLeftSidebarToggle={toggleLeftSidebar}
            onFullScreenToggle={toggleFullScreenWithEffects}
            onShowPresenterNotesToggle={togglePresenterNotes}
            onStartPresentation={handleStartPresentation}
            onSaveChanges={handleSaveChanges}
          />
        )}
        
        {/* Main content area with responsive layout */}
        <div className={`flex flex-grow overflow-hidden ${!(viewerMode === "presentation" && isFullScreen) ? "h-[calc(100vh-10rem)]" : "h-full"}`}>
          <MainLayout
            currentBranch={currentBranch}
            branches={branches}
            commitHistory={commitHistory}
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            zoom={zoom}
            viewerMode={viewerMode}
            leftSidebarOpen={leftSidebarOpen}
            showPresenterNotes={showPresenterNotes}
            isFullScreen={isFullScreen}
            presentationStartTime={presentationStartTime}
            presenterNotes={presenterNotes}
            elapsedTime={elapsedTime}
            displayCount={displayCount}
            commentedSlides={commentedSlides}
            mockComments={mockComments}
            userType={userProfile?.role === "student" ? "student" : "enterprise"}
            onBranchChange={setCurrentBranch}
            onToggleLeftSidebar={toggleLeftSidebar}
            onSlideChange={currentSlide => useSlideStore.getState().setCurrentSlide(currentSlide)}
          />
        </div>
      </div>
      {/* Hide footer when in presentation mode and fullscreen */}
      {!(viewerMode === "presentation" && isFullScreen) && <Footer />}
    </div>
  );
};

export default SlideViewer;
