
import React from "react";
import NotesPanel from "../NotesPanel";
import ReviewDashboard from "../components/ReviewDashboard";
import CommentSection from "../components/CommentSection";
import ChecklistSection from "../components/ChecklistSection";
import SmartSuggestions from "../components/SmartSuggestions";
import { useReviewPanel } from "@/hooks/useReviewPanel";
import { checklistCategories } from "../components/ChecklistCategories";

interface PanelContentProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  userType: "student" | "enterprise";
  panelWidth: number;
  isNarrow: boolean;
  isVeryNarrow: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PanelContent: React.FC<PanelContentProps> = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
  userType,
  panelWidth,
  isNarrow,
  isVeryNarrow,
  activeTab,
  onTabChange,
}) => {
  const {
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

  // Mock functions for suggestions
  const mockApplySuggestion = (suggestionId: string) => {
    console.log('Applying suggestion:', suggestionId);
  };

  const mockDismissSuggestion = (suggestionId: string) => {
    console.log('Dismissing suggestion:', suggestionId);
  };

  // Notes tab content
  if (activeTab === "notes" && shouldShowNotes) {
    return (
      <div className="flex-1 overflow-hidden">
        <NotesPanel 
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          presenterNotes={presenterNotes}
          panelWidth={panelWidth}
          panelHeight={600}
          isNarrow={isNarrow}
          isVeryNarrow={isVeryNarrow}
        />
      </div>
    );
  }

  // Dashboard tab content
  if (activeTab === "dashboard" && shouldShowReviewPanel) {
    return (
      <div className="flex-1 overflow-hidden p-4">
        <ReviewDashboard
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          completionPercentage={completionPercentage}
          pendingItems={3}
          urgentItems={1}
          completedToday={5}
          isVeryNarrow={isVeryNarrow}
        />
      </div>
    );
  }

  // Reviews tab content
  if (activeTab === "reviews" && shouldShowReviewPanel) {
    return (
      <div className="flex-1 overflow-hidden">
        <CommentSection
          comments={comments}
          checklistCategories={checklistCategories}
          newComment={newComment}
          currentSlide={currentSlide}
          isVeryNarrow={isVeryNarrow}
          onCommentChange={setNewComment}
          onSubmitComment={handleSubmitComment}
        />
      </div>
    );
  }

  // Checklist tab content
  if (activeTab === "checklist" && shouldShowReviewPanel) {
    return (
      <div className="flex-1 overflow-hidden p-4">
        <ChecklistSection
          checklistState={checklistState}
          onCheckboxChange={handleCheckboxChange}
          checklistCategories={checklistCategories}
          canInteract={canInteract}
        />
      </div>
    );
  }

  // Suggestions tab content
  if (activeTab === "suggestions" && shouldShowReviewPanel) {
    return (
      <div className="flex-1 overflow-hidden p-4">
        <SmartSuggestions
          currentSlide={currentSlide}
          onApplySuggestion={mockApplySuggestion}
          onDismissSuggestion={mockDismissSuggestion}
          isVeryNarrow={isVeryNarrow}
        />
      </div>
    );
  }

  // Default fallback
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <p className="text-gray-500">コンテンツが見つかりません</p>
    </div>
  );
};

export default PanelContent;
