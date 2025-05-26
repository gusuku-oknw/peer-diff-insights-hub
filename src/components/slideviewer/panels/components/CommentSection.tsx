
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
    <div className="flex-grow mx-4 mt-3 space-y-3 overflow-hidden">
      <ReviewCommentsList 
        comments={comments}
        checklistCategories={checklistCategories}
      />
      <ReviewCommentInput
        newComment={newComment}
        currentSlide={currentSlide}
        isVeryNarrow={isVeryNarrow}
        onCommentChange={onCommentChange}
        onSubmitComment={onSubmitComment}
      />
    </div>
  );
};

export default CommentSection;
