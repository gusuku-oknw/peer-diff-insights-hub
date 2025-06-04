
// OverviewTab.tsx
import React from "react";
import { BarChart3, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OverviewTabProps {
    overallScore: number;
    totalComments: number;
    positiveComments: number;
    negativeComments: number;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    overallScore,
    totalComments,
    positiveComments,
    negativeComments
}) => {
    const scoreColor = overallScore >= 80 ? "text-green-600" : 
                      overallScore >= 60 ? "text-yellow-600" : "text-red-600";
    
    const scoreBarColor = overallScore >= 80 ? "bg-green-500" : 
                         overallScore >= 60 ? "bg-yellow-500" : "bg-red-500";

    return (
        <div className="p-4 space-y-6">
            {/* 総合スコア */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-purple-800 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        総合評価スコア
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <span className={`text-4xl font-bold ${scoreColor}`}>
                            {overallScore}
                        </span>
                        <span className="text-2xl text-gray-400">/100</span>
                    </div>
                    <Progress value={overallScore} className="h-3 mb-2" />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>プレゼンテーション品質</span>
                        <Badge variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "destructive"}>
                            {overallScore >= 80 ? "優秀" : overallScore >= 60 ? "良好" : "要改善"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* コメント統計 */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{totalComments}</div>
                        <div className="text-sm text-gray-600">総コメント数</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <ThumbsUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">{positiveComments}</div>
                        <div className="text-sm text-gray-600">ポジティブ</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <ThumbsDown className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600">{negativeComments}</div>
                        <div className="text-sm text-gray-600">改善提案</div>
                    </CardContent>
                </Card>
            </div>

            {/* 詳細分析 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                        評価詳細
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">構成・論理性</span>
                            <div className="flex items-center space-x-2">
                                <Progress value={85} className="w-20 h-2" />
                                <span className="text-sm font-medium text-gray-900">85%</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">視覚的効果</span>
                            <div className="flex items-center space-x-2">
                                <Progress value={78} className="w-20 h-2" />
                                <span className="text-sm font-medium text-gray-900">78%</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">内容の充実度</span>
                            <div className="flex items-center space-x-2">
                                <Progress value={72} className="w-20 h-2" />
                                <span className="text-sm font-medium text-gray-900">72%</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">台本との整合性</span>
                            <div className="flex items-center space-x-2">
                                <Progress value={80} className="w-20 h-2" />
                                <span className="text-sm font-medium text-gray-900">80%</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 改善提案 */}
            <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-orange-800">
                        主な改善提案
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-orange-700">
                        <li>• スライド3のグラフの説明をより詳細に</li>
                        <li>• 結論部分でのインパクトを強化</li>
                        <li>• フォントサイズの統一を推奨</li>
                        <li>• 台本の時間配分を見直し</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default OverviewTab;
