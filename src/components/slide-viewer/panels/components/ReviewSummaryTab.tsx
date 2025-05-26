
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ReviewSummaryTabProps {
  isVeryNarrow?: boolean;
  isExtremelyNarrow?: boolean;
  isShort?: boolean;
  mockReviews: any;
}

const ReviewSummaryTab: React.FC<ReviewSummaryTabProps> = ({
  isVeryNarrow = false,
  isExtremelyNarrow = false,
  isShort = false,
  mockReviews
}) => {
  return (
    <div className={isVeryNarrow ? 'space-y-1' : 'space-y-4'}>
      <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${isVeryNarrow ? 'p-1' : 'p-3'}`}>
        <h3 className={`font-medium ${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} mb-1`}>
          {isExtremelyNarrow ? '概要' : isVeryNarrow ? '概要' : 'レビュー概要'}
        </h3>
        <div className={`grid grid-cols-3 gap-${isVeryNarrow ? '1' : '2'} text-center`}>
          <div className={`bg-blue-50 ${isVeryNarrow ? 'p-1' : 'p-2'} rounded`}>
            <div className={`${isExtremelyNarrow ? 'text-sm' : isVeryNarrow ? 'text-lg' : 'text-2xl'} font-bold text-blue-700`}>
              {Object.values(mockReviews).flat().length}
            </div>
            <div className={`text-xs text-blue-600 ${isExtremelyNarrow ? 'text-xs' : ''}`}>
              {isExtremelyNarrow ? '総' : isVeryNarrow ? '総数' : '総レビュー'}
            </div>
          </div>
          <div className={`bg-green-50 ${isVeryNarrow ? 'p-1' : 'p-2'} rounded`}>
            <div className={`${isExtremelyNarrow ? 'text-sm' : isVeryNarrow ? 'text-lg' : 'text-2xl'} font-bold text-green-700`}>
              {Object.values(mockReviews).flat().filter((r: any) => r.status === "completed").length}
            </div>
            <div className="text-xs text-green-600">完了</div>
          </div>
          <div className={`bg-amber-50 ${isVeryNarrow ? 'p-1' : 'p-2'} rounded`}>
            <div className={`${isExtremelyNarrow ? 'text-sm' : isVeryNarrow ? 'text-lg' : 'text-2xl'} font-bold text-amber-700`}>
              {Object.values(mockReviews).flat().filter((r: any) => r.status === "pending").length}
            </div>
            <div className={`text-xs text-amber-600 ${isExtremelyNarrow ? 'text-xs' : ''}`}>
              {isExtremelyNarrow ? '検' : isVeryNarrow ? '検討' : '検討中'}
            </div>
          </div>
        </div>
      </div>
      
      {!isShort && (
        <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${isVeryNarrow ? 'p-1' : 'p-3'}`}>
          <h3 className={`font-medium ${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} mb-1`}>
            {isExtremelyNarrow ? 'レビュアー' : isVeryNarrow ? 'レビュアー' : 'レビュアー別状況'}
          </h3>
          <div className={isVeryNarrow ? 'space-y-0.5' : 'space-y-2'}>
            <div className={`flex justify-between items-center ${isVeryNarrow ? 'p-0.5' : 'p-2'} bg-gray-50 rounded min-w-0`}>
              <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} truncate`}>鈴木先生</span>
              <Badge className="bg-green-500 text-xs flex-shrink-0">完了</Badge>
            </div>
            <div className={`flex justify-between items-center ${isVeryNarrow ? 'p-0.5' : 'p-2'} bg-gray-50 rounded min-w-0`}>
              <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} truncate`}>田中教授</span>
              <Badge className="bg-amber-500 text-xs flex-shrink-0">{isExtremelyNarrow ? '進' : isVeryNarrow ? '進行' : '進行中'}</Badge>
            </div>
            <div className={`flex justify-between items-center ${isVeryNarrow ? 'p-0.5' : 'p-2'} bg-gray-50 rounded min-w-0`}>
              <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} truncate`}>山本教授</span>
              <Badge className="bg-green-500 text-xs flex-shrink-0">完了</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSummaryTab;
