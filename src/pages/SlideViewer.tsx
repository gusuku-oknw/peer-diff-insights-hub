
import { useState, useCallback, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ViewerToolbar from "@/components/slideviewer/ViewerToolbar";
import HistorySidebar from "@/components/slideviewer/HistorySidebar";
import SlideViewerPanel from "@/components/slideviewer/SlideViewerPanel";
import SlideThumbnails from "@/components/slideviewer/SlideThumbnails";

// Define the viewer modes
type ViewerMode = "notes" | "edit" | "review";

// Define the user types
type UserType = "student" | "enterprise";

// Define mock comments data
const mockComments = {
  1: [
    { id: 1, author: "Student #2", text: "タイトルがもう少し具体的だと良いかも", position: { x: 120, y: 80 }, status: "pending" },
    { id: 2, author: "Student #5", text: "このグラフの数値がわかりにくいです", position: { x: 320, y: 220 }, status: "in-progress" }
  ],
  2: [
    { id: 3, author: "Student #1", text: "このスライドの背景色を変えた方が読みやすいです", position: { x: 200, y: 150 }, status: "completed" }
  ],
  4: [
    { id: 4, author: "Student #3", text: "このデータの出典情報を追加した方が良いです", position: { x: 280, y: 190 }, status: "pending" }
  ]
};

// Define commented slides for student progress tracking
const commentedSlides = [1, 2]; // Slides where the current student has already commented

const SlideViewer = () => {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showComments, setShowComments] = useState(false);
  const totalSlides = 5; // This would come from the actual slide data
  const [zoom, setZoom] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);
  
  // New state for viewer mode (renamed from 'presentation' to 'notes')
  const [viewerMode, setViewerMode] = useState<ViewerMode>("review");
  
  // User type (student or enterprise)
  const [userType, setUserType] = useState<UserType>("enterprise");

  // Mock data for branch and commit history
  const [currentBranch, setCurrentBranch] = useState("main");
  const branches = ["main", "feature/new-slides", "hotfix/typo"];
  const commitHistory = [
    { id: "a1b2c3d", message: "スライド5を追加", author: "田中さん", date: "2025年5月22日", reviewStatus: "reviewing" },
    { id: "e4f5g6h", message: "グラフのデータを更新", author: "佐藤さん", date: "2025年5月21日", reviewStatus: "approved" },
    { id: "i7j8k9l", message: "タイトルのフォント修正", author: "鈴木さん", date: "2025年5月20日", reviewStatus: "approved" },
    { id: "m1n2o3p", message: "初回コミット", author: "山本さん", date: "2025年5月19日", reviewStatus: "approved" }
  ];

  // Mock presenter notes
  const presenterNotes = {
    1: "このスライドでは、Q4の業績についての概要を説明します。市場予測よりも20%増の売上を記録したことを強調しましょう。",
    2: "会社概要では、特に海外展開の強化について触れてください。アジア市場での成長率が前年比40%であることを強調。",
    3: "財務結果では、営業利益率が業界平均を上回っていることにフォーカスしてください。昨年比で5ポイント改善。",
    4: "将来戦略では、新製品開発のロードマップと市場投入時期について詳しく説明してください。特に第2四半期の新製品に注目。",
    5: "質疑応答セクションでは、投資家から予想される質問への回答をあらかじめ準備しておきます。特に配当政策について。"
  };

  // プレゼンテーション開始時間
  const [presentationStartTime, setPresentationStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");

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
      setCurrentSlide(currentSlide - 1);
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
      setCurrentSlide(currentSlide + 1);
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

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      setIsFullScreen(true);
      
      // プレゼンテーション開始時の処理
      if (!presentationStartTime) {
        setPresentationStartTime(new Date());
        setViewerMode("notes");
        setShowPresenterNotes(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, [presentationStartTime]);

  // Handle mode change with visual feedback
  const handleModeChange = (mode: ViewerMode) => {
    setViewerMode(mode);
    
    // Automatically show comments in review mode
    if (mode === "review") {
      setShowComments(true);
    } else if (mode === "notes") {
      setShowComments(false);
    }
    
    toast({
      title: mode === "notes" 
        ? "メモ・台本モードに切り替えました" 
        : mode === "edit" 
          ? "編集モードに切り替えました" 
          : "レビューモードに切り替えました",
      description: mode === "notes" 
        ? "発表用のメモを確認できます" 
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
    toggleFullScreen();
    
    toast({
      title: "プレゼンテーションが開始されました",
      description: "ESCキーで終了、矢印キーでスライド移動ができます",
      variant: "default"
    });
  };

  // Toggle user type for demonstration
  const toggleUserType = () => {
    setUserType(userType === "student" ? "enterprise" : "student");
    
    toast({
      title: `${userType === "student" ? "企業" : "学生"}ユーザーモードに切り替えました`,
      description: "UIが変更されました",
      variant: "default"
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navigation />
      
      {/* Main content area */}
      <div className="flex-grow flex flex-col pt-16 pb-16 bg-slate-50 h-full">
        {/* Enhanced top toolbar with view mode switching */}
        <ViewerToolbar
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          zoom={zoom}
          viewerMode={viewerMode}
          userType={userType}
          isFullScreen={isFullScreen}
          leftSidebarOpen={leftSidebarOpen}
          showPresenterNotes={showPresenterNotes}
          presentationStartTime={presentationStartTime}
          onPreviousSlide={handlePreviousSlide}
          onNextSlide={handleNextSlide}
          onZoomChange={handleZoomChange}
          onModeChange={handleModeChange}
          onUserTypeToggle={toggleUserType}
          onLeftSidebarToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onFullScreenToggle={toggleFullScreen}
          onShowPresenterNotesToggle={() => setShowPresenterNotes(!showPresenterNotes)}
          onStartPresentation={handleStartPresentation}
          onSaveChanges={handleSaveChanges}
        />
        
        {/* Main content area */}
        <div className="flex flex-grow overflow-hidden h-[calc(100vh-10rem)]">
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
                        onClose={() => setLeftSidebarOpen(false)}
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
                    userType={userType}
                    showPresenterNotes={showPresenterNotes}
                    isFullScreen={isFullScreen}
                    presentationStartTime={presentationStartTime}
                    presenterNotes={presenterNotes}
                    totalSlides={totalSlides}
                    elapsedTime={elapsedTime}
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
                onSlideSelect={setCurrentSlide}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SlideViewer;
