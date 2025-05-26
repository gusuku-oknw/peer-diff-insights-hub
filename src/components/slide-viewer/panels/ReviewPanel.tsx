
import React, { useState, useMemo } from "react";
import { MessageSquare, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReviewPanelHeader from "./components/ReviewPanelHeader";
import ReviewPermissionNotice from "./components/ReviewPermissionNotice";
import ReviewScriptSection from "./components/ReviewScriptSection";
import ReviewPanelContent from "./components/ReviewPanelContent";
import ReviewCommentInput from "./components/ReviewCommentInput";

interface ReviewPanelProps {
  currentSlide: number;
  totalSlides: number;
  panelWidth?: number;
  panelHeight?: number;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
  presenterNotes?: Record<number, string>;
  userType: "student" | "enterprise";
}

const mockReviews = {
  1: [
    {
      id: 1,
      text: "タイトルが明確で視認性が高く、とても良いスライドです。",
      reviewer: "鈴木先生",
      timestamp: "2025/05/22 14:30",
      rating: "excellent",
      status: "completed"
    },
    {
      id: 2, 
      text: "会社ロゴの配置をもう少し調整した方が見やすくなると思います。",
      reviewer: "田中教授",
      timestamp: "2025/05/22 16:15",
      rating: "good",
      status: "pending"
    }
  ],
  2: [
    {
      id: 3,
      text: "会社概要の説明が簡潔でわかりやすいです。ただ、もう少し具体的な数字があるとより説得力が増すと思います。",
      reviewer: "山本教授",
      timestamp: "2025/05/23 09:45",
      rating: "good",
      status: "completed"
    }
  ],
  3: [
    {
      id: 4,
      text: "グラフの色使いが見にくいです。コントラストを高めるか、別の色を検討してください。",
      reviewer: "佐藤教授",
      timestamp: "2025/05/23 11:30",
      rating: "needs_improvement",
      status: "pending"
    }
  ],
  4: [
    {
      id: 5,
      text: "戦略の説明が明確で理解しやすいです。ただ、具体的な実行計画やタイムラインがあるとより良いでしょう。",
      reviewer: "伊藤先生",
      timestamp: "2025/05/23 13:20",
      rating: "good",
      status: "completed"
    }
  ],
  5: []
};

const ReviewPanel: React.FC<ReviewPanelProps> = ({ 
  currentSlide, 
  totalSlides,
  panelWidth = 0,
  panelHeight = 0,
  isNarrow = false,
  isVeryNarrow = false,
  presenterNotes = {},
  userType
}) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  
  // Dynamic sizing based on actual panel dimensions
  const isExtremelyNarrow = panelWidth > 0 && panelWidth < 150;
  const isShort = panelHeight > 0 && panelHeight < 400;
  
  console.log('ReviewPanel render:', { 
    userType, 
    currentSlide, 
    panelWidth, 
    panelHeight, 
    isNarrow, 
    isVeryNarrow, 
    isExtremelyNarrow, 
    isShort 
  });
  
  // Review completion status
  const completionPercentage = useMemo(() => {
    const completedSlides = Object.keys(mockReviews).filter(slideId => {
      const slideReviews = mockReviews[Number(slideId) as keyof typeof mockReviews];
      return slideReviews && slideReviews.length > 0 && 
        slideReviews.some(review => review.status === "completed");
    }).length;
    
    return Math.round((completedSlides / totalSlides) * 100);
  }, [totalSlides]);

  const currentScript = presenterNotes[currentSlide] || "";

  const handleSubmitComment = () => {
    if (userType === "enterprise") {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはレビューの閲覧のみ可能です",
        variant: "destructive"
      });
      return;
    }
    
    if (newComment.trim()) {
      console.log("Student submitting comment:", newComment);
      toast({
        title: "コメントを投稿しました",
        description: "レビューコメントが正常に投稿されました",
        variant: "default"
      });
      setNewComment("");
    }
  };

  const handleChecklistComment = (comment: string, category: string) => {
    console.log(`Checklist comment for ${category}:`, comment);
    // Handle checklist comment submission
  };

  // Permission check for interactive elements
  const canInteract = userType === "student";

  return (
    <div className="h-full flex flex-col min-w-0">
      <ReviewPanelHeader
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        canInteract={canInteract}
        isVeryNarrow={isVeryNarrow}
        isExtremelyNarrow={isExtremelyNarrow}
        isShort={isShort}
        completionPercentage={completionPercentage}
      />

      <ReviewPermissionNotice isVeryNarrow={isVeryNarrow} />

      <ReviewScriptSection 
        currentScript={currentScript}
        isVeryNarrow={isVeryNarrow}
      />
      
      <ReviewPanelContent
        currentSlide={currentSlide}
        isVeryNarrow={isVeryNarrow}
        isExtremelyNarrow={isExtremelyNarrow}
        isShort={isShort}
        canInteract={canInteract}
        mockReviews={mockReviews}
        onChecklistComment={handleChecklistComment}
        userType={userType}
      />
      
      {canInteract && (
        <ReviewCommentInput
          newComment={newComment}
          currentSlide={currentSlide}
          isVeryNarrow={isVeryNarrow}
          onCommentChange={setNewComment}
          onSubmitComment={handleSubmitComment}
        />
      )}

      {/* Read-only message for enterprise users */}
      {!canInteract && (
        <div className={`${isVeryNarrow ? 'p-1' : 'p-3'} border-t border-gray-200 bg-amber-50 flex-shrink-0`}>
          <div className="flex items-center justify-center text-center">
            <Eye className={`${isVeryNarrow ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-amber-600`} />
            <span className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} text-amber-700`}>
              {isVeryNarrow ? '閲覧のみ' : '企業ユーザーはレビューの閲覧のみ可能です'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPanel;
