
import React, { useState, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import ReviewPanelHeader from "./components/ReviewPanelHeader";
import ReviewPermissionNotice from "./components/ReviewPermissionNotice";
import ReviewSimplifiedView from "./components/ReviewSimplifiedView";
import SimplifiedReviewTabs from "./components/SimplifiedReviewTabs";
import { checklistCategories } from "./components/ChecklistCategories";

interface Comment {
  id: string;
  content: string;
  category: string;
  timestamp: Date;
  resolved: boolean;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

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
  const [internalActiveTab, setInternalActiveTab] = useState("review");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      content: "スライドのグラフと説明がとても分かりやすいです",
      category: "structure",
      timestamp: new Date(),
      resolved: false
    }
  ]);
  const [checklistState, setChecklistState] = useState(() => {
    const initialState: Record<string, ChecklistItem[]> = {};
    Object.entries(checklistCategories).forEach(([key, category]) => {
      initialState[key] = [...category.items];
    });
    return initialState;
  });

  const { toast } = useToast();
  const canInteract = userType === "student";

  // Use external tab control if provided, otherwise use internal
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const handleTabChange = externalOnTabChange || setInternalActiveTab;

  console.log('SimplifiedReviewPanel render:', { 
    activeTab, 
    externalActiveTab, 
    currentSlide, 
    userType, 
    canInteract 
  });

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const totalItems = Object.values(checklistState).flat().length;
    const checkedItems = Object.values(checklistState).flat().filter(item => item.checked).length;
    return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  }, [checklistState]);

  // Debounced toast to prevent excessive notifications
  const debouncedToast = useCallback((message: string, description: string) => {
    // Use setTimeout to delay toast and prevent it from interfering with tab state
    setTimeout(() => {
      toast({
        title: message,
        description: description,
        variant: "default",
        duration: 2000 // Shorter duration
      });
    }, 100);
  }, [toast]);

  // FIXED: Enhanced checkbox change handler that prevents tab transitions
  const handleCheckboxChange = useCallback((categoryKey: string, itemId: string, checked: boolean) => {
    console.log('SimplifiedReviewPanel: Enhanced handleCheckboxChange called', { 
      categoryKey, 
      itemId, 
      checked, 
      canInteract,
      currentActiveTab: activeTab
    });
    
    if (!canInteract) {
      console.log('SimplifiedReviewPanel: User cannot interact, blocking checkbox change');
      return;
    }
    
    // Update checkbox state WITHOUT affecting activeTab
    setChecklistState(prev => {
      const newState = {
        ...prev,
        [categoryKey]: prev[categoryKey].map(item =>
          item.id === itemId ? { ...item, checked } : item
        )
      };
      console.log('SimplifiedReviewPanel: Updated checklist state', newState);
      return newState;
    });

    // Show toast notification with debounce to prevent state interference
    if (checked) {
      console.log('SimplifiedReviewPanel: Showing completion toast (debounced)');
      debouncedToast(
        "チェック完了",
        `${checklistCategories[categoryKey as keyof typeof checklistCategories]?.label}の項目をチェックしました`
      );
    }

    console.log('SimplifiedReviewPanel: Checkbox change completed, activeTab should remain:', activeTab);
  }, [canInteract, activeTab, debouncedToast]);

  const handleSubmitComment = useCallback(() => {
    console.log('SimplifiedReviewPanel: handleSubmitComment called', { canInteract, newComment });
    
    if (!canInteract) {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはコメントの投稿はできません",
        variant: "destructive"
      });
      return;
    }

    if (newComment && newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        content: newComment,
        category: "structure",
        timestamp: new Date(),
        resolved: false
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
      
      // Debounced toast for comments too
      debouncedToast(
        "コメントを投稿しました",
        "レビューが正常に追加されました"
      );
    }
  }, [canInteract, newComment, comments, debouncedToast, toast]);

  // Enhanced tab change handler with explicit logging
  const handleExplicitTabChange = useCallback((newTab: string) => {
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
