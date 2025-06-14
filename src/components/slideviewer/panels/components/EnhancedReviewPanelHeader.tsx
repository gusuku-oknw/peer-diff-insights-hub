
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, CheckCircle, BarChart3, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface EnhancedReviewPanelHeaderProps {
  currentSlide: number;
  totalSlides: number;
  canInteract: boolean;
  isVeryNarrow?: boolean;
  completionPercentage: number;
  onClose?: () => void;
  isMobile?: boolean;
  reviewedCount?: number;
  totalComments?: number;
  urgentItems?: number;
}

const EnhancedReviewPanelHeader: React.FC<EnhancedReviewPanelHeaderProps> = ({
  currentSlide,
  totalSlides,
  canInteract,
  isVeryNarrow = false,
  completionPercentage,
  onClose,
  isMobile = false,
  reviewedCount = 0,
  totalComments = 0,
  urgentItems = 0
}) => {
  // ESCキーでパネルを閉じる機能
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  return (
    <div className={`${isVeryNarrow ? 'p-2' : 'p-4'} border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-purple-50 to-indigo-50`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`${isVeryNarrow ? 'text-sm' : 'text-base'} font-semibold text-gray-800 flex items-center min-w-0`}>
          <MessageSquare className={`${isVeryNarrow ? 'h-4 w-4 mr-1' : 'h-5 w-5 mr-2'} text-purple-600 flex-shrink-0`} />
          <span className="truncate">{isVeryNarrow ? 'レビュー' : 'レビュー・作業パネル'}</span>
        </h2>
        
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`${isVeryNarrow ? 'h-6 w-6 p-0' : 'h-7 w-7 p-0'} flex-shrink-0 hover:bg-white/70 hover:border-gray-300 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 border border-transparent`}
            title="パネルを閉じる (ESC)"
            aria-label="レビューパネルを閉じる"
          >
            <X className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600 hover:text-gray-800 transition-colors`} />
          </Button>
        )}
      </div>
      
      {/* Current slide info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            スライド {currentSlide}/{totalSlides}
          </Badge>
          {!canInteract && (
            <Badge variant="secondary" className="text-xs">
              閲覧専用
            </Badge>
          )}
        </div>
        
        {canInteract && (
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              <span>{reviewedCount}完了</span>
            </div>
            <div className="flex items-center gap-1 text-purple-600">
              <MessageSquare className="h-3 w-3" />
              <span>{totalComments}件</span>
            </div>
            {urgentItems > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <Target className="h-3 w-3" />
                <span>{urgentItems}緊急</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Enhanced progress section for work panel */}
      {canInteract && (
        <div className={`${isVeryNarrow ? 'mt-1.5' : 'mt-2'} bg-white/60 rounded-md ${isVeryNarrow ? 'p-1.5' : 'p-3'} border border-white/50`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} text-purple-700 font-medium flex items-center gap-1`}>
              <BarChart3 className="h-4 w-4" />
              {isVeryNarrow ? '進捗' : 'レビュー進捗'}
            </span>
            <span className="text-sm font-bold text-purple-700">
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2 mb-2" />
          <div className="text-xs text-gray-600">
            詳細なレビュー作業、コメント管理、AI提案の確認
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedReviewPanelHeader;
