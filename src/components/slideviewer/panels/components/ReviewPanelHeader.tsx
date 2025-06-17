
import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Eye, X } from "lucide-react";

interface ReviewPanelHeaderProps {
  currentSlide: number;
  totalSlides: number;
  canInteract: boolean;
  isVeryNarrow?: boolean;
  isExtremelyNarrow?: boolean;
  isShort?: boolean;
  completionPercentage: number;
  onClose?: () => void;
  isMobile?: boolean;
}

const ReviewPanelHeader: React.FC<ReviewPanelHeaderProps> = ({
  currentSlide,
  totalSlides,
  canInteract,
  isVeryNarrow = false,
  isExtremelyNarrow = false,
  isShort = false,
  completionPercentage,
  onClose,
  isMobile = false
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
    <div className={`${isVeryNarrow ? 'p-1' : 'p-4'} border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-sm' : 'text-lg'} font-semibold text-gray-800 flex items-center min-w-0`}>
          <MessageSquare className={`${isExtremelyNarrow ? 'h-3 w-3 mr-1' : isVeryNarrow ? 'h-4 w-4 mr-1' : 'h-5 w-5 mr-2'} text-blue-600 flex-shrink-0`} />
          <span className="truncate">{isExtremelyNarrow ? 'レビュー' : isVeryNarrow ? 'レビュー' : 'レビュー管理'}</span>
          {!canInteract && (
            <Eye className={`${isExtremelyNarrow ? 'h-3 w-3 ml-1' : 'h-4 w-4 ml-2'} text-gray-500 flex-shrink-0`} />
          )}
        </h2>
        
        {/* 統一されたデザインの閉じるボタン */}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`${isVeryNarrow ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'} flex-shrink-0 hover:bg-white/70 hover:border-gray-300 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 border border-transparent`}
            title="パネルを閉じる (ESC)"
            aria-label="レビューパネルを閉じる"
          >
            <X className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600 hover:text-gray-800 transition-colors`} />
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <p className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} text-gray-600 truncate`}>
          {isExtremelyNarrow ? `${currentSlide}/${totalSlides}` : isVeryNarrow ? `${currentSlide}/${totalSlides}` : `現在のスライド: ${currentSlide} / ${totalSlides}`}
          {!canInteract && !isExtremelyNarrow && <span className="ml-2 text-amber-600">(閲覧のみ)</span>}
        </p>
        
        <Badge variant="outline" className="text-xs bg-white/50">
          進捗 {completionPercentage}%
        </Badge>
      </div>
      
      {!isShort && (
        <div className={`${isVeryNarrow ? 'mt-2' : 'mt-3'} bg-white/60 rounded-md ${isVeryNarrow ? 'p-2' : 'p-3'} border border-white/50`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-xs'} text-blue-700 font-medium`}>
              {isExtremelyNarrow ? '進捗' : isVeryNarrow ? '進捗' : 'レビュー進捗状況'}
            </span>
            <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-xs'} font-semibold text-blue-800`}>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPanelHeader;
