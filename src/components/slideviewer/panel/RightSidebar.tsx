
import React from "react";
import SlideNotesPanel from "@/components/slideviewer/SlideNotesPanel";

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
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">レビューパネル</h3>
            <p className="text-sm text-gray-500">このスライドへのコメントやフィードバックが表示されます</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
