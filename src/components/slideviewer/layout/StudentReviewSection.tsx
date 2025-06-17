
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare, Send, Plus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentReviewSectionProps {
  currentSlide: number;
  totalSlides: number;
  isNotesPanelOpen: boolean;
  comments: any[];
  commentText: string;
  setCommentText: (text: string) => void;
  handleAddComment: () => void;
  toggleNotesPanel: () => void;
  presenterNotes: Record<number, string>;
  showPresenterNotes: boolean;
  userType: "student" | "enterprise";
}

const StudentReviewSection: React.FC<StudentReviewSectionProps> = ({
  currentSlide,
  totalSlides,
  isNotesPanelOpen,
  comments,
  commentText,
  setCommentText,
  handleAddComment,
  toggleNotesPanel,
  presenterNotes,
  showPresenterNotes,
  userType
}) => {
  const { toast } = useToast();
  const currentNotes = presenterNotes[currentSlide] || "";

  console.log('StudentReviewSection render:', { userType, currentSlide });

  const handleSendReview = () => {
    if (userType === "enterprise") {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはレビューの送信はできません",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "レビューを送信しました",
      description: "コメントが正常に送信されました",
      variant: "default"
    });
  };

  const handleAddCommentWithPermission = () => {
    if (userType === "enterprise") {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはコメントの追加はできません",
        variant: "destructive"
      });
      return;
    }
    
    handleAddComment();
  };

  // Permission check for interactive elements
  const canInteract = userType === "student";

  return (
    <div className="border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            {canInteract ? "学生レビューパネル" : "レビューパネル"}
            {!canInteract && <Eye className="h-4 w-4 text-gray-500" />}
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
              スライド {currentSlide}/{totalSlides}
            </span>
          </h3>
          <Button variant="ghost" size="sm" onClick={toggleNotesPanel}>
            {isNotesPanelOpen ? "パネルを閉じる" : "パネルを開く"}
          </Button>
        </div>

        {/* Permission warning for enterprise users */}
        {!canInteract && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700">
              <Eye className="h-4 w-4" />
              <span className="text-sm">企業ユーザーはレビューの閲覧のみ可能です</span>
            </div>
          </div>
        )}

        {isNotesPanelOpen ? (
          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-white shadow-sm">
              <TabsTrigger value="comments" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                コメント
              </TabsTrigger>
              {showPresenterNotes && (
                <TabsTrigger value="notes" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  台本・メモ
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="comments" className="space-y-3">
              {/* 既存のコメント表示 */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-white shadow-sm border rounded-lg p-3 border-l-4 border-l-blue-400">
                      <p className="text-sm text-gray-700">{comment.text}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        スライド {comment.slideId || currentSlide}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4 bg-white rounded-lg border-2 border-dashed">
                    まだコメントがありません
                  </div>
                )}
              </div>

              {/* コメント入力エリア - Only show for students */}
              {canInteract && (
                <div className="bg-white rounded-lg p-3 border shadow-sm">
                  <Label htmlFor="comment" className="text-xs text-gray-600 font-medium">
                    新しいコメントを追加:
                  </Label>
                  <div className="flex items-end space-x-2 mt-2">
                    <div className="flex-grow">
                      <Textarea
                        id="comment"
                        placeholder="スライドに関するコメントや質問を入力してください..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="text-sm min-h-[60px] resize-none border-gray-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Button 
                        size="sm" 
                        onClick={handleAddCommentWithPermission}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!commentText.trim()}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        追加
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleSendReview}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        送信
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Read-only message for enterprise users */}
              {!canInteract && (
                <div className="bg-white rounded-lg p-3 border shadow-sm">
                  <div className="flex items-center justify-center text-center py-4">
                    <Eye className="h-4 w-4 mr-2 text-amber-600" />
                    <span className="text-sm text-amber-700">
                      企業ユーザーはコメントの閲覧のみ可能です
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            {showPresenterNotes && (
              <TabsContent value="notes" className="space-y-3">
                <div className="bg-white rounded-lg p-4 border shadow-sm min-h-[120px]">
                  {currentNotes ? (
                    <div className="prose prose-sm max-w-none">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        スライド {currentSlide} の台本・メモ
                      </h4>
                      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {currentNotes}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">このスライドには台本・メモがありません</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="text-center text-gray-500 py-2 bg-white rounded-lg border">
            レビューパネルは非表示です
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentReviewSection;
