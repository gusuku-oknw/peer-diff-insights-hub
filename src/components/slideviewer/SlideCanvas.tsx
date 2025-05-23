
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Plus, Tag, ThumbsUp, AlertCircle, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface CommentMarker {
  id: number;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: string;
  category?: "design" | "content" | "typo" | "question" | "other";
  resolved?: boolean;
}

interface SlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
}

// Mock slide images for demonstration purposes
const slideMockImages = [
  "https://placehold.co/1600x900/e2e8f0/1e293b?text=Q4+Presentation",
  "https://placehold.co/1600x900/e2e8f0/1e293b?text=Company+Overview",
  "https://placehold.co/1600x900/e2e8f0/1e293b?text=Financial+Results",
  "https://placehold.co/1600x900/e2e8f0/1e293b?text=Future+Strategy",
  "https://placehold.co/1600x900/e2e8f0/1e293b?text=Q%26A",
];

// Mock comment data
const mockComments: Record<number, CommentMarker[]> = {
  1: [
    { 
      id: 1, 
      x: 25, 
      y: 30, 
      text: "タイトルの表現をより具体的にした方がいいと思います。", 
      author: "田中さん", 
      timestamp: "2025年5月20日 14:30",
      category: "content"
    },
    { 
      id: 2, 
      x: 60, 
      y: 50, 
      text: "この図表の数値がわかりにくいです。別の表現方法を検討してはどうでしょうか？", 
      author: "鈴木さん", 
      timestamp: "2025年5月20日 15:45",
      category: "design" 
    },
  ],
  2: [
    { 
      id: 3, 
      x: 40, 
      y: 20, 
      text: "この部分はもう少し詳細があると理解しやすくなります。", 
      author: "佐藤さん", 
      timestamp: "2025年5月21日 10:15",
      category: "content",
      resolved: true 
    },
  ],
  3: [],
  4: [
    { 
      id: 4, 
      x: 70, 
      y: 70, 
      text: "グラフの色使いがわかりやすくて良いと思います。", 
      author: "山本さん", 
      timestamp: "2025年5月22日 16:05",
      category: "design" 
    },
  ],
  5: [],
};

// Get category color
const getCategoryColor = (category?: string) => {
  switch(category) {
    case "design":
      return "bg-purple-500";
    case "content":
      return "bg-blue-500";
    case "typo":
      return "bg-green-500";
    case "question":
      return "bg-amber-500";
    default:
      return "bg-gray-500";
  }
};

// Format category label
const getCategoryLabel = (category?: string) => {
  switch(category) {
    case "design":
      return "デザイン";
    case "content":
      return "内容";
    case "typo":
      return "誤字・脱字";
    case "question":
      return "質問";
    default:
      return "その他";
  }
};

const SlideCanvas = ({ currentSlide, zoomLevel = 100, editable = false, userType = "enterprise" }: SlideCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<CommentMarker[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentCategory, setCommentCategory] = useState<string>("other");
  const [selectedComment, setSelectedComment] = useState<CommentMarker | null>(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const { toast } = useToast();
  const [highlightedArea, setHighlightedArea] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  
  // 学生ユーザーのための進捗状況
  const [commentedSlides, setCommentedSlides] = useState<number[]>([]);

  // Load comments for the current slide
  useEffect(() => {
    setComments(mockComments[currentSlide] || []);
    setOpenPopoverId(null);
    setHighlightedArea(null);
  }, [currentSlide]);

  // Track which slides the student has commented on
  useEffect(() => {
    if (userType === "student") {
      const studentCommentedSlides = Object.keys(mockComments).filter(slideId => {
        return mockComments[Number(slideId)].some(comment => comment.author === "あなた");
      }).map(Number);
      
      setCommentedSlides(studentCommentedSlides);
    }
  }, [userType]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Create a temporary selected comment to position the popover
      const tempComment = {
        id: Date.now(),
        x,
        y,
        text: "",
        author: userType === "student" ? "あなた" : "企業ユーザー",
        timestamp: new Date().toLocaleString("ja-JP", {
          year: "numeric",
          month: "long", 
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        category: commentCategory as "design" | "content" | "typo" | "question" | "other"
      };
      
      setSelectedComment(tempComment);
      setOpenPopoverId(tempComment.id);

      // Create a highlight area around the clicked point
      setHighlightedArea({
        x: x - 5,
        y: y - 5,
        width: 10,
        height: 10
      });
    }
  };

  const handleCommentSubmit = () => {
    if (selectedComment && newComment.trim() !== "") {
      const updatedComment = {
        ...selectedComment,
        text: newComment.trim(),
        category: commentCategory as "design" | "content" | "typo" | "question" | "other"
      };
      
      // Add the new comment to the current slide's comments
      const updatedComments = [...comments, updatedComment];
      setComments(updatedComments);
      mockComments[currentSlide] = updatedComments;
      
      // Update progress for student users
      if (userType === "student" && !commentedSlides.includes(currentSlide)) {
        setCommentedSlides([...commentedSlides, currentSlide]);
      }
      
      // Reset the form and close popover
      setNewComment("");
      setSelectedComment(null);
      setOpenPopoverId(null);
      setHighlightedArea(null);
      
      // Show success toast
      toast({
        title: "コメントが追加されました",
        description: `${getCategoryLabel(commentCategory)}カテゴリのコメントが保存されました。`,
        variant: "default",
      });
    }
  };

  const handleCommentClick = (comment: CommentMarker) => {
    setSelectedComment(comment);
    setOpenPopoverId(comment.id);
    
    // Create a highlight area around the clicked comment
    setHighlightedArea({
      x: comment.x - 5,
      y: comment.y - 5,
      width: 10,
      height: 10
    });
  };

  const handleToggleResolved = (comment: CommentMarker) => {
    const updatedComment = { ...comment, resolved: !comment.resolved };
    
    // Update the comment in the current slide's comments
    const updatedComments = comments.map(c => 
      c.id === comment.id ? updatedComment : c
    );
    
    setComments(updatedComments);
    mockComments[currentSlide] = updatedComments;
    
    // Show success toast
    toast({
      title: updatedComment.resolved ? "コメントが解決済みにマークされました" : "コメントが未解決に戻されました",
      description: updatedComment.resolved ? "フィードバックに対応しました" : "フィードバックを再検討します",
      variant: "default",
    });
  };

  const handlePopoverClose = () => {
    setOpenPopoverId(null);
    setHighlightedArea(null);
    // If it was a new comment (no text yet), remove it
    if (selectedComment && !selectedComment.text) {
      setSelectedComment(null);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      {userType === "student" && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-blue-800">
              {commentedSlides.length} / 5 スライド完了
            </span>
            <div className="ml-3 bg-gray-200 rounded-full h-2 w-32">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{width: `${(commentedSlides.length / 5) * 100}%`}}
              ></div>
            </div>
          </div>
          <span className="text-xs text-blue-600">
            残り {5 - commentedSlides.length} スライド
          </span>
        </div>
      )}
      
      <div 
        ref={canvasRef} 
        className={`relative w-full aspect-video bg-gray-100 ${editable ? "cursor-crosshair" : "cursor-default"} overflow-hidden`} 
        onClick={editable ? handleCanvasClick : undefined}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0.5rem"
        }}
      >
        {/* Slide image with zoom */}
        <div 
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "center center",
            transition: "transform 0.3s ease-in-out",
            width: "100%",
            maxWidth: "1200px",
            position: "relative"
          }}
          className="drop-shadow-xl"
        >
          <img
            src={slideMockImages[currentSlide - 1]}
            alt={`スライド ${currentSlide}`}
            className="w-full h-auto object-contain rounded"
            style={{ borderRadius: "4px" }}
          />
          
          {/* Highlight area for selected comment */}
          {highlightedArea && (
            <div 
              className="absolute border-2 border-yellow-400 bg-yellow-100 bg-opacity-30 animate-pulse pointer-events-none"
              style={{
                left: `${highlightedArea.x}%`,
                top: `${highlightedArea.y}%`,
                width: `${highlightedArea.width}%`,
                height: `${highlightedArea.height}%`,
                transform: "translate(-50%, -50%)",
                borderRadius: "4px",
                zIndex: 10
              }}
            />
          )}
          
          {/* Comment markers */}
          {comments.map((comment) => (
            <Popover 
              key={comment.id} 
              open={openPopoverId === comment.id} 
              onOpenChange={(open) => {
                if (open) {
                  setOpenPopoverId(comment.id);
                  setSelectedComment(comment);
                  setHighlightedArea({
                    x: comment.x - 5,
                    y: comment.y - 5,
                    width: 10,
                    height: 10
                  });
                } else if (openPopoverId === comment.id) {
                  handlePopoverClose();
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`absolute rounded-full w-8 h-8 p-0 ${getCategoryColor(comment.category)} hover:opacity-90 text-white border-2 border-white shadow-lg transition-all ${comment.resolved ? 'opacity-50' : 'opacity-100'}`}
                  style={{
                    left: `${comment.x}%`,
                    top: `${comment.y}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 20
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommentClick(comment);
                  }}
                >
                  {comment.resolved ? (
                    <ThumbsUp className="h-4 w-4" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-white shadow-xl rounded-lg border-gray-200 z-50">
                <div className={`px-4 py-3 ${comment.category ? `bg-${comment.category}-50` : 'bg-blue-50'} border-b border-blue-100`}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-blue-900">
                      {userType === "enterprise" && comment.author !== "企業ユーザー" ? (
                        `Student #${comment.id % 5 + 1}`
                      ) : (
                        comment.author
                      )}
                    </div>
                    <Badge variant="secondary" className={`${getCategoryColor(comment.category)} text-white`}>
                      {getCategoryLabel(comment.category)}
                    </Badge>
                  </div>
                  <div className="text-xs text-blue-700 opacity-80">{comment.timestamp}</div>
                </div>
                <div className="p-4">
                  <p className="text-sm leading-relaxed">{comment.text}</p>
                  
                  {/* Comment actions */}
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "いいね！",
                          description: "コメントに「いいね」しました",
                        });
                      }}
                      className="text-blue-600 border-blue-200"
                    >
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      いいね！
                    </Button>
                    
                    {(userType === "enterprise" || (userType === "student" && comment.author === "あなた")) && (
                      <Button
                        variant={comment.resolved ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleResolved(comment)}
                        className={comment.resolved ? "bg-green-600" : "text-green-600 border-green-200"}
                      >
                        {comment.resolved ? "解決済み" : "解決する"}
                      </Button>
                    )}
                    
                    {userType === "enterprise" && !comment.resolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-200 text-purple-600"
                        onClick={() => {
                          toast({
                            title: "再レビュー依頼を送信しました",
                            description: "学生に修正依頼が通知されます",
                            variant: "default"
                          });
                        }}
                      >
                        再レビュー依頼
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
          
          {/* New comment popover */}
          {selectedComment && !selectedComment.text && (
            <Popover 
              open={openPopoverId === selectedComment.id} 
              onOpenChange={(open) => {
                if (!open) handlePopoverClose();
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`absolute rounded-full w-8 h-8 p-0 ${getCategoryColor(commentCategory)} hover:opacity-90 text-white border-2 border-white shadow-lg ring-2 ring-green-200 hover:ring-green-300 transition-all animate-pulse`}
                  style={{
                    left: `${selectedComment.x}%`,
                    top: `${selectedComment.y}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 20
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-white shadow-xl rounded-lg border-gray-200 z-50">
                <div className="px-4 py-3 bg-green-50 border-b border-green-100">
                  <h4 className="font-medium text-sm text-green-900">新しいコメント</h4>
                  <p className="text-xs text-green-700 mt-1">このスライドについてのフィードバックを入力してください</p>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <label htmlFor="comment-category" className="block text-sm font-medium text-gray-700 mb-1">
                      カテゴリ
                    </label>
                    <Select defaultValue={commentCategory} onValueChange={setCommentCategory}>
                      <SelectTrigger id="comment-category" className="w-full">
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design">
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                            デザイン
                          </div>
                        </SelectItem>
                        <SelectItem value="content">
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            内容
                          </div>
                        </SelectItem>
                        <SelectItem value="typo">
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            誤字・脱字
                          </div>
                        </SelectItem>
                        <SelectItem value="question">
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            質問
                          </div>
                        </SelectItem>
                        <SelectItem value="other">
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                            その他
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea
                    placeholder="コメントを入力してください..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[120px] border-gray-300 focus:border-green-300 focus:ring-green-200"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={handlePopoverClose}>
                      キャンセル
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleCommentSubmit}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      保存
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          {/* Editable mode overlay message */}
          {editable && (
            <div className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
              <Pencil className="h-3 w-3" />
              編集モード
            </div>
          )}
          
          {/* Notification badge for student UI when slide needs commenting */}
          {userType === "student" && !commentedSlides.includes(currentSlide) && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              コメント未投稿
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideCanvas;
