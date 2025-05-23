import { useEffect, useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import FabricSlideCanvas from "@/components/slideviewer/FabricSlideCanvas";
import SlideNotesPanel from "@/components/slideviewer/SlideNotesPanel";
import CommentList from "@/components/slideviewer/CommentList";
import AIReviewSummary from "@/components/slideviewer/AIReviewSummary";
import { useAuth } from "@/contexts/AuthContext";
import { useSlideStore } from "@/stores/slideStore";
import EditToolbar from "@/components/slideviewer/editor/EditToolbar";
import EditSidebar from "@/components/slideviewer/editor/EditSidebar";

interface SlideViewerPanelProps {
  currentSlide: number;
  zoom: number;
  viewerMode: "presentation" | "edit" | "review";
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: Date | null;
  presenterNotes: Record<number, string>;
  totalSlides: number;
  elapsedTime: string;
  displayCount: number;
  onSlideChange?: (slideNum: number) => void;
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
  onSlideChange
}: SlideViewerPanelProps) => {
  const { userProfile } = useAuth();
  const [editSidebarOpen, setEditSidebarOpen] = useState(true);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullScreen) return;
      
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        if (onSlideChange && currentSlide < totalSlides) {
          onSlideChange(currentSlide + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (onSlideChange && currentSlide > 1) {
          onSlideChange(currentSlide - 1);
        }
      } else if (e.key === 'Home') {
        if (onSlideChange) {
          onSlideChange(1);
        }
      } else if (e.key === 'End') {
        if (onSlideChange) {
          onSlideChange(totalSlides);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, totalSlides, isFullScreen, onSlideChange]);
  
  const toggleEditSidebar = () => {
    setEditSidebarOpen(prev => !prev);
  };
  
  // If in full screen presentation mode, show a different layout
  if (viewerMode === "presentation" && isFullScreen) {
    // For dual display setup with presenter notes
    if (displayCount >= 2 && showPresenterNotes) {
      return (
        <div className="flex h-full">
          <div className="w-3/5 h-full flex items-center justify-center bg-gray-900 relative">
            {/* Timer */}
            {presentationStartTime && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full flex items-center space-x-2 z-30">
                <Clock className="h-4 w-4" />
                <span>{elapsedTime}</span>
              </div>
            )}
            
            <FabricSlideCanvas 
              currentSlide={currentSlide} 
              zoomLevel={zoom} 
              editable={false}
              userType={userProfile?.role === "student" ? "student" : "enterprise"}
            />
          </div>
          
          <div className="w-2/5 h-full overflow-auto">
            <SlideNotesPanel 
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
            />
          </div>
        </div>
      );
    }
    
    // For single display setup (no presenter notes)
    return (
      <div className="flex h-full items-center justify-center bg-gray-900 relative">
        {/* Timer */}
        {presentationStartTime && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full flex items-center space-x-2 z-30">
            <Clock className="h-4 w-4" />
            <span>{elapsedTime}</span>
          </div>
        )}
        
        <FabricSlideCanvas 
          currentSlide={currentSlide} 
          zoomLevel={zoom} 
          editable={false}
          userType={userProfile?.role === "student" ? "student" : "enterprise"}
        />
      </div>
    );
  }

  // Edit mode with enhanced UI
  if (viewerMode === "edit") {
    return (
      <div className="h-full flex flex-col">
        {/* Edit toolbar */}
        <EditToolbar currentSlide={currentSlide} toggleSidebar={toggleEditSidebar} />
        
        {/* Main content */}
        <div className="flex-grow flex">
          {/* Edit sidebar - conditional rendering */}
          {editSidebarOpen && (
            <div className="w-64 border-r border-gray-200 bg-white">
              <EditSidebar currentSlide={currentSlide} />
            </div>
          )}
          
          {/* Canvas area */}
          <div className="flex-grow bg-gray-50 p-4">
            <div className="h-full flex items-center justify-center">
              <FabricSlideCanvas 
                currentSlide={currentSlide} 
                zoomLevel={zoom} 
                editable={true} 
                userType={userProfile?.role === "student" ? "student" : "enterprise"}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default layout (review mode or non-fullscreen presentation mode)
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Slide canvas */}
      <ResizablePanel id="slide-canvas" order={1} className="overflow-hidden">
        <div className="flex-grow flex items-center justify-center h-full p-4 relative bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="w-4/5 h-full flex items-center justify-center relative">
            <FabricSlideCanvas 
              currentSlide={currentSlide} 
              zoomLevel={zoom} 
              editable={viewerMode === "edit"}
              userType={userProfile?.role === "student" ? "student" : "enterprise"}
            />
          </div>
        </div>
      </ResizablePanel>
      
      {/* Notes sidebar (conditionally displayed) */}
      {showPresenterNotes && viewerMode === "presentation" && (
        <>
          <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
          <ResizablePanel defaultSize={30} minSize={20} id="notes-sidebar" order={2} className="overflow-hidden">
            <SlideNotesPanel 
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
            />
          </ResizablePanel>
        </>
      )}
      
      {/* Comment sidebar - use explicit viewerMode check instead of comparing with "edit" */}
      {viewerMode === "review" && (
        <>
          <ResizableHandle withHandle className="bg-blue-100 hover:bg-blue-200 transition-colors" />
          <ResizablePanel defaultSize={30} minSize={20} id="comment-sidebar" order={2} className="overflow-hidden">
            <div className="h-full bg-white shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-purple-50">
                <h3 className="font-medium text-sm flex items-center text-purple-800">
                  コメント管理
                </h3>
              </div>
              <CommentList currentSlide={currentSlide} />
            </div>
          </ResizablePanel>
        </>
      )}
      
      {/* AI要約パネル（企業ユーザーのみ） */}
      {userProfile?.role !== "student" && viewerMode === "review" && (
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
            <AIReviewSummary slideId={currentSlide} />
          </SheetContent>
        </Sheet>
      )}
    </ResizablePanelGroup>
  );
};

export default SlideViewerPanel;
