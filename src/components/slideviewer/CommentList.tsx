
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, ThumbsUp, ThumbsDown, MessageSquare, Filter, Calendar, CheckSquare, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: number;
  slideId: number;
  text: string;
  author: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  isOwn: boolean;
  category?: "design" | "content" | "typo" | "question" | "other";
  resolved?: boolean;
}

interface CommentListProps {
  currentSlide: number;
  userType?: "student" | "enterprise";
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
    isOwn: false,
    category: "content"
  },
  {
    id: 2,
    slideId: 1,
    text: "この図表の数値がわかりにくいです。別の表現方法を検討してはどうでしょうか？棒グラフよりも折れ線グラフの方が変化がわかりやすいと思います。",
    author: "鈴木さん",
    timestamp: "2025年5月20日 15:45",
    likes: 5,
    dislikes: 1,
    isOwn: false,
    category: "design",
    resolved: true
  },
  {
    id: 3,
    slideId: 2,
    text: "この部分はもう少し詳細があると理解しやすくなります。特に「XX」についての背景情報があるとコンテキストがつかみやすいです。",
    author: "佐藤さん",
    timestamp: "2025年5月21日 10:15",
    likes: 2,
    dislikes: 0,
    isOwn: false,
    category: "content",
    resolved: false
  },
  {
    id: 4,
    slideId: 4,
    text: "グラフの色使いがわかりやすくて良いと思います。色弱の方にも配慮されていて素晴らしいです。",
    author: "山本さん",
    timestamp: "2025年5月22日 16:05",
    likes: 7,
    dislikes: 0,
    isOwn: false,
    category: "design",
    resolved: true
  },
  {
    id: 5,
    slideId: 1,
    text: "フォントサイズをもう少し大きくすると視認性が上がり、後方の参加者にも見やすくなると思います。",
    author: "あなた",
    timestamp: "2025年5月23日 09:15",
    likes: 1,
    dislikes: 0,
    isOwn: true,
    category: "design"
  },
  {
    id: 6,
    slideId: 3,
    text: "このスライドの情報量が多すぎるように感じます。2枚に分割するか、不要な要素を削除した方がメッセージが伝わりやすくなるでしょう。",
    author: "あなた",
    timestamp: "2025年5月23日 09:30",
    likes: 4,
    dislikes: 1,
    isOwn: true,
    category: "content"
  },
  {
    id: 7,
    slideId: 2,
    text: "「インパクト」のスペルが間違っています。「Inpact」ではなく「Impact」が正しいです。",
    author: "田中さん",
    timestamp: "2025年5月23日 11:20",
    likes: 2,
    dislikes: 0,
    isOwn: false,
    category: "typo",
    resolved: true
  }
];

// Get category color
const getCategoryColor = (category?: string) => {
  switch(category) {
    case "design":
      return "bg-purple-500 text-white";
    case "content":
      return "bg-blue-500 text-white";
    case "typo":
      return "bg-green-500 text-white";
    case "question":
      return "bg-amber-500 text-white";
    default:
      return "bg-gray-500 text-white";
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

const CommentList = ({ currentSlide, userType = "enterprise" }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [viewFilter, setViewFilter] = useState<"all" | "own" | "resolved" | "unresolved">("all");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [showDiff, setShowDiff] = useState(false);

  // Load and filter comments
  useEffect(() => {
    // Get all comments for this slide
    let filtered = mockAllComments.filter(comment => comment.slideId === currentSlide);
    
    // For student users, show only their own comments by default
    if (userType === "student" && viewFilter === "all") {
      setViewFilter("own");
    }
    
    // Apply view filter
    switch(viewFilter) {
      case "own":
        filtered = filtered.filter(comment => comment.isOwn);
        break;
      case "resolved":
        filtered = filtered.filter(comment => comment.resolved);
        break;
      case "unresolved":
        filtered = filtered.filter(comment => !comment.resolved);
        break;
    }
    
    // Apply category filters if any are selected
    if (categoryFilters.length > 0) {
      filtered = filtered.filter(comment => 
        comment.category ? categoryFilters.includes(comment.category) : false
      );
    }
    
    setComments(filtered);
  }, [currentSlide, viewFilter, categoryFilters, userType]);

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

  const toggleResolvedStatus = (commentId: number) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, resolved: !comment.resolved }
          : comment
      )
    );
    
    // Also update the mock data
    const commentIndex = mockAllComments.findIndex(c => c.id === commentId);
    if (commentIndex >= 0) {
      mockAllComments[commentIndex].resolved = !mockAllComments[commentIndex].resolved;
    }
  };

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Whether a category is checked
  const isCategoryChecked = (category: string) => {
    return categoryFilters.includes(category);
  };

  // Count comments for each tab
  const allCommentsCount = mockAllComments.filter(c => c.slideId === currentSlide).length;
  const ownCommentsCount = mockAllComments.filter(c => c.slideId === currentSlide && c.isOwn).length;
  const resolvedCommentsCount = mockAllComments.filter(c => c.slideId === currentSlide && c.resolved).length;
  const unresolvedCommentsCount = mockAllComments.filter(c => c.slideId === currentSlide && !c.resolved).length;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-purple-600" />
            <div className="text-sm font-medium">
              {comments.length} コメント
            </div>
          </div>
          
          {/* 企業向け機能：差分表示切替 */}
          {userType === "enterprise" && (
            <Button
              variant={showDiff ? "default" : "outline"}
              size="sm"
              className={showDiff ? "bg-blue-600" : ""}
              onClick={() => setShowDiff(!showDiff)}
            >
              <span className="text-xs">差分表示 {showDiff ? "ON" : "OFF"}</span>
            </Button>
          )}
          
          {/* Category filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                <span className="text-sm">カテゴリ</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>カテゴリーでフィルター</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={isCategoryChecked("design")}
                onCheckedChange={() => toggleCategoryFilter("design")}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2 inline-block"></span>
                デザイン
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={isCategoryChecked("content")}
                onCheckedChange={() => toggleCategoryFilter("content")}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 inline-block"></span>
                内容
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={isCategoryChecked("typo")}
                onCheckedChange={() => toggleCategoryFilter("typo")}
              >
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 inline-block"></span>
                誤字・脱字
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={isCategoryChecked("question")}
                onCheckedChange={() => toggleCategoryFilter("question")}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 inline-block"></span>
                質問
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={isCategoryChecked("other")}
                onCheckedChange={() => toggleCategoryFilter("other")}
              >
                <span className="w-2 h-2 rounded-full bg-gray-500 mr-2 inline-block"></span>
                その他
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setCategoryFilters([])}
                className="text-center font-medium text-purple-600"
              >
                すべて表示
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* View tabs - 学生ユーザーの場合はシンプル化 */}
        <Tabs value={viewFilter} onValueChange={(value) => setViewFilter(value as any)}>
          <TabsList className={`w-full grid ${userType === "student" ? "grid-cols-2" : "grid-cols-4"}`}>
            {userType === "enterprise" && (
              <TabsTrigger value="all" className="flex flex-col items-center py-1">
                <span className="text-xs font-semibold">{allCommentsCount}</span>
                <span className="text-xs">すべて</span>
              </TabsTrigger>
            )}
            
            <TabsTrigger value="own" className="flex flex-col items-center py-1">
              <span className="text-xs font-semibold">{ownCommentsCount}</span>
              <span className="text-xs">{userType === "student" ? "自分のコメント" : "自分"}</span>
            </TabsTrigger>
            
            <TabsTrigger value="resolved" className="flex flex-col items-center py-1">
              <span className="text-xs font-semibold">{resolvedCommentsCount}</span>
              <span className="text-xs">解決済</span>
            </TabsTrigger>
            
            {userType === "enterprise" && (
              <TabsTrigger value="unresolved" className="flex flex-col items-center py-1">
                <span className="text-xs font-semibold">{unresolvedCommentsCount}</span>
                <span className="text-xs">未解決</span>
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
        
        {/* Active filters display */}
        {categoryFilters.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-gray-100">
            {categoryFilters.map(category => (
              <Badge 
                key={category} 
                variant="secondary" 
                className={`${getCategoryColor(category)} text-xs cursor-pointer`}
                onClick={() => toggleCategoryFilter(category)}
              >
                {getCategoryLabel(category)}
                <span className="ml-1">×</span>
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs py-0 h-5 ml-auto" 
              onClick={() => setCategoryFilters([])}
            >
              クリア
            </Button>
          </div>
        )}
      </div>

      {comments.length > 0 ? (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {comments.map((comment) => (
              <div 
                key={comment.id} 
                className={`rounded-lg border ${comment.isOwn ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white"} overflow-hidden transition-all hover:shadow-sm ${comment.resolved ? "opacity-75" : ""}`}
              >
                {/* Comment header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div className="font-medium text-sm flex items-center">
                    {userType === "enterprise" && !comment.isOwn ? (
                      <span className="text-gray-700">Student #{comment.id % 5 + 1}</span>
                    ) : (
                      <span className={comment.isOwn ? "text-blue-600" : ""}>
                        {comment.author}
                      </span>
                    )}
                    {comment.resolved && (
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 text-xs">
                        <CheckSquare className="h-3 w-3 mr-1" /> 解決済み
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {comment.timestamp}
                  </div>
                </div>
                
                {/* Comment content - 差分表示機能 */}
                <div className="p-4">
                  {/* Category badge */}
                  {comment.category && (
                    <Badge 
                      variant="secondary" 
                      className={`mb-2 ${getCategoryColor(comment.category)}`}
                    >
                      {getCategoryLabel(comment.category)}
                    </Badge>
                  )}
                  
                  {/* 差分表示（企業ユーザーのみ） */}
                  {userType === "enterprise" && showDiff && comment.category === "content" ? (
                    <div className="text-sm mb-4 leading-relaxed bg-gray-50 p-2 border border-gray-200 rounded">
                      {/* ここでは例として差分を色分けして表示 */}
                      {comment.text.split(' ').map((word, i) => (
                        <span 
                          key={i} 
                          className={
                            word.includes('XX') || word.includes('YY') 
                              ? 'bg-red-200 line-through' 
                              : i > comment.text.split(' ').length - 5 
                                ? 'bg-green-200' 
                                : ''
                          }
                        >
                          {word}{' '}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm mb-4 leading-relaxed">{comment.text}</p>
                  )}
                  
                  {/* Comment actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={comment.likes > 0 ? "outline" : "ghost"}
                            size="sm" 
                            className={`text-gray-600 hover:text-gray-900 ${comment.likes > 0 ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
                            onClick={() => handleLike(comment.id)}
                          >
                            <ThumbsUp className={`h-4 w-4 mr-1 ${comment.likes > 0 ? 'text-green-600' : ''}`} /> 
                            {comment.likes > 0 && <span>{comment.likes}</span>}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>役に立った</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={comment.dislikes > 0 ? "outline" : "ghost"} 
                            size="sm" 
                            className={`text-gray-600 hover:text-gray-900 ${comment.dislikes > 0 ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
                            onClick={() => handleDislike(comment.id)}
                          >
                            <ThumbsDown className={`h-4 w-4 mr-1 ${comment.dislikes > 0 ? 'text-red-600' : ''}`} /> 
                            {comment.dislikes > 0 && <span>{comment.dislikes}</span>}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>役に立たなかった</TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <div className="flex gap-2">
                      {comment.isOwn && (
                        <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 text-blue-700">
                          <Edit className="h-4 w-4 mr-1 text-blue-500" /> 編集
                        </Button>
                      )}
                      
                      {/* 企業ユーザーと、学生（自分のコメントのみ）がコメント解決可能 */}
                      {(userType === "enterprise" || (userType === "student" && comment.isOwn)) && (
                        <Button 
                          variant={comment.resolved ? "default" : "outline"}
                          size="sm"
                          className={comment.resolved ? "bg-green-600" : "text-green-600 border-green-200"}
                          onClick={() => toggleResolvedStatus(comment.id)}
                        >
                          {comment.resolved ? "解決済み" : "解決する"}
                        </Button>
                      )}
                      
                      {/* 企業ユーザーのみ表示する再レビュー依頼ボタン */}
                      {userType === "enterprise" && !comment.resolved && !comment.isOwn && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-200 text-purple-700"
                        >
                          再レビュー依頼
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
          <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
          {viewFilter === "all" && categoryFilters.length === 0 ? (
            <>
              <p className="text-center">このスライドにはまだコメントがありません</p>
              <p className="text-center text-sm mt-1">スライド上の任意の場所をクリックしてコメントを追加できます</p>
            </>
          ) : (
            <>
              <p className="text-center">選択されたフィルタに一致するコメントがありません</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3" 
                onClick={() => {
                  setViewFilter(userType === "student" ? "own" : "all");
                  setCategoryFilters([]);
                }}
              >
                すべてのコメントを表示
              </Button>
            </>
          )}
        </div>
      )}
      
      {/* 学生向け進捗表示 */}
      {userType === "student" && (
        <div className="p-3 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-medium text-blue-700">コメント完了状況</h4>
            <p className="text-xs text-blue-600 mt-1">
              {ownCommentsCount > 0 ? `${ownCommentsCount}件のコメントを投稿済み` : "まだコメントがありません"}
            </p>
          </div>
          <Button 
            variant="outline"
            size="sm"
            className="text-xs h-7 border-blue-200 text-blue-700"
          >
            レビュー完了
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentList;
