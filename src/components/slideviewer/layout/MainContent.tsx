
import React, { useRef, useEffect, useState } from "react";
import SlideCanvas from "@/components/slideviewer/canvas/SlideCanvas";
import ReviewCommentSection from "./ReviewCommentSection";

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
  const [isNotesPanelOpen, setIsNotesPanelOpen] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const comments = mockComments || [];

  // 動的幅計算: ResizeObserverでコンテナサイズを監視
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
    
    // 初期サイズ設定
    updateSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleAddComment = () => {
    console.log("Adding comment:", commentText);
    setCommentText("");
  };

  const toggleNotesPanel = () => {
    setIsNotesPanelOpen(!isNotesPanelOpen);
  };

  const shouldShowNotes = (viewerMode === "presentation" && showPresenterNotes) || 
                         (viewerMode === "review" && showPresenterNotes);
  const shouldShowReviewPanel = viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  const isRightPanelVisible = shouldDisplayRightPanel && !rightPanelCollapsed;

  console.log('MainContent: Container size and panel state', {
    containerSize,
    isRightPanelVisible,
    rightPanelCollapsed,
    shouldDisplayRightPanel
  });

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      {/* スライドビューワー - フル幅利用 */}
      <div 
        ref={containerRef}
        className="flex-1 relative bg-gray-50 w-full h-full"
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

      {/* レビューモードUI */}
      {viewerMode === "review" && userType === "student" && (
        <ReviewCommentSection
          isNotesPanelOpen={isNotesPanelOpen}
          comments={comments}
          commentText={commentText}
          setCommentText={setCommentText}
          handleAddComment={handleAddComment}
          toggleNotesPanel={toggleNotesPanel}
        />
      )}
    </main>
  );
};

export default MainContent;
