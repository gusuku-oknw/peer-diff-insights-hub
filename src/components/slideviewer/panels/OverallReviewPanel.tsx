import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Users, 
  Clock, 
  Target,
  BarChart3,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  X,
  Send,
  FileText,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OverallReviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  totalSlides: number;
  presenterNotes?: Record<number, string>;
}

const OverallReviewPanel: React.FC<OverallReviewPanelProps> = ({
  isOpen,
  onClose,
  totalSlides,
  presenterNotes = {}
}) => {
  const [reviewText, setReviewText] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const { toast } = useToast();

  if (!isOpen) return null;

  const overallScore = 78;
  const totalComments = 24;
  const positiveComments = 18;
  const negativeComments = 6;

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      toast({
        title: "レビューを入力してください",
        description: "全体評価のコメントを入力してから送信してください。",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally save the review to your backend
    console.log("Submitting overall review:", { reviewText, overallRating });
    
    toast({
      title: "全体レビューを投稿しました",
      description: "プレゼンテーション全体への評価が正常に投稿されました。",
      variant: "default"
    });

    setReviewText("");
    setOverallRating(0);
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setOverallRating(star)}
            className={`transition-colors ${
              star <= overallRating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <Star className="h-5 w-5 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {overallRating > 0 ? `${overallRating}/5` : "評価なし"}
        </span>
      </div>
    );
  };

  const getAllScript = () => {
    const slideNumbers = Object.keys(presenterNotes).map(Number).sort((a, b) => a - b);
    return slideNumbers.map(slideNum => ({
      slideNumber: slideNum,
      script: presenterNotes[slideNum] || ""
    })).filter(slide => slide.script.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">プレゼンテーション全体評価</h2>
              <p className="text-sm text-gray-600">全{totalSlides}スライドの総合レビュー結果</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content with Tabs */}
        <div className="h-[calc(90vh-120px)]">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <div className="border-b border-gray-200 px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  評価概要
                </TabsTrigger>
                <TabsTrigger value="review" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  レビュー投稿
                </TabsTrigger>
                <TabsTrigger value="script" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  台本全体
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {/* Overall Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{overallScore}</div>
                      <div className="text-sm text-blue-800">総合スコア</div>
                      <div className="flex justify-center mt-2">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{positiveComments}</div>
                      <div className="text-sm text-green-800">ポジティブコメント</div>
                      <div className="flex justify-center items-center mt-2">
                        <ThumbsUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-700">{Math.round((positiveComments / totalComments) * 100)}%</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">{negativeComments}</div>
                      <div className="text-sm text-orange-800">改善提案</div>
                      <div className="flex justify-center items-center mt-2">
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                        <span className="text-xs text-orange-700">{Math.round((negativeComments / totalComments) * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      主要な洞察
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">強み</p>
                            <p className="text-sm text-gray-600">視覚的な表現が効果的で、データの説得力が高い</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">パフォーマンス</p>
                            <p className="text-sm text-gray-600">前回比15%スコア向上</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">改善点</p>
                            <p className="text-sm text-gray-600">スライド3-5の情報密度が高すぎる</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">受講者反応</p>
                            <p className="text-sm text-gray-600">82%が内容に満足と回答</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown and Latest Comments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">カテゴリ別評価</h4>
                      <div className="space-y-3">
                        {[
                          { name: "内容の質", score: 85, color: "bg-blue-500" },
                          { name: "デザイン", score: 72, color: "bg-purple-500" },
                          { name: "構成", score: 80, color: "bg-green-500" },
                          { name: "視認性", score: 75, color: "bg-orange-500" }
                        ].map((category) => (
                          <div key={category.name} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{category.name}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className={`h-2 ${category.color} rounded-full`}
                                  style={{ width: `${category.score}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-8">{category.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">最新コメント</h4>
                      <div className="space-y-3">
                        {[
                          { user: "田中先生", comment: "グラフの使い方が効果的ですね", time: "2分前", type: "positive" },
                          { user: "佐藤教授", comment: "スライド4の文字サイズを大きくしては？", time: "5分前", type: "suggestion" },
                          { user: "山田さん", comment: "結論部分が明確で分かりやすい", time: "8分前", type: "positive" }
                        ].map((comment, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              comment.type === 'positive' ? 'bg-green-400' : 'bg-orange-400'
                            }`}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                                <span className="text-xs text-gray-500">{comment.time}</span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Items */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      推奨アクション
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-white text-yellow-700 border-yellow-300">高優先度</Badge>
                        <span className="text-sm text-yellow-800">スライド3-5の情報密度を調整する</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-white text-yellow-700 border-yellow-300">中優先度</Badge>
                        <span className="text-sm text-yellow-800">グラフの色使いを統一する</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-white text-yellow-700 border-yellow-300">低優先度</Badge>
                        <span className="text-sm text-yellow-800">フォントサイズの一貫性を確保する</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="review" className="flex-1 overflow-hidden m-0">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-6">
                      {/* Review Form */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                          プレゼンテーション全体の評価
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              総合評価
                            </label>
                            {renderStarRating()}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              全体的なコメント・フィードバック
                            </label>
                            <Textarea
                              placeholder="プレゼンテーション全体について、良かった点や改善点などの総合的な評価をお書きください..."
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              className="min-h-[120px] resize-none"
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleSubmitReview}
                              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                            >
                              <Send className="h-4 w-4" />
                              レビューを投稿
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Posted Reviews */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          投稿された全体評価
                        </h4>
                        <div className="space-y-4">
                          {/* Mock posted reviews */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">田中先生</span>
                                <div className="flex">
                                  {[1, 2, 3, 4].map((star) => (
                                    <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                                  ))}
                                  <Star className="h-3 w-3 text-gray-300" />
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">10分前</span>
                            </div>
                            <p className="text-sm text-gray-700">全体的に構成がよく練られており、聞き手に分かりやすい内容でした。特にデータの可視化が効果的で説得力がありました。</p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">佐藤教授</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">15分前</span>
                            </div>
                            <p className="text-sm text-gray-700">非常に完成度の高いプレゼンテーションでした。論理的な流れと視覚的な表現のバランスが素晴らしいです。</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="script" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-green-600" />
                      プレゼンテーション台本（全体）
                    </h3>
                    <p className="text-sm text-gray-600">
                      全スライドの台本を通して確認できます。レビュー時の参考資料としてご活用ください。
                    </p>
                  </div>

                  <div className="space-y-6">
                    {getAllScript().length > 0 ? (
                      getAllScript().map((slide) => (
                        <div key={slide.slideNumber} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-bold text-blue-600">{slide.slideNumber}</span>
                            </div>
                            <h4 className="font-medium text-gray-900">スライド {slide.slideNumber} の台本</h4>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{slide.script}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">台本が設定されていません</p>
                        <p className="text-sm text-gray-400">各スライドのメモ欄に台本を記入してください</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MessageSquare className="h-4 w-4" />
            <span>最終更新: 5分前</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              レポート出力
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              改善を適用
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallReviewPanel;
