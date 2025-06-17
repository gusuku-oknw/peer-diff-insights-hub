
import React from "react";
import ReviewCommentsList from "./ReviewCommentsList";
import ReviewCommentInput from "./ReviewCommentInput";

interface CommentSectionProps {
  comments: any[];
  checklistCategories: any;
  newComment: string;
  currentSlide: number;
  isVeryNarrow: boolean;
  onCommentChange: (comment: string) => void;
  onSubmitComment: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  checklistCategories,
  newComment,
  currentSlide,
  isVeryNarrow,
  onCommentChange,
  onSubmitComment
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ReviewCommentsList 
          comments={comments}
          checklistCategories={checklistCategories}
        />
      </div>
      <div className="flex-shrink-0">
        <ReviewCommentInput
          newComment={newComment}
          currentSlide={currentSlide}
          isVeryNarrow={isVeryNarrow}
          onCommentChange={onCommentChange}
          onSubmitComment={onSubmitComment}
        />
      </div>
    </div>
  );
};

export default CommentSection;
