
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

interface Comment {
  id: string | number;
  text?: string;
  content?: string;
  category?: string;
  timestamp: string | Date;
  resolved?: boolean;
  status?: string;
  rating?: string;
  reviewer?: string;
}

interface ReviewCommentsListProps {
  comments: Comment[];
  checklistCategories: any;
}

const ReviewCommentsList: React.FC<ReviewCommentsListProps> = ({
  comments,
  checklistCategories
}) => {
  // Defensive: fallback to {}
  const safeChecklistCategories = checklistCategories ?? {};

  const formatTimestamp = (timestamp: string | Date) => {
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    return timestamp.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryInfo = (categoryKey: string) => {
    return safeChecklistCategories[categoryKey] || { 
      label: categoryKey, 
      color: 'gray', 
      icon: AlertTriangle 
    };
  };

  return (
    <ScrollArea className="h-full">
      {comments && comments.length > 0 ? (
        <div className="p-4 space-y-4">
          {comments.map((comment) => {
            const categoryInfo = getCategoryInfo(comment.category || 'general');
            const IconComponent = categoryInfo.icon;
            const commentText = comment.text || comment.content || '';
            
            return (
              <div 
                key={comment.id} 
                className="bg-white shadow-sm border rounded-lg p-3 transition-colors border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <Badge 
                      variant="outline" 
                      className={`text-xs bg-${categoryInfo.color}-50 border-${categoryInfo.color}-200 text-${categoryInfo.color}-700`}
                    >
                      {categoryInfo.label}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTimestamp(comment.timestamp)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3 break-words">
                  {commentText}
                </p>
                
                {comment.reviewer && (
                  <div className="text-xs text-gray-600 mb-2">
                    - {comment.reviewer}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span className="text-xs">同意</span>
                    </Button>
                    {(comment.resolved || comment.status === 'completed') && (
                      <Badge variant="outline" className="border-green-500 text-green-700 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" /> 
                        解決済み
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    返信
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-300 mb-2" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            レビューがありません
          </h3>
          <p className="text-sm text-gray-600 mb-3">このスライドにはまだレビューが提出されていません。</p>
          <Button size="sm">レビューを依頼</Button>
        </div>
      )}
    </ScrollArea>
  );
};

export default ReviewCommentsList;
