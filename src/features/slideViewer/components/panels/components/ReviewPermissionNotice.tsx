import React from "react";
import { Eye } from "lucide-react";

interface ReviewPermissionNoticeProps {
  isVeryNarrow?: boolean;
}

const ReviewPermissionNotice: React.FC<ReviewPermissionNoticeProps> = ({
  isVeryNarrow = false
}) => {
  if (isVeryNarrow) return (
    <div className="p-1 border-t border-gray-200 bg-amber-50 flex-shrink-0">
      <div className="flex items-center justify-center text-center">
        <Eye className="h-3 w-3 mr-1 text-amber-600" />
        <span className="text-xs text-amber-700">
          閲覧のみ
        </span>
      </div>
    </div>
  );

  return (
    <div className="mx-4 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center gap-2 text-amber-700 text-sm">
        <Eye className="h-4 w-4" />
        <span>企業ユーザーは閲覧専用です</span>
      </div>
    </div>
  );
};

export default ReviewPermissionNotice;
