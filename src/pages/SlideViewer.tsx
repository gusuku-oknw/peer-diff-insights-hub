
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow flex flex-col pt-16 pb-16 bg-gray-100">
        {/* トップツールバー - 改良されたUI */}
        <div className="bg-white border-b border-gray-200 py-3 shadow-sm flex-shrink-0">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                      className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
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
                        className="rounded-full h-8 w-8 flex items-center justify-center"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>前のスライド</TooltipContent>
                  </Tooltip>
                  
                  <span className="text-sm font-medium bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                    {currentSlide}/{totalSlides}
                  </span>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleNextSlide} 
                        disabled={currentSlide === totalSlides}
                        className="rounded-full h-8 w-8 flex items-center justify-center"
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
                        className="rounded-full h-8 w-8 flex items-center justify-center"
                      >
                        <span className="font-medium">-</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>縮小</TooltipContent>
                  </Tooltip>
                  
                  <span className="text-sm font-medium bg-gray-50 px-3 py-1 rounded-md border border-gray-200 min-w-[60px] text-center">
                    {zoom}%
                  </span>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleZoomIn} 
                        variant="ghost" 
                        size="icon"
                        className="rounded-full h-8 w-8 flex items-center justify-center"
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
                      <MessageCircle className={`h-4 w-4 ${viewMode === "all" ? "text-blue-500" : "text-gray-400"}`} />
                      <Switch 
                        id="comment-mode" 
                        checked={viewMode === "all"}
                        onCheckedChange={checked => setViewMode(checked ? "all" : "canvas")}
                        className="focus-visible:ring-offset-0"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{viewMode === "all" ? "コメントを非表示" : "コメントを表示"}</TooltipContent>
                </Tooltip>
                
                <div className="h-6 border-r border-gray-200 mx-2" />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-700">
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
                      className="flex items-center gap-2 text-gray-700"
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
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  <span>共有</span>
                </Button>
                <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  コミット
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* メインコンテンツエリア - 高さを調整 */}
        <div className="flex-grow flex flex-col overflow-hidden">
          {/* メインコンテンツとスライド一覧のパネル - 高さを適切に設定 */}
          <ResizablePanelGroup direction="vertical" className="h-full">
            {/* メインコンテンツパネル */}
            <ResizablePanel defaultSize={80} minSize={50}>
              <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* 左サイドバー（ブランチ・コミット履歴） */}
                {leftSidebarOpen && (
                  <>
                    <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                      <div className="h-full bg-white shadow-sm rounded-r-lg">
                        <div className="h-full flex flex-col">
                          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-medium flex items-center">
                              <History className="h-4 w-4 mr-2" />
                              スライド履歴
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setLeftSidebarOpen(false)}
                              className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex-grow">
                            <Tabs defaultValue="branches" className="h-full flex flex-col">
                              <TabsList className="w-full grid grid-cols-2 px-4 py-2 bg-gray-50">
                                <TabsTrigger value="branches" className="text-sm">
                                  <GitBranch className="h-4 w-4 mr-1" />
                                  ブランチ
                                </TabsTrigger>
                                <TabsTrigger value="commits" className="text-sm">
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
                                <ScrollArea className="flex-grow" orientation="vertical">
                                  <div className="p-3 space-y-1">
                                    {branches.map(branch => (
                                      <div
                                        key={branch}
                                        className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center ${
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
                                  <h4 className="text-sm font-medium flex items-center">
                                    <GitCommit className="h-4 w-4 mr-2 text-gray-600" />
                                    コミット履歴
                                  </h4>
                                </div>
                                <ScrollArea className="flex-grow" orientation="vertical">
                                  <div className="p-3 space-y-2">
                                    {commitHistory.map((commit, index) => (
                                      <div 
                                        key={commit.id} 
                                        className={`p-3 border rounded-md hover:bg-gray-50 ${
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
                      </div>
                    </ResizablePanel>
                    
                    <ResizableHandle withHandle className="bg-gray-200" />
                  </>
                )}
                
                {/* メインスライドビューワー */}
                <ResizablePanel>
                  <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* スライドキャンバス */}
                    <ResizablePanel>
                      <div className="flex-grow flex items-center justify-center bg-gray-50 h-full p-4 relative">
                        <div className="w-4/5 h-full flex items-center justify-center">
                          <SlideCanvas currentSlide={currentSlide} zoomLevel={zoom} />
                        </div>
                      </div>
                    </ResizablePanel>
                    
                    {/* コメントサイドバー */}
                    {viewMode === "all" && (
                      <>
                        <ResizableHandle withHandle className="bg-gray-200" />
                        <ResizablePanel defaultSize={30} minSize={20}>
                          <div className="h-full bg-white shadow-sm rounded-l-lg">
                            <div className="px-4 py-3 border-b border-gray-200">
                              <h3 className="font-medium text-sm flex items-center">
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
            
            {/* スライドサムネイル一覧 - 下部 */}
            <ResizableHandle withHandle className="bg-gray-300" />
            <ResizablePanel defaultSize={20} minSize={15} className="flex-shrink-0">
              <div className="bg-white shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 flex-shrink-0">
                  <h3 className="font-medium flex items-center text-sm">
                    <List className="h-4 w-4 mr-2" />
                    スライド一覧
                  </h3>
                </div>
                
                <ScrollArea className="flex-grow" orientation="horizontal">
                  <div className="p-3 h-full flex items-center">
                    <div className="flex flex-row gap-3">
                      {Array.from({length: totalSlides}).map((_, index) => (
                        <div
                          key={index}
                          className={`border rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                            currentSlide === index + 1 ? 'border-blue-500 bg-blue-50 shadow-sm scale-105' : 'border-gray-200'
                          }`}
                          onClick={() => setCurrentSlide(index + 1)}
                        >
                          <div className="w-32 aspect-video bg-white rounded-t-md flex items-center justify-center overflow-hidden">
                            <img 
                              src={`https://placehold.co/1600x900/e2e8f0/1e293b?text=Slide+${index + 1}`} 
                              alt={`スライド ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="p-2">
                            <p className="text-xs font-medium truncate w-28">
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
