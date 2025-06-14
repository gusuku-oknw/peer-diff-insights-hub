
import React from "react";
import EnhancedReviewPanelHeader from "./components/EnhancedReviewPanelHeader";
import ReviewPermissionNotice from "./components/ReviewPermissionNotice";
import EnhancedReviewPanelContent from "./components/EnhancedReviewPanelContent";
import { useReviewPanel } from "@/hooks/useReviewPanel";
import { checklistCategories } from "./components/ChecklistCategories";
import { useEnhancedReviewPanelActions } from "./components/EnhancedReviewPanelActions";

interface EnhancedReviewPanelProps {
  currentSlide: number;
  totalSlides: number;
  userType: "student" | "enterprise";
  panelWidth?: number;
  panelHeight?: number;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const EnhancedReviewPanel: React.FC<EnhancedReviewPanelProps> = ({
  currentSlide,
  totalSlides,
  userType,
  isNarrow = false,
  isVeryNarrow = false,
  activeTab: externalActiveTab,
  onTabChange: externalOnTabChange,
  onClose,
  isMobile = false
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
  } = useReviewPanel({
    userType,
    activeTab: externalActiveTab || "dashboard",
    onTabChange: externalOnTabChange
  });

  console.log('EnhancedReviewPanel render:', { 
    activeTab, 
    externalActiveTab, 
    currentSlide, 
    userType, 
    canView,
    canInteract 
  });

  const handleExplicitTabChange = React.useCallback((newTab: string) => {
    console.log('EnhancedReviewPanel: Explicit tab change requested', { from: activeTab, to: newTab });
    handleTabChange(newTab);
  }, [activeTab, handleTabChange]);

  const {
    handleClose,
    handleAddComment,
    handleSendReview,
    handleBookmark,
    handleUndo,
    handleShare,
    handleSuggest,
    handleMarkComplete,
    handleStartDiscussion
  } = useEnhancedReviewPanelActions({
    canInteract,
    activeTab,
    onTabChange: handleExplicitTabChange,
    onClose
  });

  // Mock data for enhanced header
  const reviewedCount = Math.floor(totalSlides * 0.6);
  const totalComments = comments.length + Math.floor(Math.random() * 5);
  const urgentItems = Math.floor(Math.random() * 3);

  return (
    <div className="h-full bg-white flex flex-col transition-all duration-300 ease-in-out">
      <EnhancedReviewPanelHeader
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        canInteract={canInteract}
        isVeryNarrow={isVeryNarrow}
        completionPercentage={completionPercentage}
        onClose={handleClose}
        isMobile={isMobile}
        reviewedCount={reviewedCount}
        totalComments={totalComments}
        urgentItems={urgentItems}
      />

      {!canInteract && !isVeryNarrow && (
        <ReviewPermissionNotice isVeryNarrow={isVeryNarrow} />
      )}

      <div className="flex-grow flex flex-col min-h-0">
        <EnhancedReviewPanelContent
          canView={canView}
          canInteract={canInteract}
          isVeryNarrow={isVeryNarrow}
          activeTab={activeTab}
          onTabChange={handleExplicitTabChange}
          comments={comments}
          checklistCategories={checklistCategories}
          newComment={newComment}
          currentSlide={currentSlide}
          checklistState={checklistState}
          completionPercentage={completionPercentage}
          onCommentChange={setNewComment}
          onSubmitComment={handleSubmitComment}
          onCheckboxChange={handleCheckboxChange}
          onAddComment={handleAddComment}
          onSendReview={handleSendReview}
          onBookmark={handleBookmark}
          onUndo={handleUndo}
          onShare={handleShare}
          onSuggest={handleSuggest}
          onMarkComplete={handleMarkComplete}
          onStartDiscussion={handleStartDiscussion}
        />
      </div>
    </div>
  );
};

export default EnhancedReviewPanel;
