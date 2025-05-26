
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MessageSquare, 
  Send, 
  FileText, 
  Palette, 
  Eye,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  category: string;
  timestamp: Date;
  resolved: boolean;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
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
      { id: "s1", text: "タイトルは明確で理解しやすいか", checked: false },
      { id: "s2", text: "内容の流れは論理的か", checked: false },
      { id: "s3", text: "重要なポイントが強調されているか", checked: false }
    ]
  },
  design: {
    icon: Palette,
    label: "デザイン",
    color: "green",
    items: [
      { id: "d1", text: "色使いは見やすく統一されているか", checked: false },
      { id: "d2", text: "フォントサイズは適切か", checked: false },
      { id: "d3", text: "レイアウトはバランスが取れているか", checked: false }
    ]
  },
  content: {
    icon: MessageSquare,
    label: "文言",
    color: "purple",
    items: [
      { id: "c1", text: "文章は簡潔で分かりやすいか", checked: false },
      { id: "c2", text: "専門用語の説明は十分か", checked: false },
      { id: "c3", text: "誤字脱字はないか", checked: false }
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
  const [activeTab, setActiveTab] = useState("review");
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
  const [checklistState, setChecklistState] = useState(() => {
    const initialState: Record<string, ChecklistItem[]> = {};
    Object.entries(checklistCategories).forEach(([key, category]) => {
      initialState[key] = [...category.items];
    });
    return initialState;
  });

  const { toast } = useToast();

  const canInteract = userType === "student";

  const handleCheckboxChange = (categoryKey: string, itemId: string, checked: boolean) => {
    if (!canInteract) return;
    
    setChecklistState(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map(item =>
        item.id === itemId ? { ...item, checked } : item
      )
    }));

    if (checked) {
      toast({
        title: "チェック完了",
        description: "レビュー項目をチェックしました",
        variant: "default"
      });
    }
  };

  const getCompletionRate = (categoryKey: string) => {
    const items = checklistState[categoryKey] || [];
    const completed = items.filter(item => item.checked).length;
    return Math.round((completed / items.length) * 100);
  };

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

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Simplified Header with Progress */}
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
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {currentSlide}/{totalSlides}
          </Badge>
        </div>
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
              <TabsTrigger value="review" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                レビュー
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                チェック
              </TabsTrigger>
            </TabsList>

            <TabsContent value="review" className="flex-grow mx-4 mt-3 space-y-3 overflow-hidden">
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
                    const completionRate = getCompletionRate(key);
                    const items = checklistState[key] || [];
                    
                    return (
                      <Card key={key} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 text-${category.color}-600`} />
                              <h4 className="font-medium text-gray-800">{category.label}</h4>
                            </div>
                            <Badge variant={completionRate === 100 ? "default" : "secondary"} className="text-xs">
                              {completionRate}%
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                                <Checkbox
                                  id={item.id}
                                  checked={item.checked}
                                  onCheckedChange={(checked) => handleCheckboxChange(key, item.id, !!checked)}
                                  className="mt-0.5 flex-shrink-0"
                                />
                                <label 
                                  htmlFor={item.id}
                                  className={`text-sm cursor-pointer ${
                                    item.checked 
                                      ? 'text-gray-500 line-through' 
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {item.text}
                                </label>
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
