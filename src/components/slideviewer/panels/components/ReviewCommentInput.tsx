
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";

interface ReviewCommentInputProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSubmitComment: (comment: string) => void;
  checklistCategories: any;
}

const ReviewCommentInput: React.FC<ReviewCommentInputProps> = ({
  selectedCategory,
  onCategoryChange,
  onSubmitComment,
  checklistCategories
}) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (newComment.trim()) {
      onSubmitComment(newComment);
      setNewComment("");
    }
  };

  return (
    <Card className="border-gray-200">
      <CardContent className="p-3 space-y-3">
        <div className="flex gap-2">
          {Object.entries(checklistCategories).map(([key, category]: [string, any]) => {
            const Icon = category.icon;
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(key)}
                className={`h-8 px-2 text-xs ${
                  selectedCategory === key 
                    ? `bg-${category.color}-100 text-${category.color}-700 border-${category.color}-200` 
                    : "hover:bg-gray-50"
                }`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {category.label}
              </Button>
            );
          })}
        </div>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="レビューコメントを入力してください..."
          className="text-sm resize-none"
          rows={3}
        />
        <Button
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-3 w-3 mr-2" />
          コメント投稿
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReviewCommentInput;
