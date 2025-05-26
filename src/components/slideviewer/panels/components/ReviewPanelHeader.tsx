
import React from "react";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye } from "lucide-react";

interface ReviewPanelHeaderProps {
  currentSlide: number;
  totalSlides: number;
  canInteract: boolean;
  isVeryNarrow?: boolean;
}

const ReviewPanelHeader: React.FC<ReviewPanelHeaderProps> = ({
  currentSlide,
  totalSlides,
  canInteract,
  isVeryNarrow = false
}) => {
  return (
    <div className={`${isVeryNarrow ? 'px-2 py-1' : 'px-4 py-3'} border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between flex-shrink-0`}>
      <div className="flex items-center gap-2">
        <MessageSquare className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />
        {!isVeryNarrow && (
          <h3 className="font-medium text-sm text-blue-800">
            {canInteract ? "レビュー" : "レビュー閲覧"}
          </h3>
        )}
        {!canInteract && <Eye className="h-3 w-3 text-amber-600" />}
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {currentSlide}/{totalSlides}
        </Badge>
      </div>
    </div>
  );
};

export default ReviewPanelHeader;
