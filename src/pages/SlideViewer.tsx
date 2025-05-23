import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Percent,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
                  <Button variant="ghost" size="sm">
                    <Maximize className="h-4 w-4 mr-1" />
                    全画面
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
          <div className="flex space-x-4">
            {/* Left sidebar - slide thumbnails */}
            <div className="hidden lg:block w-56 bg-white rounded-lg shadow-lg overflow-hidden">
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
            </div>
            
            {/* Main content area */}
            <div className="flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className={viewMode === "canvas" ? "lg:col-span-3" : "lg:col-span-2"}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <SlideCanvas currentSlide={currentSlide} zoomLevel={zoom} />
                  </div>
                </div>
                
                {viewMode === "all" && (
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg h-full">
                      <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-lg flex items-center gap-1">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          コメント一覧
                        </h2>
                        <span className="text-sm text-gray-500">スライド {currentSlide}</span>
                      </div>
                      <ScrollArea className="h-[600px]">
                        <CommentList slideId={currentSlide} />
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right sidebar - toggle switch */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideViewer;
