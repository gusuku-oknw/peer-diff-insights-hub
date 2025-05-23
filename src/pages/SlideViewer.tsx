import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChevronLeft, ChevronRight, Eye, Pencil, MessageCircle, Layout, 
  Share, Play, Code, FileText, Maximize, Minimize2, History, Calendar,
  GitBranch, GitCommit, Download, Settings, Save, Filter, Book, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlideCanvas from "@/components/slideviewer/SlideCanvas";
import CommentList from "@/components/slideviewer/CommentList";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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
  const [defaultLayout, setDefaultLayout] = useState([30, 70]);
  const [sidebarLayout, setSlidebarLayout] = useState([70, 30]);
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

  // コミット履歴に基づくレビュー状態の取得
  const getCurrentCommitReviewStatus = () => {
    const currentCommit = commitHistory[0];
    return currentCommit?.reviewStatus || "none";
  };

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

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 10);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 10);
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

  // Mode-specific UI elements
  const renderModeSpecificUI = () => {
    switch (viewerMode) {
      case "edit":
        return (
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <span className="hidden lg:inline">テンプレート</span>
            </Button>
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        );
      case "review":
        return (
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden lg:inline">フィルター</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => toast({
                title: "フィードバックが送信されました",
                description: "レビュー担当者にフィードバックが送信されました。",
                variant: "default"
              })}
            >
              フィードバック送信
            </Button>
          </div>
        );
      case "notes":
        return (
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setShowPresenterNotes(!showPresenterNotes)}>
              <Book className="h-4 w-4" />
              <span className="hidden lg:inline">発表者メモ {showPresenterNotes ? '非表示' : '表示'}</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleStartPresentation}
            >
              <Play className="h-4 w-4 mr-2" />
              プレゼン開始（全画面）
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navigation />
      
      {/* Main content area */}
      <div className="flex-grow flex flex-col pt-16 pb-16 bg-slate-50 h-full">
        {/* Enhanced top toolbar with view mode switching */}
        <div className="bg-white border-b border-gray-200 py-3 shadow-sm flex-shrink-0 z-10">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mode switcher tabs */}
                <Tabs 
                  defaultValue={viewerMode} 
                  value={viewerMode} 
                  className="w-auto" 
                  onValueChange={(value) => handleModeChange(value as ViewerMode)}
                >
                  <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger 
                      value="notes" 
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      <Book className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">メモ・台本</span>
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="edit" 
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">編集</span>
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="review" 
                      className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">レビュー</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="h-6 border-r border-gray-200 mx-2" />

                {/* Primary controls - always visible */}
                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handlePreviousSlide} disabled={currentSlide === 1} className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50">
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>前のスライド (←)</TooltipContent>
                  </Tooltip>
                  
                  <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-100 min-w-[60px] text-center">
                    {currentSlide} / {totalSlides}
                  </span>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleNextSlide} disabled={currentSlide === totalSlides} className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>次のスライド (→)</TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="h-6 border-r border-gray-200 mx-2" />
                
                {/* Zoom controls - simplified with dropdown for more options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <span className="text-sm font-medium">{zoom}%</span>
                      <ChevronRight className="h-4 w-4 rotate-90" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>ズーム設定</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setZoom(50)}>
                      50%
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setZoom(75)}>
                      75%
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setZoom(100)}>
                      100% (デフォルト)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setZoom(125)}>
                      125%
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setZoom(150)}>
                      150%
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setZoom(200)}>
                      200%
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button onClick={handleZoomOut} variant="ghost" size="icon" className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50">
                  <span className="font-medium">-</span>
                </Button>
                
                <Button onClick={handleZoomIn} variant="ghost" size="icon" className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50">
                  <span className="font-medium">+</span>
                </Button>
                
                {/* User type switch for demo purposes */}
                <div className="h-6 border-r border-gray-200 mx-2" />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleUserType}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-medium">
                    {userType === "student" ? "学生" : "企業"} UI
                  </span>
                  <Badge variant="secondary" className={userType === "student" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                    {userType === "student" ? "学生" : "企業"}
                  </Badge>
                </Button>
                
                {/* Secondary tools dropdown (advanced features) */}
                <div className="h-6 border-r border-gray-200 mx-2" />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="hidden md:inline">詳細ツール</span>
                      <ChevronRight className="h-4 w-4 rotate-90" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}>
                      <History className="h-4 w-4 mr-2" />
                      {leftSidebarOpen ? "履歴を隠す" : "履歴を表示"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Code className="h-4 w-4 mr-2" />
                      XML Diffビュー
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      エクスポート
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={toggleFullScreen}>
                      {isFullScreen ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
                      {isFullScreen ? "全画面終了" : "全画面表示"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center">
                {/* Mode-specific controls on the right */}
                {renderModeSpecificUI()}
                
                {/* Share button always available */}
                <Button variant="outline" size="sm" className="ml-3 hidden sm:flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                  <Share className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">共有</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
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
                      <div className="h-full flex flex-col">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                          <h3 className="font-medium flex items-center text-blue-800">
                            <History className="h-4 w-4 mr-2 text-blue-600" />
                            スライド履歴
                          </h3>
                          <Button variant="ghost" size="sm" onClick={() => setLeftSidebarOpen(false)} className="h-7 w-7 p-0 rounded-full hover:bg-gray-200">
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex-grow overflow-hidden">
                          <Tabs defaultValue="branches" className="h-full flex flex-col">
                            <TabsList className="w-full grid grid-cols-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
                              <TabsTrigger value="branches" className="text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                <GitBranch className="h-4 w-4 mr-1" />
                                ブランチ
                              </TabsTrigger>
                              <TabsTrigger value="commits" className="text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                <GitCommit className="h-4 w-4 mr-1" />
                                コミット
                              </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="branches" className="flex-grow overflow-hidden">
                              <div className="p-4 border-b border-gray-100">
                                <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                                  <h4 className="text-sm font-medium flex items-center text-blue-800">
                                    <GitBranch className="h-4 w-4 mr-2 text-blue-600" />
                                    現在のブランチ
                                  </h4>
                                  <p className="mt-1 font-bold text-blue-700">{currentBranch}</p>
                                </div>
                              </div>
                              <ScrollArea className="flex-grow h-[calc(100%-5rem)]" orientation="vertical">
                                <div className="p-3 space-y-1">
                                  {branches.map(branch => (
                                    <div 
                                      key={branch} 
                                      className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center transition-colors ${branch === currentBranch ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''}`} 
                                      onClick={() => setCurrentBranch(branch)}
                                    >
                                      <GitBranch className={`h-4 w-4 mr-2 ${branch === currentBranch ? 'text-blue-500' : 'text-gray-500'}`} />
                                      <span className="text-sm">{branch}</span>
                                      {branch === currentBranch && (
                                        <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                          現在
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </TabsContent>
                            
                            <TabsContent value="commits" className="flex-grow overflow-hidden">
                              <div className="p-4 border-b border-gray-100">
                                <h4 className="text-sm font-medium flex items-center text-blue-800">
                                  <GitCommit className="h-4 w-4 mr-2 text-blue-600" />
                                  コミット履歴
                                </h4>
                              </div>
                              <ScrollArea className="flex-grow h-[calc(100%-5rem)]" orientation="vertical">
                                <div className="p-3 space-y-2">
                                  {commitHistory.map((commit, index) => (
                                    <div 
                                      key={commit.id} 
                                      className={`p-3 border rounded-md hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-blue-50 border-blue-100' : 'border-gray-200'}`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${index === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                          {commit.id.substring(0, 7)}
                                        </span>
                                        <span className="text-xs text-gray-500">{commit.date}</span>
                                      </div>
                                      <p className={`text-sm font-medium mb-1 ${index === 0 ? 'text-blue-800' : ''}`}>
                                        {commit.message}
                                      </p>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">作成者: {commit.author}</span>
                                        <Badge 
                                          variant="secondary" 
                                          className={
                                            commit.reviewStatus === "approved" 
                                              ? "bg-green-100 text-green-800" 
                                              : commit.reviewStatus === "reviewing" 
                                                ? "bg-amber-100 text-amber-800" 
                                                : "bg-gray-100 text-gray-800"
                                          }
                                        >
                                          {
                                            commit.reviewStatus === "approved" 
                                              ? "レビュー済" 
                                              : commit.reviewStatus === "reviewing" 
                                                ? "レビュー中" 
                                                : "未レビュー"
                                          }
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </ResizablePanel>
                    
                    <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
                  </>
                )}
                
                {/* Main slide viewer with improved UI */}
                <ResizablePanel id="slide-viewer" order={2} className="bg-slate-100">
                  <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* Slide canvas */}
                    <ResizablePanel id="slide-canvas" order={1} className="overflow-hidden">
                      <div className={`flex-grow flex items-center justify-center h-full p-4 relative ${viewerMode === "notes" && isFullScreen ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 to-gray-100"}`}>
                        <div className={`w-4/5 h-full flex items-center justify-center relative ${viewerMode === "notes" && isFullScreen ? "w-full max-w-none" : ""}`}>
                          {/* プレゼン時間表示（フルスクリーン時のみ） */}
                          {isFullScreen && presentationStartTime && (
                            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full flex items-center space-x-2 z-30">
                              <Clock className="h-4 w-4" />
                              <span>{elapsedTime}</span>
                            </div>
                          )}
                          
                          <SlideCanvas 
                            currentSlide={currentSlide} 
                            zoomLevel={zoom} 
                            editable={viewerMode === "edit"}
                            userType={userType}
                          />
                        </div>
                      </div>
                    </ResizablePanel>
                    
                    {/* Notes sidebar (conditionally displayed) */}
                    {showPresenterNotes && viewerMode === "notes" && (
                      <>
                        <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
                        <ResizablePanel defaultSize={30} minSize={20} id="notes-sidebar" order={2} className="overflow-hidden">
                          <div className="h-full bg-white shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
                              <h3 className="font-medium text-sm flex items-center text-blue-800">
                                <Book className="h-4 w-4 mr-2 text-blue-600" />
                                発表者メモ
                              </h3>
                            </div>
                            <div className="p-4">
                              <div className="p-3 rounded-lg border border-blue-100 bg-blue-50 mb-4">
                                <p className="text-sm font-medium text-blue-900">スライド {currentSlide}</p>
                              </div>
                              
                              <p className="text-sm leading-relaxed">
                                {presenterNotes[currentSlide as keyof typeof presenterNotes] || "このスライドにはメモがありません"}
                              </p>
                              
                              <div className="mt-6 pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">次のスライド:</h4>
                                {currentSlide < totalSlides ? (
                                  <>
                                    <p className="text-xs text-gray-500 mb-2">スライド {currentSlide + 1}</p>
                                    <p className="text-xs text-gray-600 italic">
                                      {presenterNotes[(currentSlide + 1) as keyof typeof presenterNotes]?.substring(0, 100)}...
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-xs text-gray-500">最終スライドです</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </ResizablePanel>
                      </>
                    )}
                    
                    {/* Comment sidebar */}
                    {viewerMode === "review" && (
                      <>
                        <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
                        <ResizablePanel defaultSize={30} minSize={20} id="comment-sidebar" order={2} className="overflow-hidden">
                          <div className="h-full bg-white shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-200 bg-purple-50">
                              <h3 className="font-medium text-sm flex items-center text-purple-800">
                                <MessageCircle className="h-4 w-4 mr-2 text-purple-600" />
                                コメント管理
                              </h3>
                            </div>
                            <CommentList currentSlide={currentSlide} />
                          </div>
                        </ResizablePanel>
                      </>
                    )}
                    
                    {/* AI要約パネル（企業ユーザーのみ） */}
                    {userType === "enterprise" && viewerMode === "review" && (
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            className="absolute top-4 right-4 z-20 bg-purple-600 hover:bg-purple-700 text-white"
                            size="sm"
                          >
                            AI要約
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px]">
                          <SheetHeader>
                            <SheetTitle>AI要約</SheetTitle>
                            <SheetDescription>
                              すべてのコメントの要約と傾向分析
                            </SheetDescription>
                          </SheetHeader>
                          <div className="py-4">
                            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                              <h4 className="font-medium text-purple-900 mb-2">要点まとめ</h4>
                              <p className="text-sm text-purple-800">
                                このスライドに対する主なフィードバックはタイトルの表現と図表のわかりやすさについてです。特に、タイトルをより具体的にすること、図表の数値表現の改善が提案されています。
                              </p>
                            </div>
                            
                            <h4 className="font-medium text-gray-900 mb-2">カテゴリ分布</h4>
                            <div className="flex mb-6">
                              <div className="flex-1 text-center p-2">
                                <div className="inline-block w-3 h-3 rounded-full bg-blue-500 mb-1"></div>
                                <p className="text-xs">内容</p>
                                <p className="font-bold">50%</p>
                              </div>
                              <div className="flex-1 text-center p-2">
                                <div className="inline-block w-3 h-3 rounded-full bg-purple-500 mb-1"></div>
                                <p className="text-xs">デザイン</p>
                                <p className="font-bold">50%</p>
                              </div>
                              <div className="flex-1 text-center p-2">
                                <div className="inline-block w-3 h-3 rounded-full bg-green-500 mb-1"></div>
                                <p className="text-xs">誤字・脱字</p>
                                <p className="font-bold">0%</p>
                              </div>
                            </div>
                            
                            <h4 className="font-medium text-gray-900 mb-2">キーワード</h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                              <Badge className="bg-gray-100 text-gray-800">タイトル</Badge>
                              <Badge className="bg-gray-100 text-gray-800">表現</Badge>
                              <Badge className="bg-gray-100 text-gray-800">図表</Badge>
                              <Badge className="bg-gray-100 text-gray-800">数値</Badge>
                              <Badge className="bg-gray-100 text-gray-800">わかりにくい</Badge>
                            </div>
                            
                            <h4 className="font-medium text-gray-900 mb-2">感情分析</h4>
                            <div className="p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">非常にネガティブ</span>
                                <span className="text-xs text-gray-500">非常にポジティブ</span>
                              </div>
                              <div className="mt-1 h-2 w-full bg-gray-200 rounded-full">
                                <div className="h-2 bg-amber-400 rounded-full" style={{width: "45%"}}></div>
                              </div>
                              <p className="text-center text-xs mt-2 text-gray-600">
                                中立的なフィードバック
                              </p>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            
            {/* Slide thumbnails */}
            <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
            <ResizablePanel defaultSize={20} minSize={15} id="thumbnails" order={2} className="min-h-[180px]">
              <div className="bg-white shadow-sm h-full flex flex-col border-t border-gray-200">
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium flex items-center text-sm text-blue-800">
                    スライド一覧
                  </h3>
                </div>
                
                <ScrollArea className="flex-grow h-[calc(100%-3rem)]" orientation="horizontal">
                  <div className="p-4 h-full flex items-center">
                    <div className="flex flex-row gap-4">
                      {Array.from({length: totalSlides}).map((_, index) => {
                        const slideIndex = index + 1;
                        const hasComments = (mockComments[slideIndex] || []).length > 0;
                        const needsComment = userType === "student" && !commentedSlides?.includes(slideIndex);
                        
                        return (
                          <div 
                            key={index} 
                            className={`border rounded-lg cursor-pointer transition-all duration-200 ${
                              currentSlide === slideIndex 
                                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 shadow-md scale-105' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            } relative`} 
                            onClick={() => setCurrentSlide(slideIndex)}
                          >
                            <div className="w-36 aspect-video bg-white rounded-t-md flex items-center justify-center overflow-hidden">
                              <img 
                                src={`https://placehold.co/1600x900/e2e8f0/1e293b?text=Slide+${slideIndex}`} 
                                alt={`スライド ${slideIndex}`} 
                                className="object-cover w-full h-full" 
                              />
                            </div>
                            <div className="p-3">
                              <p className={`text-sm font-medium truncate w-32 ${currentSlide === slideIndex ? 'text-blue-700' : ''}`}>
                                {slideIndex === 1 ? 'Q4 Presentation' : `Slide ${slideIndex}`}
                              </p>
                            </div>
                            
                            {/* コメント数バッジ */}
                            {hasComments && (
                              <div className="absolute top-1 right-1 bg-purple-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                {(mockComments[slideIndex] || []).length}
                              </div>
                            )}
                            
                            {/* 学生向け：未コメントバッジ */}
                            {needsComment && (
                              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs border-2 border-white">
                                !
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SlideViewer;
