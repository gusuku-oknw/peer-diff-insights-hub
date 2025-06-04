
import { useState, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { checklistCategories } from "@/components/slide-viewer/panels/components/ChecklistCategories";

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

interface UseReviewPanelProps {
  userType: "student" | "enterprise";
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const useReviewPanel = ({
  userType,
  activeTab: externalActiveTab,
  onTabChange: externalOnTabChange
}: UseReviewPanelProps) => {
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

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const totalItems = Object.values(checklistState).flat().length;
    const checkedItems = Object.values(checklistState).flat().filter(item => item.checked).length;
    return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  }, [checklistState]);

  // Debounced toast to prevent excessive notifications
  const debouncedToast = useCallback((message: string, description: string) => {
    setTimeout(() => {
      toast({
        title: message,
        description: description,
        variant: "default",
        duration: 2000
      });
    }, 100);
  }, [toast]);

  // Enhanced checkbox change handler that prevents tab transitions
  const handleCheckboxChange = useCallback((categoryKey: string, itemId: string, checked: boolean) => {
    console.log('useReviewPanel: Enhanced handleCheckboxChange called', { 
      categoryKey, 
      itemId, 
      checked, 
      canInteract,
      currentActiveTab: activeTab
    });
    
    if (!canInteract) {
      console.log('useReviewPanel: User cannot interact, blocking checkbox change');
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
      console.log('useReviewPanel: Updated checklist state', newState);
      return newState;
    });

    // Show toast notification with debounce to prevent state interference
    if (checked) {
      console.log('useReviewPanel: Showing completion toast (debounced)');
      debouncedToast(
        "チェック完了",
        `${checklistCategories[categoryKey as keyof typeof checklistCategories]?.label}の項目をチェックしました`
      );
    }

    console.log('useReviewPanel: Checkbox change completed, activeTab should remain:', activeTab);
  }, [canInteract, activeTab, debouncedToast]);

  const handleSubmitComment = useCallback(() => {
    console.log('useReviewPanel: handleSubmitComment called', { canInteract, newComment });
    
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

  return {
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
  };
};
