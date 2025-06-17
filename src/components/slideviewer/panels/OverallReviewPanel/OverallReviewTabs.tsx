
// OverallReviewTabs.tsx
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, MessageSquare, BookOpen } from "lucide-react";
import OverviewTab from "./OverviewTab";
import ReviewTab from "./ReviewTab";
import ScriptTab from "./ScriptTab";

interface OverallReviewTabsProps {
    overallScore: number;
    totalComments: number;
    positiveComments: number;
    negativeComments: number;
    reviewText: string;
    setReviewText: React.Dispatch<React.SetStateAction<string>>;
    overallRating: number;
    setOverallRating: React.Dispatch<React.SetStateAction<number>>;
    onSubmitReview: () => void;
    presenterNotes: Record<number, string>;
}

const OverallReviewTabs: React.FC<OverallReviewTabsProps> = ({
    overallScore,
    totalComments,
    positiveComments,
    negativeComments,
    reviewText,
    setReviewText,
    overallRating,
    setOverallRating,
    onSubmitReview,
    presenterNotes
}) => {
    return (
        <Tabs defaultValue="overview" className="h-full flex flex-col">
            {/* タブトリガー部分 */}
            <div className="border-b border-gray-200 px-4 flex-shrink-0 h-12 flex items-center">
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

            {/* ─── Overview タブ ─── */}
            <TabsContent value="overview" className="flex-1 overflow-hidden m-0">
                <div className="h-full overflow-y-auto">
                    <OverviewTab
                        overallScore={overallScore}
                        totalComments={totalComments}
                        positiveComments={positiveComments}
                        negativeComments={negativeComments}
                    />
                </div>
            </TabsContent>

            {/* ─── Review タブ ─── */}
            <TabsContent value="review" className="flex-1 overflow-hidden m-0">
                <div className="h-full overflow-y-auto">
                    <ReviewTab
                        reviewText={reviewText}
                        setReviewText={setReviewText}
                        overallRating={overallRating}
                        setOverallRating={setOverallRating}
                        onSubmit={onSubmitReview}
                    />
                </div>
            </TabsContent>

            {/* ─── Script タブ ─── */}
            <TabsContent value="script" className="flex-1 overflow-hidden m-0">
                <div className="h-full overflow-y-auto">
                    <ScriptTab presenterNotes={presenterNotes} />
                </div>
            </TabsContent>
        </Tabs>
    );
};

export default OverallReviewTabs;
