
import React from "react";
import EnhancedReviewPanelHeader from "./components/EnhancedReviewPanelHeader";
import ReviewPermissionNotice from "./components/ReviewPermissionNotice";
import ReviewSimplifiedView from "./components/ReviewSimplifiedView";
import EnhancedReviewTabs from "./components/EnhancedReviewTabs";
import QuickActionBar from "./components/QuickActionBar";
import { useReviewPanel } from "@/hooks/useReviewPanel";
import { checklistCategories } from "./components/ChecklistCategories";
import { useToast } from "@/hooks/use-toast";

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
    canInteract,
    handleCheckboxChange,
    handleSubmitComment
  } = useReviewPanel({
    userType,
    activeTab: externalActiveTab || "dashboard",
    onTabChange: externalOnTabChange
  });

  const { toast } = useToast();

  console.log('EnhancedReviewPanel render:', { 
    activeTab, 
    externalActiveTab, 
    currentSlide, 
    userType, 
    canInteract 
  });

  const handleExplicitTabChange = React.useCallback((newTab: string) => {
    console.log('EnhancedReviewPanel: Explicit tab change requested', { from: activeTab, to: newTab });
    handleTabChange(newTab);
  }, [activeTab, handleTabChange]);

  // Mock data for enhanced header
  const reviewedCount = Math.floor(totalSlides * 0.6);
  const totalComments = comments.length + Math.floor(Math.random() * 5);
  const urgentItems = Math.floor(Math.random() * 3);

  // 閉じる操作のハンドラー（アニメーション付き）
  const handleClose = () => {
    if (onClose) {
      toast({
        title: "レビューパネルを閉じました",
        description: "ツールバーから再度開くことができます",
        duration: 2000
      });
      onClose();
    }
  };

  // Quick action handlers
  const handleAddComment = () => {
    if (canInteract) {
      handleExplicitTabChange("review");
      toast({
        title: "コメント追加モード",
        description: "レビュータブでコメントを追加できます",
        duration: 2000
      });
    }
  };

  const handleSendReview = () => {
    if (canInteract) {
      toast({
        title: "レビューを送信しました",
        description: "チームメンバーに通知されました",
        duration: 3000
      });
    }
  };

  const handleBookmark = () => {
    toast({
      title: "ブックマークしました",
      description: "このスライドがブックマークに追加されました",
      duration: 2000
    });
  };

  const handleUndo = () => {
    toast({
      title: "操作を元に戻しました",
      description: "前の状態に復元されました",
      duration: 2000
    });
  };

  const handleShare = () => {
    toast({
      title: "共有リンクをコピーしました",
      description: "クリップボードにリンクがコピーされました",
      duration: 2000
    });
  };

  const handleSuggest = () => {
    handleExplicitTabChange("suggestions");
    toast({
      title: "AI提案を表示",
      description: "このスライドの改善提案を確認できます",
      duration: 2000
    });
  };

  const handleMarkComplete = () => {
    if (canInteract) {
      toast({
        title: "完了マークを追加",
        description: "このスライドのレビューが完了しました",
        duration: 2000
      });
    }
  };

  const handleStartDiscussion = () => {
    if (canInteract) {
      handleExplicitTabChange("review");
      toast({
        title: "ディスカッション開始",
        description: "チームディスカッションを開始しました",
        duration: 2000
      });
    }
  };

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

      {!canInteract && (
        <ReviewPermissionNotice isVeryNarrow={isVeryNarrow} />
      )}

      <div className="flex-grow flex flex-col min-h-0">
        {canInteract && !isVeryNarrow ? (
          <>
            <EnhancedReviewTabs
              activeTab={activeTab}
              onTabChange={handleExplicitTabChange}
              canInteract={canInteract}
              comments={comments}
              checklistCategories={checklistCategories}
              newComment={newComment}
              currentSlide={currentSlide}
              isVeryNarrow={isVeryNarrow}
              checklistState={checklistState}
              completionPercentage={completionPercentage}
              onCommentChange={setNewComment}
              onSubmitComment={handleSubmitComment}
              onCheckboxChange={handleCheckboxChange}
            />
            
            <QuickActionBar
              canInteract={canInteract}
              onAddComment={handleAddComment}
              onSendReview={handleSendReview}
              onBookmark={handleBookmark}
              onUndo={handleUndo}
              onShare={handleShare}
              onSuggest={handleSuggest}
              onMarkComplete={handleMarkComplete}
              onStartDiscussion={handleStartDiscussion}
              isVeryNarrow={isVeryNarrow}
            />
          </>
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

export default EnhancedReviewPanel;
