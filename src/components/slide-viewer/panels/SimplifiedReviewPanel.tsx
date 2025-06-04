
import React from "react";
import ReviewPanelHeader from "./components/ReviewPanelHeader";
import ReviewPermissionNotice from "./components/ReviewPermissionNotice";
import ReviewSimplifiedView from "./components/ReviewSimplifiedView";
import SimplifiedReviewTabs from "./components/SimplifiedReviewTabs";
import { useReviewPanel } from "@/hooks/useReviewPanel";
import { checklistCategories } from "./components/ChecklistCategories";

interface SimplifiedReviewPanelProps {
  currentSlide: number;
  totalSlides: number;
  userType: "student" | "enterprise";
  panelWidth?: number;
  panelHeight?: number;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const SimplifiedReviewPanel: React.FC<SimplifiedReviewPanelProps> = ({
  currentSlide,
  totalSlides,
  userType,
  isNarrow = false,
  isVeryNarrow = false,
  activeTab: externalActiveTab,
  onTabChange: externalOnTabChange
}) => {
  const {
    activeTab,
    handleTabChange,
    newComment,
    setNewComment,
    comments,
    checklistState,
    completionPercentage,
    canInteract,
    handleCheckboxChange,
    handleSubmitComment
  } = useReviewPanel({
    userType,
    activeTab: externalActiveTab,
    onTabChange: externalOnTabChange
  });

  console.log('SimplifiedReviewPanel render:', { 
    activeTab, 
    externalActiveTab, 
    currentSlide, 
    userType, 
    canInteract 
  });

  // Enhanced tab change handler with explicit logging
  const handleExplicitTabChange = React.useCallback((newTab: string) => {
    console.log('SimplifiedReviewPanel: Explicit tab change requested', { from: activeTab, to: newTab });
    handleTabChange(newTab);
  }, [activeTab, handleTabChange]);

  return (
    <div className="h-full bg-white flex flex-col">
      <ReviewPanelHeader
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        canInteract={canInteract}
        isVeryNarrow={isVeryNarrow}
        completionPercentage={completionPercentage}
      />

      {!canInteract && (
        <ReviewPermissionNotice isVeryNarrow={isVeryNarrow} />
      )}

      <div className="flex-grow flex flex-col min-h-0">
        {canInteract && !isVeryNarrow ? (
          <SimplifiedReviewTabs
            activeTab={activeTab}
            onTabChange={handleExplicitTabChange}
            canInteract={canInteract}
            comments={comments}
            checklistCategories={checklistCategories}
            newComment={newComment}
            currentSlide={currentSlide}
            isVeryNarrow={isVeryNarrow}
            checklistState={checklistState}
            onCommentChange={setNewComment}
            onSubmitComment={handleSubmitComment}
            onCheckboxChange={handleCheckboxChange}
          />
        ) : (
          <ReviewSimplifiedView
            comments={comments}
            checklistCategories={checklistCategories}
          />
        )}
      </div>
    </div>
  );
};

export default SimplifiedReviewPanel;
