
import React, { useRef, useEffect, useState } from "react";
import SlideCanvas from "@/components/slideviewer/canvas/SlideCanvas";

interface SlideDisplayProps {
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

const SlideDisplay: React.FC<SlideDisplayProps> = ({
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

  // Calculate available container size
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height
        });
      }
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    
    updateSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const zoomScale = zoom / 100;

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Slide viewer - Main area */}
      <div
        ref={containerRef}
        className="flex-1 relative bg-gray-50 w-full h-full min-h-0 min-h-[300px] overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div 
            className="transform transition-transform duration-300 origin-center"
            style={{
              transform: `scale(${zoomScale})`,
            }}
          >
            <SlideCanvas
              currentSlide={currentSlide}
              zoomLevel={100}
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

export default SlideDisplay;
