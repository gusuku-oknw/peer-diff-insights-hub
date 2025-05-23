
import React, { useState, useEffect } from "react";
import SlideCanvas from "@/components/slideviewer/canvas/SlideCanvas";
import EditToolbar from "@/components/slideviewer/editor/EditToolbar";
import EditSidebar from "@/components/slideviewer/editor/EditSidebar";
import PresentationControls from "@/components/slideviewer/panel/PresentationControls";
import SidePanel from "@/components/slideviewer/panels/SidePanel";
import useSlideNavigation from "@/hooks/slideviewer/useSlideNavigation";
import type { ViewerMode } from "@/stores/slideStore";

interface SlideViewerPanelProps {
  currentSlide: number;
  zoom: number;
  viewerMode: ViewerMode;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: number | null;
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDragTip, setShowDragTip] = useState(true);
  const [renderKey, setRenderKey] = useState(`${viewerMode}-${currentSlide}-${Date.now()}`);
  
  const { handlePreviousSlide, handleNextSlide } = useSlideNavigation({
    totalSlides
  });
  
  // モードが変わったときにキャンバスを再レンダリング
  useEffect(() => {
    setRenderKey(`${viewerMode}-${currentSlide}-${Date.now()}`);
    console.log(`SlideViewerPanel: Updated renderKey due to mode change: ${renderKey}`);
  }, [viewerMode, currentSlide]);

  // Dismiss drag tip after a few seconds
  useEffect(() => {
    if (showDragTip) {
      const timer = setTimeout(() => {
        setShowDragTip(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showDragTip]);

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

  // サイドバーの切り替え
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  console.log(`SlideViewerPanel: Rendering mode=${viewerMode}, slide=${currentSlide}, showNotes=${showPresenterNotes}`);
  
  // 明示的に右サイドパネルの表示条件をチェック
  const shouldShowRightSidePanel = viewerMode === "review" || (showPresenterNotes === true);
  
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
        
        {/* Slide content */}
        <div className="flex flex-1 relative overflow-hidden">
          <div className="flex-1 flex items-center justify-center bg-slate-100 h-full">
            <SlideCanvas
              key={renderKey}
              currentSlide={currentSlide}
              zoomLevel={zoom}
              editable={viewerMode === "edit"}
              userType={viewerMode === "review" ? "student" : "enterprise"}
            />
            
            {/* Navigation controls in presentation mode */}
            {viewerMode === "presentation" && (
              <PresentationControls
                currentSlide={currentSlide}
                totalSlides={totalSlides}
                isFullScreen={isFullScreen}
                elapsedTime={elapsedTime}
                presentationStartTime={presentationStartTime}
                onPreviousSlide={() => handlePreviousSlide()}
                onNextSlide={() => handleNextSlide()}
              />
            )}
            
            {/* Drag tip when in edit mode */}
            {viewerMode === "edit" && showDragTip && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium opacity-90">
                要素を選択してドラッグできます
              </div>
            )}
          </div>
          
          {/* Right sidebar - 表示条件をより厳格にチェック */}
          {shouldShowRightSidePanel && (
            <SidePanel
              shouldShowNotes={!!showPresenterNotes}
              shouldShowReviewPanel={viewerMode === "review"}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideViewerPanel;
