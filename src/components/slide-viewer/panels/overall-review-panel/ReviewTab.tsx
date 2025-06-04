// ReviewTab.tsx
import React from "react";
import { Star, MessageSquare, Users, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewTabProps {
    reviewText: string;
    setReviewText: React.Dispatch<React.SetStateAction<string>>;
    overallRating: number;
    setOverallRating: React.Dispatch<React.SetStateAction<number>>;
    onSubmit: () => void;
}

const ReviewTab: React.FC<ReviewTabProps> = ({
                                                 reviewText,
                                                 setReviewText,
                                                 overallRating,
                                                 setOverallRating,
                                                 onSubmit
                                             }) => {
    const renderStarRating = () => (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => setOverallRating(star)}
                    className={`transition-colors ${star <= overallRating ? "text-yellow-400" : "text-gray-300"}`}
                >
                    <Star className="h-5 w-5 fill-current" />
                </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
        {overallRating > 0 ? `${overallRating}/5` : "評価なし"}
      </span>
        </div>
    );

    return (
        <div className="p-4 space-y-6">
            {/* Review フォーム */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    プレゼンテーション全体の評価
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">総合評価</label>
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
                        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            レビューを投稿
                        </Button>
                    </div>
                </div>
            </div>

            {/* 投稿済みレビュー */}
            <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    投稿された全体評価
                </h4>
                <div className="space-y-4">
                    {/* サンプル */}
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
                        <p className="text-sm text-gray-700">
                            全体的に構成がよく練られており、聞き手に分かりやすい内容でした。特にデータの可視化が効果的で説得力がありました。
                        </p>
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
                        <p className="text-sm text-gray-700">
                            非常に完成度の高いプレゼンテーションでした。論理的な流れと視覚的な表現のバランスが素晴らしいです。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewTab;
