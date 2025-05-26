
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ReviewCommentInputProps {
  newComment: string;
  currentSlide: number;
  isVeryNarrow?: boolean;
  onCommentChange: (value: string) => void;
  onSubmitComment: () => void;
}

const ReviewCommentInput: React.FC<ReviewCommentInputProps> = ({
  newComment,
  currentSlide,
  isVeryNarrow = false,
  onCommentChange,
  onSubmitComment
}) => {
  return (
    <div className={`${isVeryNarrow ? 'p-1' : 'p-3'} border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
            新しいコメントを追加
          </span>
          <span className={`${isVeryNarrow ? 'text-xs' : 'text-xs'} text-gray-500 bg-white px-2 py-1 rounded-full`}>
            スライド {currentSlide}
          </span>
        </div>
        <Textarea
          placeholder="このスライドについてのコメントや改善点を入力してください..."
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
          className={`${isVeryNarrow ? 'text-xs min-h-16' : 'text-sm min-h-20'} resize-none border-2 border-blue-200 focus:border-blue-400`}
        />
        <div className="flex justify-between items-center">
          <span className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} text-gray-500`}>
            {isVeryNarrow ? '台本参考に' : 'チェックリストや台本を参考にしてください'}
          </span>
          <Button 
            size="sm" 
            onClick={onSubmitComment}
            disabled={!newComment.trim()}
            className={`${isVeryNarrow ? 'text-xs h-6 px-2' : 'text-xs h-7 px-3'} bg-purple-500 hover:bg-purple-600`}
          >
            <Send className={`${isVeryNarrow ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1'}`} />
            投稿
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCommentInput;
