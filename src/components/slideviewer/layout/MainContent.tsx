
import React, { useRef, useEffect, useState } from "react";
import SlideCanvas from "@/components/slideviewer/canvas/SlideCanvas";
import StudentReviewSection from "./StudentReviewSection";

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
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const comments = mockComments || [];

  // ResizeObserverでコンテナサイズを監視
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

  // 学生ユーザーのレビューモードかどうかの判定
  const showStudentReviewSection = viewerMode === "review" && userType === "student";

  console.log('MainContent: Container size and display settings', {
    containerSize,
    showStudentReviewSection,
    userType,
    viewerMode
  });

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      {/* スライドビューワー - メインエリア */}
      <div 
        ref={containerRef}
        className="flex-1 relative bg-gray-50 w-full h-full min-h-0"
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

      {/* 学生用レビューセクション - 台本表示も含む */}
      {showStudentReviewSection && (
        <StudentReviewSection
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          isNotesPanelOpen={isNotesPanelOpen}
          comments={comments}
          commentText={commentText}
          setCommentText={setCommentText}
          handleAddComment={handleAddComment}
          toggleNotesPanel={toggleNotesPanel}
          presenterNotes={presenterNotes}
          showPresenterNotes={showPresenterNotes}
        />
      )}
    </main>
  );
};

export default MainContent;
