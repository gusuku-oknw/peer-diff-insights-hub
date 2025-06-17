
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  category: string;
  timestamp: Date;
  resolved: boolean;
}

interface ReviewSimplifiedViewProps {
  comments: Comment[];
  checklistCategories: any;
}

const ReviewSimplifiedView: React.FC<ReviewSimplifiedViewProps> = ({
  comments,
  checklistCategories
}) => {
  return (
    <ScrollArea className="flex-grow">
      <div className="p-4 space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id} className="border-gray-200">
              <CardContent className="p-3">
                <p className="text-sm text-gray-700">{comment.content}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {checklistCategories[comment.category as keyof typeof checklistCategories]?.label || comment.category}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">コメントなし</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ReviewSimplifiedView;
