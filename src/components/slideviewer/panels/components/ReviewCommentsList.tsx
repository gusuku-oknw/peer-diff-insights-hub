
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  category: string;
  timestamp: Date;
  resolved: boolean;
}

interface ReviewCommentsListProps {
  comments: Comment[];
  checklistCategories: any;
}

const ReviewCommentsList: React.FC<ReviewCommentsListProps> = ({
  comments,
  checklistCategories
}) => {
  return (
    <ScrollArea className="flex-grow h-[300px]">
      <div className="space-y-2 pr-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id} className={`${comment.resolved ? 'opacity-60' : ''} border-gray-200`}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {checklistCategories[comment.category as keyof typeof checklistCategories]?.label || comment.category}
                  </Badge>
                </div>
                <p className={`text-sm ${comment.resolved ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {comment.content}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">まだコメントがありません</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ReviewCommentsList;
