
import React from "react";
import { Eye } from "lucide-react";

interface ReviewPermissionNoticeProps {
  isVeryNarrow?: boolean;
}

const ReviewPermissionNotice: React.FC<ReviewPermissionNoticeProps> = ({
  isVeryNarrow = false
}) => {
  return (
    <div className={`${isVeryNarrow ? 'p-1' : 'p-3'} border-t border-gray-200 bg-amber-50 flex-shrink-0`}>
      <div className="flex items-center justify-center text-center">
        <Eye className={`${isVeryNarrow ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-amber-600`} />
        <span className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} text-amber-700`}>
          {isVeryNarrow ? '閲覧のみ' : '企業ユーザーはレビューの閲覧のみ可能です'}
        </span>
      </div>
    </div>
  );
};

export default ReviewPermissionNotice;
