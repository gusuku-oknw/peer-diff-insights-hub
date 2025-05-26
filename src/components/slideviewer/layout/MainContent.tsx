
import React from "react";
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
  // Mock data for review comment section
  const [isNotesPanelOpen, setIsNotesPanelOpen] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const comments = mockComments || [];

  const handleAddComment = () => {
    // Implementation for adding comments
    console.log("Adding comment:", commentText);
    setCommentText("");
  };

  const toggleNotesPanel = () => {
    setIsNotesPanelOpen(!isNotesPanelOpen);
  };

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      {/* スライドビューワー - 完全中央配置 */}
      <div className="flex-1 relative bg-gray-50">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <SlideCanvas
              currentSlide={currentSlide}
              zoomLevel={zoom}
              editable={viewerMode === "edit"}
              userType={userType}
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
