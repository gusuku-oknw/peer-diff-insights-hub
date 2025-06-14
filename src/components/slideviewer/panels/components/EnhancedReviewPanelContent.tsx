
import React from "react";
import EnhancedReviewTabs from "./EnhancedReviewTabs";
import QuickActionBar from "./QuickActionBar";
import ReviewSimplifiedView from "./ReviewSimplifiedView";

interface EnhancedReviewPanelContentProps {
  canView: boolean;
  canInteract: boolean;
  isVeryNarrow: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  comments: any[];
  checklistCategories: any;
  newComment: string;
  currentSlide: number;
  checklistState: any;
  completionPercentage: number;
  onCommentChange: (comment: string) => void;
  onSubmitComment: () => void;
  onCheckboxChange: (categoryKey: string, itemId: string, checked: boolean) => void;
  onAddComment: () => void;
  onSendReview: () => void;
  onBookmark: () => void;
  onUndo: () => void;
  onShare: () => void;
  onSuggest: () => void;
  onMarkComplete: () => void;
  onStartDiscussion: () => void;
}

const EnhancedReviewPanelContent: React.FC<EnhancedReviewPanelContentProps> = ({
  canView,
  canInteract,
  isVeryNarrow,
  activeTab,
  onTabChange,
  comments,
  checklistCategories,
  newComment,
  currentSlide,
  checklistState,
  completionPercentage,
  onCommentChange,
  onSubmitComment,
  onCheckboxChange,
  onAddComment,
  onSendReview,
  onBookmark,
  onUndo,
  onShare,
  onSuggest,
  onMarkComplete,
  onStartDiscussion
}) => {
  if (canView && !isVeryNarrow) {
    return (
      <>
        <EnhancedReviewTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          canInteract={canInteract}
          comments={comments}
          checklistCategories={checklistCategories}
          newComment={newComment}
          currentSlide={currentSlide}
          isVeryNarrow={isVeryNarrow}
          checklistState={checklistState}
          completionPercentage={completionPercentage}
          onCommentChange={onCommentChange}
          onSubmitComment={onSubmitComment}
          onCheckboxChange={onCheckboxChange}
        />
        
        {canInteract && (
          <QuickActionBar
            canInteract={canInteract}
            onAddComment={onAddComment}
            onSendReview={onSendReview}
            onBookmark={onBookmark}
            onUndo={onUndo}
            onShare={onShare}
            onSuggest={onSuggest}
            onMarkComplete={onMarkComplete}
            onStartDiscussion={onStartDiscussion}
            isVeryNarrow={isVeryNarrow}
          />
        )}
      </>
    );
  }

  return (
    <ReviewSimplifiedView
      comments={comments}
      checklistCategories={checklistCategories}
    />
  );
};

export default EnhancedReviewPanelContent;
