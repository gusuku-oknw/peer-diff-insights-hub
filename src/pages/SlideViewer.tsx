
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, MessageSquare, Eye, List } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow pt-24 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              プレゼンテーションレビュー
            </h1>
            <div className="flex items-center gap-2">
              <Tabs 
                value={viewMode} 
                onValueChange={(v) => setViewMode(v as "all" | "canvas")}
                className="mr-4"
              >
                <TabsList>
                  <TabsTrigger value="canvas" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    スライドのみ
                  </TabsTrigger>
                  <TabsTrigger value="all" className="flex items-center gap-1">
                    <List className="h-4 w-4" />
                    スライド＆コメント
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button 
                variant="outline" 
                onClick={handlePreviousSlide}
                disabled={currentSlide === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> 前へ
              </Button>
              <span className="text-sm font-medium mx-2">
                {currentSlide} / {totalSlides}
              </span>
              <Button 
                variant="outline"
                onClick={handleNextSlide}
                disabled={currentSlide === totalSlides}
              >
                次へ <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={viewMode === "canvas" ? "lg:col-span-3" : "lg:col-span-2"}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <SlideCanvas currentSlide={currentSlide} />
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
      </div>
      <Footer />
    </div>
  );
};

export default SlideViewer;
