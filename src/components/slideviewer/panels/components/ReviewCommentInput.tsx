
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ReviewCommentInputProps {
  newComment: string;
  currentSlide: number;
  isVeryNarrow?: boolean;
  onCommentChange: (comment: string) => void;
  onSubmitComment: () => void;
}

const ReviewCommentInput: React.FC<ReviewCommentInputProps> = ({
  newComment,
  currentSlide,
  isVeryNarrow = false,
  onCommentChange,
  onSubmitComment
}) => {
  const handleSubmit = () => {
    if (newComment.trim()) {
      onSubmitComment();
    }
  };

  return (
    <div className={`${isVeryNarrow ? 'p-1' : 'p-4'} border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 space-y-3 flex-shrink-0`}>
      <div className="flex items-center justify-between">
        <span className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
          {isVeryNarrow ? 'コメント追加' : '新しいコメントを追加'}
        </span>
      </div>

      <Textarea
        placeholder="コメントを入力してください..."
        value={newComment}
        onChange={(e) => onCommentChange(e.target.value)}
        className={`${isVeryNarrow ? 'text-xs min-h-16' : 'text-sm min-h-20'} resize-none border-2 border-blue-200 focus:border-blue-400`}
      />
      
      <div className="flex justify-end">
        <Button 
          size="sm" 
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          className={`${isVeryNarrow ? 'text-xs h-6 px-2' : 'text-xs h-7 px-3'} bg-purple-500 hover:bg-purple-600`}
        >
          <Send className={`${isVeryNarrow ? 'h-3 w-3 mr-0.5' : 'h-4 w-4 mr-1'}`} />
          投稿
        </Button>
      </div>
    </div>
  );
};

export default ReviewCommentInput;
