
import React from "react";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye } from "lucide-react";

interface ReviewPanelHeaderProps {
  currentSlide: number;
  totalSlides: number;
  canInteract: boolean;
  isVeryNarrow?: boolean;
  isExtremelyNarrow?: boolean;
  isShort?: boolean;
  completionPercentage: number;
}

const ReviewPanelHeader: React.FC<ReviewPanelHeaderProps> = ({
  currentSlide,
  totalSlides,
  canInteract,
  isVeryNarrow = false,
  isExtremelyNarrow = false,
  isShort = false,
  completionPercentage
}) => {
  return (
    <div className={`${isVeryNarrow ? 'p-1' : 'p-4'} border-b border-gray-200 flex-shrink-0`}>
      <h2 className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-sm' : 'text-lg'} font-semibold text-gray-800 flex items-center min-w-0`}>
        <MessageSquare className={`${isExtremelyNarrow ? 'h-3 w-3 mr-1' : isVeryNarrow ? 'h-4 w-4 mr-1' : 'h-5 w-5 mr-2'} text-blue-600 flex-shrink-0`} />
        <span className="truncate">{isExtremelyNarrow ? 'レビュー' : isVeryNarrow ? 'レビュー' : 'レビュー管理'}</span>
        {!canInteract && (
          <Eye className={`${isExtremelyNarrow ? 'h-3 w-3 ml-1' : 'h-4 w-4 ml-2'} text-gray-500 flex-shrink-0`} />
        )}
      </h2>
      <p className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} text-gray-600 truncate`}>
        {isExtremelyNarrow ? `${currentSlide}/${totalSlides}` : isVeryNarrow ? `${currentSlide}/${totalSlides}` : `現在のスライド: ${currentSlide} / ${totalSlides}`}
        {!canInteract && !isExtremelyNarrow && <span className="ml-2 text-amber-600">(閲覧のみ)</span>}
      </p>
      
      {!isShort && (
        <div className={`${isVeryNarrow ? 'mt-1' : 'mt-3'} bg-blue-50 rounded-md ${isVeryNarrow ? 'p-1' : 'p-3'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-xs'} text-blue-700`}>
              {isExtremelyNarrow ? '進捗' : isVeryNarrow ? '進捗' : 'レビュー進捗状況'}
            </span>
            <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-xs'} font-medium text-blue-800`}>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPanelHeader;
