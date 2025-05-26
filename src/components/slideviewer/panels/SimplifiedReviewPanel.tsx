
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  FileText, 
  Palette, 
  Eye,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  category: string;
  timestamp: Date;
  resolved: boolean;
}

interface SimplifiedReviewPanelProps {
  currentSlide: number;
  totalSlides: number;
  userType: "student" | "enterprise";
  panelWidth?: number;
  panelHeight?: number;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
}

const checklistCategories = {
  structure: {
    icon: FileText,
    label: "構成",
    color: "blue",
    items: [
      "タイトルは明確で理解しやすいか",
      "内容の流れは論理的か",
      "重要なポイントが強調されているか"
    ]
  },
  design: {
    icon: Palette,
    label: "デザイン",
    color: "green",
    items: [
      "色使いは見やすく統一されているか",
      "フォントサイズは適切か",
      "レイアウトはバランスが取れているか"
    ]
  },
  content: {
    icon: MessageSquare,
    label: "文言",
    color: "purple",
    items: [
      "文章は簡潔で分かりやすいか",
      "専門用語の説明は十分か",
      "誤字脱字はないか"
    ]
  }
};

const SimplifiedReviewPanel: React.FC<SimplifiedReviewPanelProps> = ({
  currentSlide,
  totalSlides,
  userType,
  isNarrow = false,
  isVeryNarrow = false
}) => {
  const [activeTab, setActiveTab] = useState("comments");
  const [newComment, setNewComment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("structure");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      content: "スライドのグラフと説明がとても分かりやすいです",
      category: "structure",
      timestamp: new Date(),
      resolved: false
    }
  ]);
  const { toast } = useToast();

  const canInteract = userType === "student";

  const handleSubmitComment = () => {
    if (!canInteract) {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはコメントの投稿はできません",
        variant: "destructive"
      });
      return;
    }

    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        category: selectedCategory,
        timestamp: new Date(),
        resolved: false
      };
      setComments([...comments, comment]);
      setNewComment("");
      toast({
        title: "コメントを投稿しました",
        description: "レビューが正常に追加されました",
        variant: "default"
      });
    }
  };

  const toggleResolved = (commentId: string) => {
    if (!canInteract) return;
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, resolved: !comment.resolved }
        : comment
    ));
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Simplified Header */}
      <div className={`${isVeryNarrow ? 'px-2 py-1' : 'px-4 py-3'} border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between flex-shrink-0`}>
        <div className="flex items-center gap-2">
          <MessageSquare className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />
          {!isVeryNarrow && (
            <h3 className="font-medium text-sm text-blue-800">
              {canInteract ? "レビュー" : "レビュー閲覧"}
            </h3>
          )}
          {!canInteract && <Eye className="h-3 w-3 text-amber-600" />}
        </div>
        <Badge variant="outline" className="text-xs">
          {currentSlide}/{totalSlides}
        </Badge>
      </div>

      {/* Permission Notice for Enterprise Users */}
      {!canInteract && !isVeryNarrow && (
        <div className="mx-4 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-700 text-sm">
            <Eye className="h-4 w-4" />
            <span>企業ユーザーは閲覧専用です</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-h-0">
        {canInteract && !isVeryNarrow ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
            <TabsList className="mx-4 mt-3 grid grid-cols-2 bg-gray-50">
              <TabsTrigger value="comments" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                コメント
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                チェック
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="flex-grow mx-4 mt-3 space-y-3 overflow-hidden">
              <ScrollArea className="flex-grow">
                <div className="space-y-2 pr-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <Card key={comment.id} className={`${comment.resolved ? 'opacity-60' : ''} border-gray-200`}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {checklistCategories[comment.category as keyof typeof checklistCategories]?.label || comment.category}
                            </Badge>
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
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">まだコメントがありません</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Comment Input */}
              <Card className="border-gray-200">
                <CardContent className="p-3 space-y-3">
                  <div className="flex gap-2">
                    {Object.entries(checklistCategories).map(([key, category]) => {
                      const Icon = category.icon;
                      return (
                        <Button
                          key={key}
                          variant={selectedCategory === key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(key)}
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
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-3 w-3 mr-2" />
                    コメント投稿
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checklist" className="flex-grow mx-4 mt-3 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">
                  {Object.entries(checklistCategories).map(([key, category]) => {
                    const Icon = category.icon;
                    return (
                      <Card key={key} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Icon className={`h-4 w-4 text-${category.color}-600`} />
                            <h4 className="font-medium text-gray-800">{category.label}</h4>
                          </div>
                          <div className="space-y-2">
                            {category.items.map((item, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                                <CheckCircle2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          /* Simplified view for very narrow panels or enterprise users */
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
        )}
      </div>
    </div>
  );
};

export default SimplifiedReviewPanel;
