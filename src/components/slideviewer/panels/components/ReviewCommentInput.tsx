
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [comment, setComment] = React.useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmitComment(comment);
      setComment("");
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          新しいコメントを追加
        </span>
      </div>
      
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(checklistCategories).map(([key, category]: [string, any]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <category.icon className="h-4 w-4" />
                {category.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        placeholder="コメントを入力してください..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="text-sm min-h-20 resize-none border-2 border-blue-200 focus:border-blue-400"
      />
      
      <div className="flex justify-end">
        <Button 
          size="sm" 
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className="text-xs h-7 px-3 bg-purple-500 hover:bg-purple-600"
        >
          <Send className="h-4 w-4 mr-1" />
          投稿
        </Button>
      </div>
    </div>
  );
};

export default ReviewCommentInput;
