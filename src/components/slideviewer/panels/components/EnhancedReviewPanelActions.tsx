
import React from "react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedReviewPanelActionsProps {
  canInteract: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}

export const useEnhancedReviewPanelActions = ({
  canInteract,
  activeTab,
  onTabChange,
  onClose
}: EnhancedReviewPanelActionsProps) => {
  const { toast } = useToast();

  const handleClose = React.useCallback(() => {
    if (onClose) {
      toast({
        title: "レビューパネルを閉じました",
        description: "ツールバーから再度開くことができます",
        duration: 2000
      });
      onClose();
    }
  }, [onClose, toast]);

  const handleAddComment = React.useCallback(() => {
    if (canInteract) {
      onTabChange("review");
      toast({
        title: "コメント追加モード",
        description: "レビュータブでコメントを追加できます",
        duration: 2000
      });
    } else {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはコメントの追加はできません",
        variant: "destructive",
        duration: 2000
      });
    }
  }, [canInteract, onTabChange, toast]);

  const handleSendReview = React.useCallback(() => {
    if (canInteract) {
      toast({
        title: "レビューを送信しました",
        description: "チームメンバーに通知されました",
        duration: 3000
      });
    } else {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはレビューの送信はできません",
        variant: "destructive",
        duration: 2000
      });
    }
  }, [canInteract, toast]);

  const handleBookmark = React.useCallback(() => {
    toast({
      title: "ブックマークしました",
      description: "このスライドがブックマークに追加されました",
      duration: 2000
    });
  }, [toast]);

  const handleUndo = React.useCallback(() => {
    toast({
      title: "操作を元に戻しました",
      description: "前の状態に復元されました",
      duration: 2000
    });
  }, [toast]);

  const handleShare = React.useCallback(() => {
    toast({
      title: "共有リンクをコピーしました",
      description: "クリップボードにリンクがコピーされました",
      duration: 2000
    });
  }, [toast]);

  const handleSuggest = React.useCallback(() => {
    onTabChange("suggestions");
    toast({
      title: "AI提案を表示",
      description: "このスライドの改善提案を確認できます",
      duration: 2000
    });
  }, [onTabChange, toast]);

  const handleMarkComplete = React.useCallback(() => {
    if (canInteract) {
      toast({
        title: "完了マークを追加",
        description: "このスライドのレビューが完了しました",
        duration: 2000
      });
    } else {
      toast({
        title: "権限がありません",
        description: "企業ユーザーは完了マークの追加はできません",
        variant: "destructive",
        duration: 2000
      });
    }
  }, [canInteract, toast]);

  const handleStartDiscussion = React.useCallback(() => {
    if (canInteract) {
      onTabChange("review");
      toast({
        title: "ディスカッション開始",
        description: "チームディスカッションを開始しました",
        duration: 2000
      });
    } else {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはディスカッションの開始はできません",
        variant: "destructive",
        duration: 2000
      });
    }
  }, [canInteract, onTabChange, toast]);

  return {
    handleClose,
    handleAddComment,
    handleSendReview,
    handleBookmark,
    handleUndo,
    handleShare,
    handleSuggest,
    handleMarkComplete,
    handleStartDiscussion
  };
};
