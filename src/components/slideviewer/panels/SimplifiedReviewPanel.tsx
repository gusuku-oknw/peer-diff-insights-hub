
import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Palette
} from "lucide-react";

// Import the new components
import ReviewPanelHeader from "./components/ReviewPanelHeader";
import ReviewPermissionNotice from "./components/ReviewPermissionNotice";
import ReviewCommentsList from "./components/ReviewCommentsList";
import ReviewCommentInput from "./components/ReviewCommentInput";
import ReviewChecklistPanel from "./components/ReviewChecklistPanel";
import ReviewSimplifiedView from "./components/ReviewSimplifiedView";

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

const checklistCategories = {
  structure: {
    icon: FileText,
    label: "構成",
    color: "blue",
    items: [
      { id: "s1", text: "タイトルは明確で理解しやすいか", checked: false },
      { id: "s2", text: "内容の流れは論理的か", checked: false },
      { id: "s3", text: "重要なポイントが強調されているか", checked: false }
    ]
  },
  design: {
    icon: Palette,
    label: "デザイン",
    color: "green",
    items: [
      { id: "d1", text: "色使いは見やすく統一されているか", checked: false },
      { id: "d2", text: "フォントサイズは適切か", checked: false },
      { id: "d3", text: "レイアウトはバランスが取れているか", checked: false }
    ]
  },
  content: {
    icon: MessageSquare,
    label: "文言",
    color: "purple",
    items: [
      { id: "c1", text: "文章は簡潔で分かりやすいか", checked: false },
      { id: "c2", text: "専門用語の説明は十分か", checked: false },
      { id: "c3", text: "誤字脱字はないか", checked: false }
    ]
  }
};

const SimplifiedReviewPanel: React.FC<SimplifiedReviewPanelProps> = ({
  currentSlide,
  totalSlides,
  userType,
  isNarrow = false,
  isVeryNarrow = false
}) => {
  const [activeTab, setActiveTab] = useState("review");
  const [selectedCategory, setSelectedCategory] = useState("structure");
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

    // DO NOT change activeTab here - this was likely causing the unexpected transitions
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
        category: selectedCategory,
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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-grow flex flex-col">
            <TabsList className="mx-4 mt-3 grid grid-cols-2 bg-gray-50">
              <TabsTrigger value="review" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                レビュー
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                チェック
              </TabsTrigger>
            </TabsList>

            <TabsContent value="review" className="flex-grow mx-4 mt-3 space-y-3 overflow-hidden">
              <ReviewCommentsList 
                comments={comments}
                checklistCategories={checklistCategories}
              />
              <ReviewCommentInput
                newComment={newComment}
                currentSlide={currentSlide}
                isVeryNarrow={isVeryNarrow}
                onCommentChange={setNewComment}
                onSubmitComment={handleSubmitComment}
              />
            </TabsContent>

            <TabsContent value="checklist" className="flex-grow mx-4 mt-3 overflow-hidden">
              <ReviewChecklistPanel
                checklistState={checklistState}
                onCheckboxChange={handleCheckboxChange}
                checklistCategories={checklistCategories}
                canInteract={canInteract}
              />
            </TabsContent>
          </Tabs>
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
