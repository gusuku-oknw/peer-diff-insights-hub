import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SimpleMainToolbar from "@/components/slide-viewer/toolbar/SimpleMainToolbar";
import MainLayout from "@/components/slide-viewer/layout/MainLayout";
import { useSlideStore } from "@/stores/slide-store";
import useSlideNavigation from "@/hooks/slideviewer/useSlideNavigation";
import usePresentationMode from "@/hooks/slideviewer/usePresentationMode";
import { useIsMobile } from "@/hooks/use-mobile";

// Define commented slides for student progress tracking
const commentedSlides = [1, 2]; // Slides where the current student has already commented
const mockComments = [
  { id: 1, text: "とても分かりやすいスライドです！", slideId: 1 },
  { id: 2, text: "この数値の根拠は？", slideId: 3 }
];

const SlideViewer = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  
  // Use the unified slide store
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
  
  // Ensure currentSlide is always a number
  const currentSlideNumber = typeof currentSlide === 'string' ? parseInt(currentSlide, 10) : currentSlide;
  
  // Determine user type from profile
  const userType = userProfile?.role === "student" ? "student" : "enterprise";
  
  // 学生アカウントの初期化改善
  useEffect(() => {
    console.log('SlideViewer: Initializing for user type:', userType, 'viewerMode:', viewerMode);
    
    // 学生が編集モードにいる場合はプレゼンテーションモードに切り替え
    if (userType === "student" && viewerMode === "edit") {
      console.log("Student detected in edit mode, switching to presentation");
      setViewerMode("presentation");
    }
    
    // 学生でviewerModeが未定義の場合はデフォルトをプレゼンテーションに
    if (userType === "student" && !viewerMode) {
      console.log("Setting default mode for student to presentation");
      setViewerMode("presentation");
    }
  }, [userType, viewerMode, setViewerMode]);
  
  // デバッグ用ログ
  useEffect(() => {
    console.log('SlideViewer state:', {
      slides: slides.length,
      currentSlide: currentSlideNumber,
      userType,
      viewerMode,
      showPresenterNotes,
      leftSidebarOpen
    });
  }, [slides, currentSlideNumber, userType, viewerMode, showPresenterNotes, leftSidebarOpen]);
  
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

  const handleZoomChange = (newZoom: number) => {
    if (newZoom >= 50 && newZoom <= 200) {
      setZoom(newZoom);
    }
  };

  // モード切替をデバウンスなしで即時適用するように変更
  const handleModeChange = (mode: "presentation" | "edit" | "review") => {
    console.log(`Mode change requested: ${mode} (current: ${viewerMode})`);
    
    // Students cannot access edit mode
    if (mode === "edit" && userType === "student") {
      toast({
        title: "権限がありません",
        description: "学生ユーザーは編集モードを利用できません",
        variant: "destructive"
      });
      return;
    }
    
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
    if (userType === "student") {
      toast({
        title: "権限がありません",
        description: "学生ユーザーは変更を保存できません",
        variant: "destructive"
      });
      return;
    }
    
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

  const isMobile = useIsMobile();

  // Convert elapsedTime string to number (in seconds) for MainLayout
  const elapsedTimeInSeconds = useMemo(() => {
    if (typeof elapsedTime === 'string') {
      const [minutes, seconds] = elapsedTime.split(':').map(Number);
      return minutes * 60 + seconds;
    }
    return 0;
  }, [elapsedTime]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Hide navigation when in presentation mode and fullscreen */}
      {!(viewerMode === "presentation" && isFullScreen) && <Navigation />}
      
      {/* Main content area */}
      <div className={`flex-grow flex flex-col ${!(viewerMode === "presentation" && isFullScreen) ? "pt-16 pb-16" : ""} bg-slate-50 h-full`}>
        {/* Hide toolbar when in presentation mode and fullscreen */}
        {!(viewerMode === "presentation" && isFullScreen) && (
          <SimpleMainToolbar
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
            onToggleLeftSidebar={toggleLeftSidebar}
            onSlideChange={(slide: number) => useSlideStore.getState().setCurrentSlide(slide)}
          />
        </div>
      </div>
      {/* Hide footer when in presentation mode and fullscreen */}
      {!(viewerMode === "presentation" && isFullScreen) && <Footer />}
    </div>
  );
};

export default SlideViewer;
