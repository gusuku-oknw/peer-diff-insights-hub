
import React from "react";
import SlideCanvas from "@/components/slideviewer/canvas/SlideCanvas";
import ReviewCommentSection from "./ReviewCommentSection";

interface MainContentProps {
  currentSlide: number;
  zoom: number;
  viewerMode: "presentation" | "edit" | "review";
  userType: "student" | "enterprise";
  isNotesPanelOpen: boolean;
  comments: any[];
  commentText: string;
  setCommentText: (text: string) => void;
  handleAddComment: () => void;
  toggleNotesPanel: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  currentSlide,
  zoom,
  viewerMode,
  userType,
  isNotesPanelOpen,
  comments,
  commentText,
  setCommentText,
  handleAddComment,
  toggleNotesPanel
}) => {
  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      {/* スライドビューワー - フレキシブルなレイアウト */}
      <div className="flex-grow flex items-center justify-center overflow-hidden bg-gray-50 p-2">
        <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
          <SlideCanvas
            currentSlide={currentSlide}
            zoomLevel={zoom}
            editable={viewerMode === "edit"}
            userType={userType}
          />
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
