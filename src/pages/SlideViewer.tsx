import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChevronLeft, ChevronRight, MessageSquare, Eye, List, History, Share, Code, FileText, Maximize, Minimize2, Percent, ToggleLeft, ToggleRight, Filter, Calendar, Download, Settings, Tag, GitBranch, GitCommit, GitPullRequest } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlideCanvas from "@/components/slideviewer/SlideCanvas";
import CommentList from "@/components/slideviewer/CommentList";
import { useToast } from "@/hooks/use-toast";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@/components/ui/drawer";

const SlideViewer = () => {
  const {
    toast
  } = useToast();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [viewMode, setViewMode] = useState<"all" | "canvas">("canvas");
  const totalSlides = 5; // This would come from the actual slide data
  const [zoom, setZoom] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [defaultLayout, setDefaultLayout] = useState([20, 60, 20]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Mock data for branch and commit history
  const [currentBranch, setCurrentBranch] = useState("main");
  const branches = ["main", "feature/new-slides", "hotfix/typo"];
  const commitHistory = [{
    id: "a1b2c3d",
    message: "スライド5を追加",
    author: "田中さん",
    date: "2025年5月22日"
  }, {
    id: "e4f5g6h",
    message: "グラフのデータを更新",
    author: "佐藤さん",
    date: "2025年5月21日"
  }, {
    id: "i7j8k9l",
    message: "タイトルのフォント修正",
    author: "鈴木さん",
    date: "2025年5月20日"
  }, {
    id: "m1n2o3p",
    message: "初回コミット",
    author: "山本さん",
    date: "2025年5月19日"
  }];
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
  
  return <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow pt-16 pb-16 bg-gray-100">
        {/* Top toolbar */}
        <div className="bg-white border-b border-gray-200 py-2">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
                  <Button variant="outline" size="sm" onClick={handlePreviousSlide} disabled={currentSlide === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    スライド {currentSlide}/{totalSlides}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleNextSlide} disabled={currentSlide === totalSlides}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
                  <Button onClick={handleZoomOut} variant="ghost" size="sm" className="text-gray-700">-</Button>
                  <span className="text-sm font-medium">{zoom}%</span>
                  <Button onClick={handleZoomIn} variant="ghost" size="sm" className="text-gray-700">+</Button>
                </div>
                
                {/* Comment toggle integrated into toolbar */}
                <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="comment-mode" checked={viewMode === "all"} onCheckedChange={checked => setViewMode(checked ? "all" : "canvas")} />
                    <span className="text-sm font-medium">
                      {viewMode === "all" ? <><MessageSquare className="h-4 w-4 inline mr-1" />コメント表示</> : <><Eye className="h-4 w-4 inline mr-1" />スライドのみ</>}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    XML Diff
                  </Button>
                  <Button variant="ghost" size="sm" onClick={toggleFullScreen}>
                    {isFullScreen ? <><Minimize2 className="h-4 w-4 mr-1" /> フルスクリーン終了</> : <><Maximize className="h-4 w-4 mr-1" /> 全画面</>}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm" className="bg-blue-100 hover:bg-blue-200 text-blue-700">
                  <History className="h-4 w-4 mr-1" />
                  履歴
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-1" />
                  共有
                </Button>
                <Button variant="secondary" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  コミット
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Left sidebar - slide thumbnails and branch/commit info */}
          <div className="flex flex-col h-[60vh]">
            {/* Centered slide canvas */}
            <div className="flex-grow flex items-center justify-center bg-white">
              <div className="w-4/5 h-full">
                <SlideCanvas currentSlide={currentSlide} zoomLevel={zoom} />
              </div>
            </div>
            
            {/* Bottom drawer for slide thumbnails */}
            <div className="bg-white border-t border-gray-200">
              <div className="flex justify-between items-center p-2 border-b border-gray-200">
                <h3 className="font-medium flex items-center text-sm">
                  <List className="h-4 w-4 mr-2" />
                  スライド一覧
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  className="text-sm flex items-center"
                >
                  {drawerOpen ? "閉じる" : "開く"}
                  <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${drawerOpen ? "rotate-90" : ""}`} />
                </Button>
              </div>
              
              {drawerOpen && (
                <div className="h-[20vh] overflow-y-auto">
                  <Tabs defaultValue="slides">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="slides" className="text-xs">
                        <List className="h-4 w-4 mr-1" />
                        スライド
                      </TabsTrigger>
                      <TabsTrigger value="branches" className="text-xs">
                        <GitBranch className="h-4 w-4 mr-1" />
                        ブランチ
                      </TabsTrigger>
                      <TabsTrigger value="commits" className="text-xs">
                        <GitCommit className="h-4 w-4 mr-1" />
                        コミット
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="slides" className="p-0">
                      <ScrollArea className="h-[15vh]">
                        <div className="p-2 space-y-2">
                          <div className="flex flex-row gap-2 flex-wrap">
                            {Array.from({length: totalSlides}).map((_, index) => (
                              <div 
                                key={index} 
                                className={`p-2 border rounded-lg cursor-pointer hover:bg-gray-100 ${currentSlide === index + 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} 
                                onClick={() => setCurrentSlide(index + 1)}
                              >
                                <div className="w-28 aspect-video bg-gray-200 rounded flex items-center justify-center mb-1">
                                  <span className="text-xs text-gray-500">スライド {index + 1}</span>
                                </div>
                                <p className="text-xs truncate w-28">
                                  {index === 0 ? 'Q4 Presentation' : `Slide ${index + 1}`}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="branches" className="p-0">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-medium flex items-center">
                          <GitBranch className="h-4 w-4 mr-2" />
                          現在のブランチ: <span className="ml-1 font-bold text-blue-600">{currentBranch}</span>
                        </h3>
                      </div>
                      <ScrollArea className="h-[10vh]">
                        <div className="p-2 space-y-1">
                          {branches.map(branch => (
                            <div 
                              key={branch} 
                              className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center ${branch === currentBranch ? 'bg-blue-50 text-blue-700' : ''}`} 
                              onClick={() => setCurrentBranch(branch)}
                            >
                              <GitBranch className="h-4 w-4 mr-2" />
                              <span className="text-sm">{branch}</span>
                              {branch === currentBranch && <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                  現在
                                </span>}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="commits" className="p-0">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-medium flex items-center">
                          <GitCommit className="h-4 w-4 mr-2" />
                          スライドのコミット履歴
                        </h3>
                      </div>
                      <ScrollArea className="h-[10vh]">
                        <div className="p-2 space-y-2">
                          {commitHistory.map(commit => (
                            <div key={commit.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{commit.id.substring(0, 7)}</span>
                                <span className="text-xs text-gray-500">{commit.date}</span>
                              </div>
                              <p className="text-sm font-medium mb-1">{commit.message}</p>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default SlideViewer;
