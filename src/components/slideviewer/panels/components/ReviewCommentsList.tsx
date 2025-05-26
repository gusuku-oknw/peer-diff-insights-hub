
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ThumbsUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle
} from "lucide-react";

interface Review {
  id: number;
  text: string;
  reviewer: string;
  timestamp: string;
  rating: string;
  status: string;
}

interface ReviewCommentsListProps {
  reviews: Review[];
  isVeryNarrow?: boolean;
  isExtremelyNarrow?: boolean;
  isShort?: boolean;
  canInteract: boolean;
  selectedReview: number | null;
  onSelectReview: (id: number) => void;
}

const getRatingBadge = (rating: string, isVeryNarrow: boolean) => {
  const text = isVeryNarrow ? 
    { excellent: "優", good: "良", needs_improvement: "要" } :
    { excellent: "優秀", good: "良好", needs_improvement: "要改善" };
    
  switch(rating) {
    case "excellent":
      return <Badge className="bg-green-500 text-xs">{text.excellent}</Badge>;
    case "good":
      return <Badge className="bg-blue-500 text-xs">{text.good}</Badge>;
    case "needs_improvement":
      return <Badge className="bg-amber-500 text-xs">{text.needs_improvement}</Badge>;
    default:
      return null;
  }
};

const getStatusBadge = (status: string, isVeryNarrow: boolean) => {
  switch(status) {
    case "completed":
      return (
        <Badge variant="outline" className="border-green-500 text-green-700 text-xs">
          <CheckCircle className="w-3 h-3 mr-1" /> 
          {isVeryNarrow ? "完" : "完了"}
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-700 text-xs">
          <Clock className="w-3 h-3 mr-1" /> 
          {isVeryNarrow ? "検" : "検討中"}
        </Badge>
      );
    default:
      return null;
  }
};

const ReviewCommentsList: React.FC<ReviewCommentsListProps> = ({
  reviews,
  isVeryNarrow = false,
  isExtremelyNarrow = false,
  isShort = false,
  canInteract,
  selectedReview,
  onSelectReview
}) => {
  return (
    <ScrollArea className="h-full">
      {reviews.length > 0 ? (
        <div className={`${isVeryNarrow ? 'p-1 space-y-1' : 'p-4 space-y-4'} min-w-0`}>
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className={`bg-white shadow-sm border rounded-lg ${isVeryNarrow ? 'p-1' : 'p-3'} transition-colors ${
                selectedReview === review.id ? "border-blue-400 bg-blue-50" : "border-gray-200"
              } min-w-0`}
              onClick={() => onSelectReview(review.id)}
            >
              <div className="flex justify-between items-start mb-1 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className={`font-medium ${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} truncate`}>
                    {review.reviewer}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {isExtremelyNarrow ? review.timestamp.split(' ')[0].slice(5) : isVeryNarrow ? review.timestamp.split(' ')[0] : review.timestamp}
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap flex-shrink-0">
                  {getRatingBadge(review.rating, isVeryNarrow)}
                  {getStatusBadge(review.status, isVeryNarrow)}
                </div>
              </div>
              <p className={`${isExtremelyNarrow ? 'text-xs line-clamp-1' : isVeryNarrow ? 'text-xs line-clamp-2' : 'text-sm'} text-gray-700 break-words`}>
                {review.text}
              </p>
              {!isShort && (
                <div className={`${isVeryNarrow ? 'mt-1' : 'mt-3'} flex justify-between items-center min-w-0`}>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`${isVeryNarrow ? 'h-5 px-1' : 'h-7 px-2'} min-w-0`}
                      disabled={!canInteract}
                    >
                      <ThumbsUp className={`${isExtremelyNarrow ? 'h-3 w-3' : 'h-4 w-4'} ${!isExtremelyNarrow ? 'mr-1' : ''}`} />
                      {!isExtremelyNarrow && !isVeryNarrow && <span className="text-xs">同意</span>}
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`${isVeryNarrow ? 'h-5 text-xs px-1' : 'h-7 text-xs'}`}
                    disabled={!canInteract}
                  >
                    返信
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center h-full ${isVeryNarrow ? 'p-1' : 'p-4'} text-center`}>
          <AlertTriangle className={`${isExtremelyNarrow ? 'h-6 w-6' : isVeryNarrow ? 'h-8 w-8' : 'h-12 w-12'} text-amber-300 mb-2`} />
          <h3 className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-sm' : 'text-lg'} font-medium text-gray-800 mb-1`}>
            {isExtremelyNarrow ? 'なし' : isVeryNarrow ? 'レビューなし' : 'レビューがありません'}
          </h3>
          {!isVeryNarrow && !isShort && (
            <p className="text-sm text-gray-600 mb-3">このスライドにはまだレビューが提出されていません。</p>
          )}
          <Button size="sm" className={isVeryNarrow ? 'text-xs px-2' : ''}>レビューを依頼</Button>
        </div>
      )}
    </ScrollArea>
  );
};

export default ReviewCommentsList;
