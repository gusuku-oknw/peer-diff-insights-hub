
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, CheckCircle2, AlertCircle, Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewComment {
  id: string;
  type: "slide" | "script" | "integration";
  content: string;
  timestamp: Date;
  resolved: boolean;
}

interface IntegratedReviewPanelProps {
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
}

const IntegratedReviewPanel: React.FC<IntegratedReviewPanelProps> = ({
  currentSlide,
  totalSlides,
  presenterNotes,
  isNarrow = false,
  isVeryNarrow = false
}) => {
  const [reviewType, setReviewType] = useState<"slide" | "script" | "integration">("integration");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<ReviewComment[]>([
    {
      id: "1",
      type: "integration",
      content: "スライドのグラフと台本の説明が一致していません。数値を確認してください。",
      timestamp: new Date(),
      resolved: false
    },
    {
      id: "2",
      type: "script",
      content: "この部分の説明時間が長すぎます。もう少し簡潔にまとめてはいかがでしょうか。",
      timestamp: new Date(),
      resolved: false
    }
  ]);
  const { toast } = useToast();

  const addComment = () => {
    if (newComment.trim()) {
      const comment: ReviewComment = {
        id: Date.now().toString(),
        type: reviewType,
        content: newComment,
        timestamp: new Date(),
        resolved: false
      };
      setComments([...comments, comment]);
      setNewComment("");
      toast({
        title: "コメントを追加しました",
        description: `${getTypeLabel(reviewType)}に関するコメントが追加されました`,
      });
    }
  };

  const toggleResolved = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, resolved: !comment.resolved }
        : comment
    ));
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "slide": return "スライド";
      case "script": return "台本";
      case "integration": return "統合レビュー";
      default: return "";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "slide": return <FileText className="h-3 w-3" />;
      case "script": return <MessageSquare className="h-3 w-3" />;
      case "integration": return <CheckCircle2 className="h-3 w-3" />;
      default: return null;
    }
  };

  const filteredComments = comments.filter(comment => 
    reviewType === "integration" || comment.type === reviewType
  );

  return (
    <div className="h-full bg-white shadow-sm flex flex-col min-w-0">
      {/* Header */}
      <div className={`${isVeryNarrow ? 'px-1 py-1' : 'px-4 py-3'} border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-between flex-shrink-0`}>
        <h3 className={`font-medium ${isVeryNarrow ? 'text-xs' : 'text-sm'} flex items-center text-purple-800 min-w-0`}>
          <CheckCircle2 className={`${isVeryNarrow ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-purple-600 flex-shrink-0`} />
          {!isVeryNarrow && <span className="truncate">統合レビュー</span>}
        </h3>
        <Badge variant="outline" className="text-xs">
          {currentSlide}/{totalSlides}
        </Badge>
      </div>

      {/* Review type selector */}
      {!isVeryNarrow && (
        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
          <div className="flex space-x-1">
            {[
              { key: "integration", label: "統合", icon: CheckCircle2 },
              { key: "slide", label: "スライド", icon: FileText },
              { key: "script", label: "台本", icon: MessageSquare }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={reviewType === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setReviewType(key as any)}
                className={`h-7 px-2 text-xs ${
                  reviewType === key 
                    ? "bg-purple-100 text-purple-700 border-purple-200" 
                    : "hover:bg-purple-50"
                }`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-grow min-h-0">
        <div className={`${isVeryNarrow ? 'p-1' : 'p-4'} space-y-3`}>
          {/* Integration analysis (only for integration view) */}
          {reviewType === "integration" && !isVeryNarrow && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-800 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  整合性チェック
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs text-orange-700">
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span>スライド内容と台本の一致</span>
                    <Badge variant="destructive" className="text-xs">要確認</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span>発表時間の配分</span>
                    <Badge variant="secondary" className="text-xs">適切</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span>視覚的サポート</span>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-700">良好</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments list */}
          <div className="space-y-2">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className={`${comment.resolved ? 'opacity-60' : ''} border-gray-200`}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          comment.type === 'slide' ? 'border-blue-200 text-blue-600' :
                          comment.type === 'script' ? 'border-green-200 text-green-600' :
                          'border-purple-200 text-purple-600'
                        }`}
                      >
                        {getTypeIcon(comment.type)}
                        {getTypeLabel(comment.type)}
                      </Badge>
                      {comment.resolved && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                          解決済み
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleResolved(comment.id)}
                      className="h-6 w-6 p-0"
                    >
                      <CheckCircle2 className={`h-3 w-3 ${comment.resolved ? 'text-green-600' : 'text-gray-400'}`} />
                    </Button>
                  </div>
                  <p className={`text-sm ${comment.resolved ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {comment.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add comment */}
          <Card className="border-gray-200">
            <CardContent className="p-3">
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`${getTypeLabel(reviewType)}に関するコメントを入力...`}
                  className="text-sm resize-none"
                  rows={3}
                />
                <Button
                  onClick={addComment}
                  size="sm"
                  disabled={!newComment.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  コメント追加
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default IntegratedReviewPanel;
