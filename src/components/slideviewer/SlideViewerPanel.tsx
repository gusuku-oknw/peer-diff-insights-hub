
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import SlideNotesPanel from "@/components/slideviewer/SlideNotesPanel";
import { useToast } from "@/hooks/use-toast";
import FabricSlideCanvas from "@/components/slideviewer/FabricSlideCanvas";
import EditToolbar from "@/components/slideviewer/editor/EditToolbar";
import EditSidebar from "@/components/slideviewer/editor/EditSidebar";
import { useSlideStore } from "@/stores/slideStore";
import type { ViewerMode } from "@/stores/slideStore";

interface SlideViewerPanelProps {
  currentSlide: number;
  zoom: number;
  viewerMode: ViewerMode;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: Date | null;
  presenterNotes: Record<number, string>;
  totalSlides: number;
  elapsedTime: string;
  displayCount: number;
  onSlideChange: (slide: number) => void;
}

const SlideViewerPanel = ({
  currentSlide,
  zoom,
  viewerMode,
  showPresenterNotes,
  isFullScreen,
  presentationStartTime,
  presenterNotes,
  totalSlides,
  elapsedTime,
  displayCount,
  onSlideChange,
}: SlideViewerPanelProps) => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDragTip, setShowDragTip] = useState(true);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keys if we're in presentation mode or fullscreen
      if (viewerMode !== "presentation" && !isFullScreen) return;
      
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
        if (currentSlide < totalSlides) {
          onSlideChange(currentSlide + 1);
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        if (currentSlide > 1) {
          onSlideChange(currentSlide - 1);
        }
      } else if (e.key === "Home") {
        onSlideChange(1);
      } else if (e.key === "End") {
        onSlideChange(totalSlides);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, totalSlides, onSlideChange, viewerMode, isFullScreen]);
  
  // Dismiss drag tip after a few seconds
  useEffect(() => {
    if (showDragTip) {
      const timer = setTimeout(() => {
        setShowDragTip(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showDragTip]);

  // Get slide position text
  const slidePosition = `${currentSlide} / ${totalSlides}`;
  
  // メモ化したハンドラー
  const handlePrevious = useCallback(() => {
    if (currentSlide > 1) {
      onSlideChange(currentSlide - 1);
    } else {
      toast({
        title: "最初のスライドです",
        description: "これ以上前のスライドはありません。",
      });
    }
  }, [currentSlide, onSlideChange, toast]);
  
  const handleNext = useCallback(() => {
    if (currentSlide < totalSlides) {
      onSlideChange(currentSlide + 1);
    } else {
      toast({
        title: "最後のスライドです",
        description: "これ以上次のスライドはありません。",
      });
    }
  }, [currentSlide, totalSlides, onSlideChange, toast]);
  
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="flex h-full">
      {/* Edit sidebar (visible only in edit mode) */}
      {viewerMode === "edit" && sidebarOpen && (
        <div className="w-72 h-full overflow-hidden border-r border-gray-200 bg-white">
          <EditSidebar currentSlide={currentSlide} />
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Edit toolbar (visible only in edit mode) */}
        {viewerMode === "edit" && (
          <EditToolbar currentSlide={currentSlide} toggleSidebar={toggleSidebar} />
        )}
        
        {/* Slide content - DOM構造をシンプル化 */}
        <div className="flex flex-1 relative overflow-hidden">
          <div className="flex-1 flex items-center justify-center bg-slate-100 h-full">
            {/* キャンバスコンポーネントを配置 - スケーリングはフックで一元管理 */}
            <FabricSlideCanvas
              currentSlide={currentSlide}
              zoomLevel={zoom}
              editable={viewerMode === "edit"}
            />
            
            {/* Navigation controls in presentation mode */}
            {viewerMode === "presentation" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full bg-black/10 hover:bg-black/20 text-white"
                  onClick={handlePrevious}
                  disabled={currentSlide <= 1}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full bg-black/10 hover:bg-black/20 text-white"
                  onClick={handleNext}
                  disabled={currentSlide >= totalSlides}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                
                {isFullScreen && (
                  <div className="absolute bottom-4 right-4 text-sm text-gray-700 bg-white/80 px-3 py-1 rounded-full flex items-center">
                    <span className="mr-2">{slidePosition}</span>
                    {presentationStartTime && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{elapsedTime}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            {/* Drag tip when in edit mode */}
            {viewerMode === "edit" && showDragTip && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium opacity-90">
                要素を選択してドラッグできます
              </div>
            )}
          </div>
          
          {/* Presenter notes panel */}
          {showPresenterNotes && displayCount >= 2 && (
            <div className="w-80 h-full bg-gray-50 border-l border-gray-200 overflow-hidden">
              <SlideNotesPanel 
                currentSlide={currentSlide}
                totalSlides={totalSlides}
                presenterNotes={presenterNotes}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideViewerPanel;
