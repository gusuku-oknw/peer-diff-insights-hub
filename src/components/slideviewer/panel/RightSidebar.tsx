
import React from "react";
import SlideNotesPanel from "@/components/slideviewer/SlideNotesPanel";
import ReviewPanel from "@/components/slideviewer/ReviewPanel";

interface RightSidebarProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
}

const RightSidebar = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
}: RightSidebarProps) => {
  // サイドバーを表示するかどうかをチェック
  const shouldDisplay = shouldShowNotes || shouldShowReviewPanel;
  
  if (!shouldDisplay) {
    return null;
  }

  console.log(`Rendering RightSidebar: showNotes=${shouldShowNotes}, showReview=${shouldShowReviewPanel}`);

  return (
    <div className="w-80 h-full bg-gray-50 border-l border-gray-200 overflow-hidden">
      {shouldShowNotes && (
        <SlideNotesPanel 
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          presenterNotes={presenterNotes}
        />
      )}
      
      {/* レビューパネルはプレゼンターノートより優先度を下げる */}
      {shouldShowReviewPanel && !shouldShowNotes && (
        <ReviewPanel
          currentSlide={currentSlide}
          totalSlides={totalSlides}
        />
      )}
    </div>
  );
};

export default RightSidebar;
