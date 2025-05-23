
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle, 
  Clock, 
  BarChart4, 
  AlertTriangle,
  Star
} from "lucide-react";
import AIReviewSummary from "./AIReviewSummary";

interface ReviewPanelProps {
  currentSlide: number;
  totalSlides: number;
  panelWidth?: number;
  panelHeight?: number;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
}

const mockReviews = {
  1: [
    {
      id: 1,
      text: "タイトルが明確で視認性が高く、とても良いスライドです。",
      reviewer: "鈴木先生",
      timestamp: "2025/05/22 14:30",
      rating: "excellent",
      status: "completed"
    },
    {
      id: 2, 
      text: "会社ロゴの配置をもう少し調整した方が見やすくなると思います。",
      reviewer: "田中教授",
      timestamp: "2025/05/22 16:15",
      rating: "good",
      status: "pending"
    }
  ],
  2: [
    {
      id: 3,
      text: "会社概要の説明が簡潔でわかりやすいです。ただ、もう少し具体的な数字があるとより説得力が増すと思います。",
      reviewer: "山本教授",
      timestamp: "2025/05/23 09:45",
      rating: "good",
      status: "completed"
    }
  ],
  3: [
    {
      id: 4,
      text: "グラフの色使いが見にくいです。コントラストを高めるか、別の色を検討してください。",
      reviewer: "佐藤教授",
      timestamp: "2025/05/23 11:30",
      rating: "needs_improvement",
      status: "pending"
    }
  ],
  4: [
    {
      id: 5,
      text: "戦略の説明が明確で理解しやすいです。ただ、具体的な実行計画やタイムラインがあるとより良いでしょう。",
      reviewer: "伊藤先生",
      timestamp: "2025/05/23 13:20",
      rating: "good",
      status: "completed"
    }
  ],
  5: []
};

const getRatingBadge = (rating: string, isVeryNarrow: boolean) => {
  const text = isVeryNarrow ? 
    { excellent: "優", good: "良", needs_improvement: "要" } :
    { excellent: "優秀", good: "良好", needs_improvement: "要改善" };
    
  switch(rating) {
    case "excellent":
      return <Badge className="bg-green-500 text-xs">{text.excellent}</Badge>;
    case "good":
      return <Badge className="bg-blue-500 text-xs">{text.good}</Badge>;
    case "needs_improvement":
      return <Badge className="bg-amber-500 text-xs">{text.needs_improvement}</Badge>;
    default:
      return null;
  }
};

const getStatusBadge = (status: string, isVeryNarrow: boolean) => {
  switch(status) {
    case "completed":
      return (
        <Badge variant="outline" className="border-green-500 text-green-700 text-xs">
          <CheckCircle className="w-3 h-3 mr-1" /> 
          {isVeryNarrow ? "完" : "完了"}
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-700 text-xs">
          <Clock className="w-3 h-3 mr-1" /> 
          {isVeryNarrow ? "検" : "検討中"}
        </Badge>
      );
    default:
      return null;
  }
};

const ReviewPanel: React.FC<ReviewPanelProps> = ({ 
  currentSlide, 
  totalSlides,
  panelWidth = 0,
  panelHeight = 0,
  isNarrow = false,
  isVeryNarrow = false
}) => {
  const reviews = mockReviews[currentSlide as keyof typeof mockReviews] || [];
  const [selectedReview, setSelectedReview] = useState<number | null>(null);
  
  // Dynamic sizing based on actual panel dimensions
  const isExtremelyNarrow = panelWidth > 0 && panelWidth < 150;
  const isShort = panelHeight > 0 && panelHeight < 400;
  
  console.log('ReviewPanel dimensions:', { panelWidth, panelHeight, isNarrow, isVeryNarrow, isExtremelyNarrow, isShort });
  
  // Review completion status
  const completedSlides = Object.keys(mockReviews).filter(slideId => {
    const slideReviews = mockReviews[Number(slideId) as keyof typeof mockReviews];
    return slideReviews && slideReviews.length > 0 && 
      slideReviews.some(review => review.status === "completed");
  }).length;
  
  const completionPercentage = Math.round((completedSlides / totalSlides) * 100);

  return (
    <div className="h-full flex flex-col min-w-0">
      <div className={`${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-4'} border-b border-gray-200 flex-shrink-0`}>
        <h2 className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-sm' : 'text-lg'} font-semibold text-gray-800 flex items-center min-w-0`}>
          <MessageSquare className={`${isExtremelyNarrow ? 'h-3 w-3 mr-1' : isVeryNarrow ? 'h-4 w-4 mr-1' : 'h-5 w-5 mr-2'} text-blue-600 flex-shrink-0`} />
          <span className="truncate">{isExtremelyNarrow ? 'レビュー' : isVeryNarrow ? 'レビュー' : 'レビュー管理'}</span>
        </h2>
        <p className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} text-gray-600 truncate`}>
          {isExtremelyNarrow ? `${currentSlide}/${totalSlides}` : isVeryNarrow ? `${currentSlide}/${totalSlides}` : `現在のスライド: ${currentSlide} / ${totalSlides}`}
        </p>
        
        {!isShort && (
          <div className={`${isVeryNarrow ? 'mt-1' : isNarrow ? 'mt-2' : 'mt-3'} bg-blue-50 rounded-md ${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-3'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-xs'} text-blue-700`}>
                {isExtremelyNarrow ? '進捗' : isVeryNarrow ? '進捗' : 'レビュー進捗状況'}
              </span>
              <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-xs'} font-medium text-blue-800`}>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="reviews" className="flex-grow flex flex-col min-h-0">
        <TabsList className={`${isVeryNarrow ? 'p-0.5' : isNarrow ? 'p-1' : 'p-2'} justify-center border-b border-gray-100 flex-shrink-0`}>
          <TabsTrigger value="reviews" className="flex gap-1 items-center text-xs min-w-0">
            <MessageSquare className={`${isExtremelyNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0`} />
            {!isExtremelyNarrow && <span className="truncate">レビュー</span>}
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex gap-1 items-center text-xs min-w-0">
            <BarChart4 className={`${isExtremelyNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0`} />
            {!isExtremelyNarrow && <span className="truncate">サマリー</span>}
          </TabsTrigger>
          <TabsTrigger value="ai-summary" className="flex gap-1 items-center text-xs min-w-0">
            <Star className={`${isExtremelyNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0`} />
            {!isExtremelyNarrow && <span className="truncate">AI要約</span>}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="flex-grow p-0 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            {reviews.length > 0 ? (
              <div className={`${isVeryNarrow ? 'p-1 space-y-1' : isNarrow ? 'p-2 space-y-2' : 'p-4 space-y-4'} min-w-0`}>
                {reviews.map((review) => (
                  <div 
                    key={review.id} 
                    className={`bg-white shadow-sm border rounded-lg ${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-3'} transition-colors ${
                      selectedReview === review.id ? "border-blue-400 bg-blue-50" : "border-gray-200"
                    } min-w-0`}
                    onClick={() => setSelectedReview(review.id)}
                  >
                    <div className="flex justify-between items-start mb-1 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className={`font-medium ${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} truncate`}>
                          {review.reviewer}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {isExtremelyNarrow ? review.timestamp.split(' ')[0].slice(5) : isVeryNarrow ? review.timestamp.split(' ')[0] : review.timestamp}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap flex-shrink-0">
                        {getRatingBadge(review.rating, isVeryNarrow)}
                        {getStatusBadge(review.status, isVeryNarrow)}
                      </div>
                    </div>
                    <p className={`${isExtremelyNarrow ? 'text-xs line-clamp-1' : isVeryNarrow ? 'text-xs line-clamp-2' : 'text-sm'} text-gray-700 break-words`}>
                      {review.text}
                    </p>
                    {!isShort && (
                      <div className={`${isVeryNarrow ? 'mt-1' : isNarrow ? 'mt-2' : 'mt-3'} flex justify-between items-center min-w-0`}>
                        <div className="flex items-center">
                          <Button variant="ghost" size="sm" className={`${isVeryNarrow ? 'h-5 px-1' : isNarrow ? 'h-6 px-1' : 'h-7 px-2'} min-w-0`}>
                            <ThumbsUp className={`${isExtremelyNarrow ? 'h-3 w-3' : 'h-4 w-4'} ${!isExtremelyNarrow ? 'mr-1' : ''}`} />
                            {!isExtremelyNarrow && !isVeryNarrow && <span className="text-xs">同意</span>}
                          </Button>
                        </div>
                        <Button variant="outline" size="sm" className={`${isVeryNarrow ? 'h-5 text-xs px-1' : isNarrow ? 'h-6 text-xs px-2' : 'h-7 text-xs'}`}>
                          返信
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center h-full ${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-4'} text-center`}>
                <AlertTriangle className={`${isExtremelyNarrow ? 'h-6 w-6' : isVeryNarrow ? 'h-8 w-8' : 'h-12 w-12'} text-amber-300 mb-2`} />
                <h3 className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-sm' : 'text-lg'} font-medium text-gray-800 mb-1`}>
                  {isExtremelyNarrow ? 'なし' : isVeryNarrow ? 'レビューなし' : 'レビューがありません'}
                </h3>
                {!isVeryNarrow && !isShort && (
                  <p className="text-sm text-gray-600 mb-3">このスライドにはまだレビューが提出されていません。</p>
                )}
                <Button size="sm" className={isVeryNarrow ? 'text-xs px-2' : ''}>レビューを依頼</Button>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="summary" className={`${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-4'} m-0 overflow-auto`}>
          <div className={isVeryNarrow ? 'space-y-1' : isNarrow ? 'space-y-2' : 'space-y-4'}>
            <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-3'}`}>
              <h3 className={`font-medium ${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} mb-1`}>
                {isExtremelyNarrow ? '概要' : isVeryNarrow ? '概要' : 'レビュー概要'}
              </h3>
              <div className={`grid grid-cols-3 gap-${isVeryNarrow ? '1' : '2'} text-center`}>
                <div className={`bg-blue-50 ${isVeryNarrow ? 'p-1' : 'p-2'} rounded`}>
                  <div className={`${isExtremelyNarrow ? 'text-sm' : isVeryNarrow ? 'text-lg' : 'text-2xl'} font-bold text-blue-700`}>
                    {Object.values(mockReviews).flat().length}
                  </div>
                  <div className={`text-xs text-blue-600 ${isExtremelyNarrow ? 'text-xs' : ''}`}>
                    {isExtremelyNarrow ? '総' : isVeryNarrow ? '総数' : '総レビュー'}
                  </div>
                </div>
                <div className={`bg-green-50 ${isVeryNarrow ? 'p-1' : 'p-2'} rounded`}>
                  <div className={`${isExtremelyNarrow ? 'text-sm' : isVeryNarrow ? 'text-lg' : 'text-2xl'} font-bold text-green-700`}>
                    {Object.values(mockReviews).flat().filter(r => r.status === "completed").length}
                  </div>
                  <div className="text-xs text-green-600">完了</div>
                </div>
                <div className={`bg-amber-50 ${isVeryNarrow ? 'p-1' : 'p-2'} rounded`}>
                  <div className={`${isExtremelyNarrow ? 'text-sm' : isVeryNarrow ? 'text-lg' : 'text-2xl'} font-bold text-amber-700`}>
                    {Object.values(mockReviews).flat().filter(r => r.status === "pending").length}
                  </div>
                  <div className={`text-xs text-amber-600 ${isExtremelyNarrow ? 'text-xs' : ''}`}>
                    {isExtremelyNarrow ? '検' : isVeryNarrow ? '検討' : '検討中'}
                  </div>
                </div>
              </div>
            </div>
            
            {!isShort && (
              <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-3'}`}>
                <h3 className={`font-medium ${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} mb-1`}>
                  {isExtremelyNarrow ? 'レビュアー' : isVeryNarrow ? 'レビュアー' : 'レビュアー別状況'}
                </h3>
                <div className={isVeryNarrow ? 'space-y-0.5' : isNarrow ? 'space-y-1' : 'space-y-2'}>
                  <div className={`flex justify-between items-center ${isVeryNarrow ? 'p-0.5' : isNarrow ? 'p-1' : 'p-2'} bg-gray-50 rounded min-w-0`}>
                    <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} truncate`}>鈴木先生</span>
                    <Badge className="bg-green-500 text-xs flex-shrink-0">完了</Badge>
                  </div>
                  <div className={`flex justify-between items-center ${isVeryNarrow ? 'p-0.5' : isNarrow ? 'p-1' : 'p-2'} bg-gray-50 rounded min-w-0`}>
                    <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} truncate`}>田中教授</span>
                    <Badge className="bg-amber-500 text-xs flex-shrink-0">{isExtremelyNarrow ? '進' : isVeryNarrow ? '進行' : '進行中'}</Badge>
                  </div>
                  <div className={`flex justify-between items-center ${isVeryNarrow ? 'p-0.5' : isNarrow ? 'p-1' : 'p-2'} bg-gray-50 rounded min-w-0`}>
                    <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} truncate`}>山本教授</span>
                    <Badge className="bg-green-500 text-xs flex-shrink-0">完了</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="ai-summary" className="p-0 m-0 flex-grow overflow-auto">
          <div className={isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-4'}>
            <AIReviewSummary slideId={currentSlide} />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className={`${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-3'} border-t border-gray-200 bg-gray-50 flex-shrink-0`}>
        <Button className={`w-full ${isVeryNarrow ? 'text-xs h-6' : isNarrow ? 'text-xs h-7' : ''}`}>
          {isExtremelyNarrow ? 'レビュー依頼' : isVeryNarrow ? 'レビュー依頼' : '新しいレビューを依頼'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewPanel;
