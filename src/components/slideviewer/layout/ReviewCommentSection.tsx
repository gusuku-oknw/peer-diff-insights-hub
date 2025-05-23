
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReviewCommentSectionProps {
  isNotesPanelOpen: boolean;
  comments: any[];
  commentText: string;
  setCommentText: (text: string) => void;
  handleAddComment: () => void;
  toggleNotesPanel: () => void;
}

const ReviewCommentSection: React.FC<ReviewCommentSectionProps> = ({
  isNotesPanelOpen,
  comments,
  commentText,
  setCommentText,
  handleAddComment,
  toggleNotesPanel
}) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">
          スライドへのコメント
        </h3>
        <Button variant="ghost" size="sm" onClick={toggleNotesPanel}>
          {isNotesPanelOpen ? "コメントを閉じる" : "コメントを開く"}
        </Button>
      </div>

      {isNotesPanelOpen ? (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white shadow-sm border rounded-md p-3">
              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          ))}

          <div className="flex items-end space-x-2">
            <div className="flex-grow">
              <Label htmlFor="comment" className="text-xs text-gray-600">コメントを追加:</Label>
              <Textarea
                id="comment"
                placeholder="スライドに関するコメントを入力してください"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="text-sm"
              />
            </div>
            <Button size="sm" onClick={handleAddComment}>
              コメントする
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          コメントは非表示です。
        </div>
      )}
    </div>
  );
};

export default ReviewCommentSection;
