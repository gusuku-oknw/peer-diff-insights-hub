
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Eye, 
  List, 
  History, 
  Share,
  Code, 
  FileText,
  Maximize,
  Minimize2,
  Percent,
  ToggleLeft,
  ToggleRight,
  Filter,
  Calendar,
  Download,
  Settings,
  Tag
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlideCanvas from "@/components/slideviewer/SlideCanvas";
import CommentList from "@/components/slideviewer/CommentList";
import { useToast } from "@/hooks/use-toast";

const SlideViewer = () => {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [viewMode, setViewMode] = useState<"all" | "canvas">("canvas");
  const totalSlides = 5; // This would come from the actual slide data
  const [zoom, setZoom] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [defaultLayout, setDefaultLayout] = useState([20, 60, 20]);

  const handlePreviousSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    } else {
      toast({
        title: "最初のスライドです",
        description: "これ以上前のスライドはありません。",
        variant: "default",
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
        variant: "default",
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
      document.documentElement.requestFullscreen().catch((e) => {
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
      <div className="flex-grow pt-16 pb-16 bg-gray-100">
        {/* Top toolbar */}
        <div className="bg-white border-b border-gray-200 py-2">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePreviousSlide}
                    disabled={currentSlide === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    スライド {currentSlide}/{totalSlides}
                  </span>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleNextSlide}
                    disabled={currentSlide === totalSlides}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button onClick={handleZoomOut} variant="ghost" size="sm" className="text-gray-700">-</Button>
                  <span className="text-sm font-medium">{zoom}%</span>
                  <Button onClick={handleZoomIn} variant="ghost" size="sm" className="text-gray-700">+</Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    XML Diff
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={toggleFullScreen}
                  >
                    {isFullScreen ? (
                      <><Minimize2 className="h-4 w-4 mr-1" /> フルスクリーン終了</>
                    ) : (
                      <><Maximize className="h-4 w-4 mr-1" /> 全画面</>
                    )}
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
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[70vh] rounded-lg border"
            onLayout={(sizes) => {
              setDefaultLayout(sizes);
            }}
          >
            {/* Left sidebar - slide thumbnails */}
            <ResizablePanel defaultSize={defaultLayout[0]} minSize={15} maxSize={30} className="bg-white">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium">スライド</h3>
              </div>
              <ScrollArea className="h-[70vh]">
                <div className="p-2 space-y-2">
                  {Array.from({length: totalSlides}).map((_, index) => (
                    <div 
                      key={index} 
                      className={`p-2 border rounded-lg cursor-pointer hover:bg-gray-100 ${currentSlide === index + 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setCurrentSlide(index + 1)}
                    >
                      <div className="aspect-video bg-gray-200 rounded flex items-center justify-center mb-1">
                        <span className="text-xs text-gray-500">スライド {index + 1}</span>
                      </div>
                      <p className="text-xs truncate">
                        {index === 0 ? 'Q4 Presentation' : `Slide ${index + 1}`}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Main content area */}
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={40}>
              <div className="bg-white h-full">
                <SlideCanvas currentSlide={currentSlide} zoomLevel={zoom} />
              </div>
            </ResizablePanel>
            
            {rightSidebarOpen && (
              <>
                <ResizableHandle withHandle />
                {/* Right sidebar - Additional content */}
                <ResizablePanel defaultSize={defaultLayout[2]} minSize={15} maxSize={30} className="bg-white">
                  <Tabs defaultValue="comments">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="comments" className="text-xs">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        コメント
                      </TabsTrigger>
                      <TabsTrigger value="metadata" className="text-xs">
                        <Tag className="h-4 w-4 mr-1" />
                        メタデータ
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="text-xs">
                        <Settings className="h-4 w-4 mr-1" />
                        設定
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="comments" className="h-[65vh] overflow-auto">
                      <CommentList slideId={currentSlide} />
                    </TabsContent>
                    <TabsContent value="metadata" className="h-[65vh] p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold mb-2">スライド情報</h3>
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">作成日:</span>
                              <span>2025年5月15日</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">最終更新:</span>
                              <span>2025年5月22日</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">作成者:</span>
                              <span>佐藤太郎</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2">タグ</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">プレゼンテーション</span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">四半期報告</span>
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">財務</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="settings" className="h-[65vh] p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold mb-2">表示設定</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">高コントラストモード</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">グリッド表示</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">自動再生</span>
                              <Switch />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
        
        {/* Comment view toggle switch */}
        <div className="fixed right-4 top-24">
          <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="comment-mode"
                checked={viewMode === "all"}
                onCheckedChange={(checked) => setViewMode(checked ? "all" : "canvas")}
              />
              <span className="text-sm font-medium">
                {viewMode === "all" ? (
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                ) : (
                  <Eye className="h-4 w-4 inline mr-1" />
                )}
                <span className="hidden lg:inline">
                  {viewMode === "all" ? "コメント表示" : "スライドのみ"}
                </span>
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            >
              {rightSidebarOpen ? (
                <><ChevronRight className="h-4 w-4" /> サイドバー</>
              ) : (
                <><ChevronLeft className="h-4 w-4" /> サイドバー</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideViewer;
