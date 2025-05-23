
import { useState, useCallback, useEffect, useMemo } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ViewerToolbar from "@/components/slideviewer/ViewerToolbar";
import HistorySidebar from "@/components/slideviewer/HistorySidebar";
import SlideViewerPanel from "@/components/slideviewer/SlideViewerPanel";
import SlideThumbnails from "@/components/slideviewer/SlideThumbnails";
import { CommitHistory } from "@/components/slideviewer/HistorySidebar";
import { useSlideStore } from "@/stores/slideStore";
import { debounce } from "lodash";

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
    setCurrentSlide,
    previousSlide,
    nextSlide,
    setZoom,
    setViewerMode,
    toggleLeftSidebar,
    toggleFullScreen,
    togglePresenterNotes,
    startPresentation,
    setDisplayCount,
    generateThumbnails
  } = useSlideStore();
  
  const totalSlides = slides.length;
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");

  // Generate thumbnails when the page loads
  useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails]);

  // Mock data for branch and commit history
  const [currentBranch, setCurrentBranch] = useState("main");
  const branches = ["main", "feature/new-slides", "hotfix/typo"];
  const commitHistory: CommitHistory[] = [
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

  // Calculate elapsed time during presentations
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (presentationStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - presentationStartTime.getTime();
        
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [presentationStartTime]);

  const handlePreviousSlide = () => {
    if (currentSlide > 1) {
      previousSlide();
    } else {
      toast({
        title: "最初のスライドです",
        description: "これ以上前のスライドはありません。",
        variant: "default"
      });
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < totalSlides) {
      nextSlide();
    } else {
      toast({
        title: "最後のスライドです",
        description: "これ以上次のスライドはありません。",
        variant: "default"
      });
    }
  };

  const handleZoomChange = (newZoom: number) => {
    if (newZoom >= 50 && newZoom <= 200) {
      setZoom(newZoom);
    }
  };

  const toggleFullScreenWithEffects = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      toggleFullScreen();
      
      // プレゼンテーション開始時の処理
      if (!presentationStartTime) {
        startPresentation();
        setViewerMode("presentation");
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        toggleFullScreen();
      }
    }
  }, [presentationStartTime, toggleFullScreen, startPresentation, setViewerMode]);

  // メモ化されたモード切替ハンドラ（デバウンス処理も追加）
  const handleModeChange = useMemo(() => debounce((mode: "presentation" | "edit" | "review") => {
    console.log(`Mode change requested: ${mode}`);
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
  }, 300), [setViewerMode, toast]);

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

  // デバッグ用のログ追加
  console.log("SlideViewer render state:", { 
    showPresenterNotes, 
    viewerMode, 
    isFullScreen,
    rerender: Math.random() // レンダリング追跡用
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Hide navigation when in presentation mode and fullscreen */}
      {!(viewerMode === "presentation" && isFullScreen) && <Navigation />}
      
      {/* Main content area */}
      <div className={`flex-grow flex flex-col ${!(viewerMode === "presentation" && isFullScreen) ? "pt-16 pb-16" : ""} bg-slate-50 h-full`}>
        {/* Hide toolbar when in presentation mode and fullscreen */}
        {!(viewerMode === "presentation" && isFullScreen) && (
          <ViewerToolbar
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
        
        {/* Main content area */}
        <div className={`flex flex-grow overflow-hidden ${!(viewerMode === "presentation" && isFullScreen) ? "h-[calc(100vh-10rem)]" : "h-full"}`}>
          {/* In presentation fullscreen mode, just show the slide viewer panel */}
          {viewerMode === "presentation" && isFullScreen ? (
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
              onSlideChange={setCurrentSlide}
            />
          ) : (
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
                          onBranchChange={setCurrentBranch}
                          onClose={toggleLeftSidebar}
                        />
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
                    </>
                  )}
                  
                  {/* Main slide viewer with improved UI */}
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
                      onSlideChange={setCurrentSlide}
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
                  userType={userProfile?.role === "student" ? "student" : "enterprise"}
                  onSlideSelect={setCurrentSlide}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </div>
      </div>
      {/* Hide footer when in presentation mode and fullscreen */}
      {!(viewerMode === "presentation" && isFullScreen) && <Footer />}
    </div>
  );
};

export default SlideViewer;
