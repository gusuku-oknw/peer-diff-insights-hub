
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommentMarker {
  id: number;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: string;
}

interface SlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
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
    { id: 1, x: 25, y: 30, text: "タイトルの表現をより具体的にした方がいいと思います。", author: "田中さん", timestamp: "2025年5月20日 14:30" },
    { id: 2, x: 60, y: 50, text: "この図表の数値がわかりにくいです。別の表現方法を検討してはどうでしょうか？", author: "鈴木さん", timestamp: "2025年5月20日 15:45" },
  ],
  2: [
    { id: 3, x: 40, y: 20, text: "この部分はもう少し詳細があると理解しやすくなります。", author: "佐藤さん", timestamp: "2025年5月21日 10:15" },
  ],
  3: [],
  4: [
    { id: 4, x: 70, y: 70, text: "グラフの色使いがわかりやすくて良いと思います。", author: "山本さん", timestamp: "2025年5月22日 16:05" },
  ],
  5: [],
};

const SlideCanvas = ({ currentSlide, zoomLevel = 100 }: SlideCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<CommentMarker[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedComment, setSelectedComment] = useState<CommentMarker | null>(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const { toast } = useToast();

  // Load comments for the current slide
  useEffect(() => {
    setComments(mockComments[currentSlide] || []);
    setOpenPopoverId(null);
  }, [currentSlide]);

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
        author: "自分",
        timestamp: new Date().toLocaleString("ja-JP", {
          year: "numeric",
          month: "long", 
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      };
      
      setSelectedComment(tempComment);
      setOpenPopoverId(tempComment.id);
    }
  };

  const handleCommentSubmit = () => {
    if (selectedComment && newComment.trim() !== "") {
      const updatedComment = {
        ...selectedComment,
        text: newComment.trim()
      };
      
      // Add the new comment to the current slide's comments
      const updatedComments = [...comments, updatedComment];
      setComments(updatedComments);
      mockComments[currentSlide] = updatedComments;
      
      // Reset the form and close popover
      setNewComment("");
      setSelectedComment(null);
      setOpenPopoverId(null);
      
      // Show success toast
      toast({
        title: "コメントが追加されました",
        description: "コメントが正常に保存されました。",
        variant: "default",
      });
    }
  };

  const handleCommentClick = (comment: CommentMarker) => {
    setSelectedComment(comment);
    setOpenPopoverId(comment.id);
  };

  const handlePopoverClose = () => {
    setOpenPopoverId(null);
    // If it was a new comment (no text yet), remove it
    if (selectedComment && !selectedComment.text) {
      setSelectedComment(null);
    }
  };

  return (
    <div className="relative bg-white">
      <div 
        ref={canvasRef} 
        className="relative w-full aspect-video bg-gray-50 cursor-pointer overflow-auto" 
        onClick={handleCanvasClick}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem"
        }}
      >
        {/* Slide image with zoom */}
        <div style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "center center",
          transition: "transform 0.2s ease-in-out",
          width: "100%",
          maxWidth: "1200px",
          position: "relative"
        }}>
          <img
            src={slideMockImages[currentSlide - 1]}
            alt={`スライド ${currentSlide}`}
            className="w-full h-auto object-contain shadow-lg"
            style={{
              borderRadius: "4px"
            }}
          />
          
          {/* Comment markers */}
          {comments.map((comment) => (
            <Popover 
              key={comment.id} 
              open={openPopoverId === comment.id} 
              onOpenChange={(open) => {
                if (open) {
                  setOpenPopoverId(comment.id);
                  setSelectedComment(comment);
                } else if (openPopoverId === comment.id) {
                  handlePopoverClose();
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 text-white border-2 border-white shadow-md"
                  style={{
                    left: `${comment.x}%`,
                    top: `${comment.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommentClick(comment);
                  }}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 z-50">
                <div className="space-y-2">
                  <div className="text-sm font-medium">{comment.author}</div>
                  <div className="text-sm text-gray-500">{comment.timestamp}</div>
                  <p className="pt-2 border-t">{comment.text}</p>
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
                  className="absolute rounded-full w-8 h-8 p-0 bg-green-500 hover:bg-green-600 text-white border-2 border-white shadow-md"
                  style={{
                    left: `${selectedComment.x}%`,
                    top: `${selectedComment.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 z-50">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">新しいコメント</h4>
                  <Textarea
                    placeholder="コメントを入力してください..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handlePopoverClose}>
                      キャンセル
                    </Button>
                    <Button size="sm" onClick={handleCommentSubmit}>
                      保存
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideCanvas;
