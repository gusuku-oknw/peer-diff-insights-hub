
import React from "react";
import { useReviewPanel } from "@/hooks/useReviewPanel";
import ReviewTabs from "./ReviewTabs";

interface ReviewPanelProps {
  currentSlide: number;
  totalSlides: number;
  userType: "student" | "enterprise";
  panelWidth?: number;
  panelHeight?: number;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({
  currentSlide,
  totalSlides,
  userType,
  panelWidth,
  panelHeight,
  isNarrow = false,
  isVeryNarrow = false,
}) => {
  const {
    activeTab,
    handleTabChange,
    newComment,
    setNewComment,
    comments,
    checklistState,
    completionPercentage,
    canView,
    canInteract,
    handleCheckboxChange,
    handleSubmitComment
  } = useReviewPanel({ userType });

  return (
    <div className="h-full flex flex-col bg-white">
      <ReviewTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        canInteract={canInteract}
        comments={comments}
        checklistCategories={null}
        newComment={newComment}
        currentSlide={currentSlide}
        isVeryNarrow={isVeryNarrow}
        checklistState={checklistState}
        completionPercentage={completionPercentage}
        onCommentChange={setNewComment}
        onSubmitComment={handleSubmitComment}
        onCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
};
export default ReviewPanel;
