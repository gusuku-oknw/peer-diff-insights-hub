
import React from "react";
import { Eye } from "lucide-react";

interface ReviewPermissionNoticeProps {
  isVeryNarrow?: boolean;
}

const ReviewPermissionNotice: React.FC<ReviewPermissionNoticeProps> = ({
  isVeryNarrow = false
}) => {
  if (isVeryNarrow) return null;

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
