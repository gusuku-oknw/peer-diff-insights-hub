
import React, { useState, useMemo } from "react";
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
}

const SimplifiedReviewPanel: React.FC<SimplifiedReviewPanelProps> = ({
  currentSlide,
  totalSlides,
  userType,
  isNarrow = false,
  isVeryNarrow = false
}) => {
  const [activeTab, setActiveTab] = useState("review");
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

  console.log('SimplifiedReviewPanel render:', { activeTab, currentSlide, userType, canInteract });

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const totalItems = Object.values(checklistState).flat().length;
    const checkedItems = Object.values(checklistState).flat().filter(item => item.checked).length;
    return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  }, [checklistState]);

  const handleCheckboxChange = (categoryKey: string, itemId: string, checked: boolean) => {
    console.log('SimplifiedReviewPanel: handleCheckboxChange called', { 
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
    
    // Update checkbox state - this should NOT cause tab transitions
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

    // Show toast notification
    if (checked) {
      console.log('SimplifiedReviewPanel: Showing completion toast');
      toast({
        title: "チェック完了",
        description: `${checklistCategories[categoryKey as keyof typeof checklistCategories]?.label}の項目をチェックしました`,
        variant: "default"
      });
    }

    // 重要: ここでactiveTabを変更しない - これがタブ遷移の原因だった
    console.log('SimplifiedReviewPanel: Checkbox change completed, activeTab remains:', activeTab);
  };

  const handleSubmitComment = () => {
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
      toast({
        title: "コメントを投稿しました",
        description: "レビューが正常に追加されました",
        variant: "default"
      });
    }
  };

  const handleTabChange = (newTab: string) => {
    console.log('SimplifiedReviewPanel: Tab change requested', { from: activeTab, to: newTab });
    setActiveTab(newTab);
  };

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
            onTabChange={handleTabChange}
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
