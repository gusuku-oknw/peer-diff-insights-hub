
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChevronLeft, ChevronRight, Eye, List, History, Share, Code, FileText, Maximize, Minimize2, Percent, Calendar, Download, Settings, Tag, GitBranch, GitCommit, GitPullRequest, MessageCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlideCanvas from "@/components/slideviewer/SlideCanvas";
import CommentList from "@/components/slideviewer/CommentList";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SlideViewer = () => {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [viewMode, setViewMode] = useState<"all" | "canvas">("canvas");
  const totalSlides = 5; // This would come from the actual slide data
  const [zoom, setZoom] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [defaultLayout, setDefaultLayout] = useState([30, 70]);
  const [sidebarLayout, setSlidebarLayout] = useState([70, 30]);

  // Mock data for branch and commit history
  const [currentBranch, setCurrentBranch] = useState("main");
  const branches = ["main", "feature/new-slides", "hotfix/typo"];
  const commitHistory = [
    {
      id: "a1b2c3d",
      message: "スライド5を追加",
      author: "田中さん",
      date: "2025年5月22日"
    },
    {
      id: "e4f5g6h",
      message: "グラフのデータを更新",
      author: "佐藤さん",
      date: "2025年5月21日"
    },
    {
      id: "i7j8k9l",
      message: "タイトルのフォント修正",
      author: "鈴木さん",
      date: "2025年5月20日"
    },
    {
      id: "m1n2o3p",
      message: "初回コミット",
      author: "山本さん",
      date: "2025年5月19日"
    }
  ];

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
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navigation />
      
      {/* Main content area with fixed positioning to avoid layout issues */}
      <div className="flex-grow flex flex-col pt-16 pb-16 bg-slate-50 h-full">
        {/* Enhanced top toolbar with improved contrast and visual hierarchy */}
        <div className="bg-white border-b border-gray-200 py-3 shadow-sm flex-shrink-0 z-10">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={leftSidebarOpen ? "secondary" : "ghost"} 
                      size="sm" 
                      onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                      className="flex items-center gap-2 font-medium"
                    >
                      <History className="h-4 w-4" />
                      <span className="hidden sm:inline">{leftSidebarOpen ? "履歴を隠す" : "履歴を表示"}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>コミット履歴と変更の管理</TooltipContent>
                </Tooltip>

                <div className="h-6 border-r border-gray-200 mx-2" />

                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handlePreviousSlide} 
                        disabled={currentSlide === 1}
                        className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>前のスライド</TooltipContent>
                  </Tooltip>
                  
                  <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-100 min-w-[60px] text-center">
                    {currentSlide} / {totalSlides}
                  </span>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleNextSlide} 
                        disabled={currentSlide === totalSlides}
                        className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>次のスライド</TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="h-6 border-r border-gray-200 mx-2" />
                
                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleZoomOut} 
                        variant="ghost" 
                        size="icon"
                        className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50"
                      >
                        <span className="font-medium">-</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>縮小</TooltipContent>
                  </Tooltip>
                  
                  <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-100 min-w-[60px] text-center">
                    {zoom}%
                  </span>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleZoomIn} 
                        variant="ghost" 
                        size="icon"
                        className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50"
                      >
                        <span className="font-medium">+</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>拡大</TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="h-6 border-r border-gray-200 mx-2" />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <MessageCircle className={`h-4 w-4 ${viewMode === "all" ? "text-blue-600" : "text-gray-400"}`} />
                      <Switch 
                        id="comment-mode" 
                        checked={viewMode === "all"}
                        onCheckedChange={checked => setViewMode(checked ? "all" : "canvas")}
                        className="focus-visible:ring-offset-0 data-[state=checked]:bg-blue-600"
                      />
                      <span className="text-sm text-gray-600">{viewMode === "all" ? "コメント表示" : "編集のみ"}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{viewMode === "all" ? "コメントを非表示" : "コメントを表示"}</TooltipContent>
                </Tooltip>
                
                <div className="h-6 border-r border-gray-200 mx-2" />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-700 hover:bg-blue-50">
                      <FileText className="h-4 w-4" />
                      <span className="hidden lg:inline">XML Diff</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>XMLの差分を確認</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleFullScreen}
                      className="flex items-center gap-2 text-gray-700 hover:bg-blue-50"
                    >
                      {isFullScreen ? (
                        <><Minimize2 className="h-4 w-4" /><span className="hidden lg:inline">フルスクリーン終了</span></>
                      ) : (
                        <><Maximize className="h-4 w-4" /><span className="hidden lg:inline">全画面</span></>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFullScreen ? "フルスクリーンを終了" : "フルスクリーンで表示"}</TooltipContent>
                </Tooltip>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                  <Share className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">共有</span>
                </Button>
                <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  コミット
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area with fixed height calculation to ensure all elements are visible */}
        <div className="flex flex-grow overflow-hidden h-[calc(100vh-10rem)]">
          <ResizablePanelGroup 
            direction="vertical" 
            className="h-full w-full" 
            id="slide-layout-vertical"
          >
            {/* Main content panel with explicit sizing */}
            <ResizablePanel 
              defaultSize={80} 
              minSize={50} 
              id="main-content" 
              order={1}
              className="flex-grow"
            >
              <ResizablePanelGroup 
                direction="horizontal" 
                className="h-full" 
                id="slide-layout-horizontal"
              >
                {/* Left sidebar with improved visual design */}
                {leftSidebarOpen && (
                  <>
                    <ResizablePanel 
                      defaultSize={30} 
                      minSize={20} 
                      maxSize={50} 
                      id="history-sidebar" 
                      order={1}
                      className="bg-white border-r border-gray-100 shadow-sm"
                    >
                      <div className="h-full flex flex-col">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                          <h3 className="font-medium flex items-center text-blue-800">
                            <History className="h-4 w-4 mr-2 text-blue-600" />
                            スライド履歴
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLeftSidebarOpen(false)}
                            className="h-7 w-7 p-0 rounded-full hover:bg-gray-200"
                          >
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
                                      className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center transition-colors ${
                                        branch === currentBranch ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''
                                      }`}
                                      onClick={() => setCurrentBranch(branch)}
                                    >
                                      <GitBranch className={`h-4 w-4 mr-2 ${branch === currentBranch ? 'text-blue-500' : 'text-gray-500'}`} />
                                      <span className="text-sm">{branch}</span>
                                      {branch === currentBranch && (
                                        <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                          現在
                                        </span>
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
                                      className={`p-3 border rounded-md hover:bg-gray-50 transition-colors ${
                                        index === 0 ? 'bg-blue-50 border-blue-100' : 'border-gray-200'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                                          index === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {commit.id.substring(0, 7)}
                                        </span>
                                        <span className="text-xs text-gray-500">{commit.date}</span>
                                      </div>
                                      <p className={`text-sm font-medium mb-1 ${index === 0 ? 'text-blue-800' : ''}`}>
                                        {commit.message}
                                      </p>
                                      <div className="flex items-center text-xs text-gray-500">
                                        <span>作成者: {commit.author}</span>
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
                    {/* Slide canvas with better shadows and visual hierarchy */}
                    <ResizablePanel id="slide-canvas" order={1} className="overflow-hidden">
                      <div className="flex-grow flex items-center justify-center h-full p-4 relative bg-gradient-to-br from-slate-50 to-gray-100">
                        <div className="w-4/5 h-full flex items-center justify-center relative">
                          <SlideCanvas currentSlide={currentSlide} zoomLevel={zoom} />
                        </div>
                      </div>
                    </ResizablePanel>
                    
                    {/* Comment sidebar with improved styling */}
                    {viewMode === "all" && (
                      <>
                        <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
                        <ResizablePanel defaultSize={30} minSize={20} id="comment-sidebar" order={2} className="overflow-hidden">
                          <div className="h-full bg-white shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
                              <h3 className="font-medium text-sm flex items-center text-blue-800">
                                <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                                コメント管理
                              </h3>
                            </div>
                            <CommentList currentSlide={currentSlide} />
                          </div>
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            
            {/* Slide thumbnails with consistent height and improved scrolling */}
            <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
            <ResizablePanel 
              defaultSize={20} 
              minSize={15} 
              id="thumbnails" 
              order={2} 
              className="min-h-[180px]"
            >
              <div className="bg-white shadow-sm h-full flex flex-col border-t border-gray-200">
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium flex items-center text-sm text-blue-800">
                    <List className="h-4 w-4 mr-2 text-blue-600" />
                    スライド一覧
                  </h3>
                </div>
                
                <ScrollArea className="flex-grow h-[calc(100%-3rem)]" orientation="horizontal">
                  <div className="p-4 h-full flex items-center">
                    <div className="flex flex-row gap-4">
                      {Array.from({length: totalSlides}).map((_, index) => (
                        <div
                          key={index}
                          className={`border rounded-lg cursor-pointer transition-all duration-200 ${
                            currentSlide === index + 1 
                              ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 shadow-md scale-105' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setCurrentSlide(index + 1)}
                        >
                          <div className="w-36 aspect-video bg-white rounded-t-md flex items-center justify-center overflow-hidden">
                            <img 
                              src={`https://placehold.co/1600x900/e2e8f0/1e293b?text=Slide+${index + 1}`} 
                              alt={`スライド ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="p-3">
                            <p className={`text-sm font-medium truncate w-32 ${
                              currentSlide === index + 1 ? 'text-blue-700' : ''
                            }`}>
                              {index === 0 ? 'Q4 Presentation' : `Slide ${index + 1}`}
                            </p>
                          </div>
                        </div>
                      ))}
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
