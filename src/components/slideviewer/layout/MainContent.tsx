import React, { useRef, useEffect, useState } from "react";
import SlideCanvas from "@/components/slideviewer/canvas/SlideCanvas";
import { useSlideStore } from "@/stores/slide-store";

interface MainContentProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: "presentation" | "edit" | "review";
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: Date | null;
  presenterNotes: Record<number, string>;
  elapsedTime: number;
  displayCount: number;
  commentedSlides: number[];
  mockComments: any[];
  userType: "student" | "enterprise";
  rightPanelCollapsed: boolean;
  onSlideChange: (slide: number) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  currentSlide,
  totalSlides,
  zoom,
  viewerMode,
  showPresenterNotes,
  isFullScreen,
  presentationStartTime,
  presenterNotes,
  elapsedTime,
  displayCount,
  commentedSlides,
  mockComments,
  userType,
  rightPanelCollapsed,
  onSlideChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const { rightSidebarWidth, leftSidebarOpen, leftSidebarWidth, editSidebarWidth } = useSlideStore();

  // Calculate available container size considering all panels
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        
        // Calculate the actual available width for the canvas
        const availableWidth = rect.width;
        
        setContainerSize({
          width: availableWidth,
          height: rect.height
        });
      }
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    
    // Initial size setting
    updateSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [rightPanelCollapsed, rightSidebarWidth]);

  console.log('MainContent: Container size and display settings', {
    containerSize,
    userType,
    viewerMode,
    rightPanelCollapsed
  });

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Slide viewer - Main area */}
      <div
        ref={containerRef}
        className="flex-1 relative bg-gray-50 w-full h-full min-h-0 min-h-[300px]"
        style={{
          marginRight: !rightPanelCollapsed ? `${rightSidebarWidth}px` : '0px',
          transition: 'margin-right 0.2s ease-out',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full h-full flex items-center justify-center">
            <SlideCanvas
              currentSlide={currentSlide}
              zoomLevel={zoom}
              editable={viewerMode === "edit"}
              userType={userType}
              containerWidth={containerSize.width}
              containerHeight={containerSize.height}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;