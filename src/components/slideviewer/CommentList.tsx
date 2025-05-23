import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useEffect } from "react";

interface Comment {
  id: number;
  slideId: number;
  text: string;
  author: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  isOwn: boolean;
}

interface CommentListProps {
  currentSlide: number;
}

// Mock comments data
const mockAllComments: Comment[] = [
  {
    id: 1,
    slideId: 1,
    text: "タイトルの表現をより具体的にした方がいいと思います。例えば「XX業界におけるYYの影響」という形にするとより読者に伝わりやすくなるでしょう。",
    author: "田中さん",
    timestamp: "2025年5月20日 14:30",
    likes: 3,
    dislikes: 0,
    isOwn: false
  },
  {
    id: 2,
    slideId: 1,
    text: "この図表の数値がわかりにくいです。別の表現方法を検討してはどうでしょうか？棒グラフよりも折れ線グラフの方が変化がわかりやすいと思います。",
    author: "鈴木さん",
    timestamp: "2025年5月20日 15:45",
    likes: 5,
    dislikes: 1,
    isOwn: false
  },
  {
    id: 3,
    slideId: 2,
    text: "この部分はもう少し詳細があると理解しやすくなります。特に「XX」についての背景情報があるとコンテキストがつかみやすいです。",
    author: "佐藤さん",
    timestamp: "2025年5月21日 10:15",
    likes: 2,
    dislikes: 0,
    isOwn: false
  },
  {
    id: 4,
    slideId: 4,
    text: "グラフの色使いがわかりやすくて良いと思います。色弱の方にも配慮されていて素晴らしいです。",
    author: "山本さん",
    timestamp: "2025年5月22日 16:05",
    likes: 7,
    dislikes: 0,
    isOwn: false
  },
  {
    id: 5,
    slideId: 1,
    text: "フォントサイズをもう少し大きくすると視認性が上がり、後方の参加者にも見やすくなると思います。",
    author: "あなた",
    timestamp: "2025年5月23日 09:15",
    likes: 1,
    dislikes: 0,
    isOwn: true
  },
  {
    id: 6,
    slideId: 3,
    text: "このスライドの情報量が多すぎるように感じます。2枚に分割するか、不要な要素を削除した方がメッセージが伝わりやすくなるでしょう。",
    author: "あなた",
    timestamp: "2025年5月23日 09:30",
    likes: 4,
    dislikes: 1,
    isOwn: true
  }
];

const CommentList = ({ currentSlide }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "own">("all");
  
  // Update comments when currentSlide changes
  useEffect(() => {
    setComments(mockAllComments.filter(comment => comment.slideId === currentSlide));
  }, [currentSlide]);
  
  // Filter comments based on view mode
  const filteredComments = viewMode === "own" 
    ? comments.filter(comment => comment.isOwn)
    : comments;

  const handleLike = (commentId: number) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const handleDislike = (commentId: number) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, dislikes: comment.dislikes + 1 }
          : comment
      )
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-gray-500">
          {filteredComments.length} コメント
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode("all")}
          >
            すべて
          </Button>
          <Button 
            variant={viewMode === "own" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode("own")}
          >
            自分のみ
          </Button>
        </div>
      </div>

      {filteredComments.length > 0 ? (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div 
              key={comment.id} 
              className={`bg-white p-4 rounded-lg border ${comment.isOwn ? "border-blue-200 bg-blue-50" : "border-gray-200"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-sm">{comment.author}</div>
                <div className="text-xs text-gray-500">{comment.timestamp}</div>
              </div>
              <p className="text-sm mb-3">{comment.text}</p>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleLike(comment.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" /> 
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>役に立った</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleDislike(comment.id)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" /> 
                        {comment.dislikes > 0 && <span>{comment.dislikes}</span>}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>役に立たなかった</TooltipContent>
                  </Tooltip>
                </div>
                
                {comment.isOwn && (
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> 編集
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          このスライドにはまだコメントがありません
        </div>
      )}
    </div>
  );
};

export default CommentList;
