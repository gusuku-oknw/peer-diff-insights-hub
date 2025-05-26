
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, BarChart4, Star, Clipboard } from "lucide-react";
import ReviewCommentsList from "../../../slideviewer/panels/components/ReviewCommentsList";
import ReviewChecklistTabs from "../../ReviewChecklistTabs";
import AIReviewSummary from "../../AIReviewSummary";
import ReviewSummaryTab from "./ReviewSummaryTab";

interface ReviewPanelContentProps {
  currentSlide: number;
  isVeryNarrow?: boolean;
  isExtremelyNarrow?: boolean;
  isShort?: boolean;
  canInteract: boolean;
  mockReviews: any;
  onChecklistComment: (comment: string, category: string) => void;
  userType: "student" | "enterprise";
}

const ReviewPanelContent: React.FC<ReviewPanelContentProps> = ({
  currentSlide,
  isVeryNarrow = false,
  isExtremelyNarrow = false,
  isShort = false,
  canInteract,
  mockReviews,
  onChecklistComment,
  userType
}) => {
  const [selectedReview, setSelectedReview] = useState<number | null>(null);
  const reviews = mockReviews[currentSlide as keyof typeof mockReviews] || [];

  return (
    <Tabs defaultValue="reviews" className="flex-grow flex flex-col min-h-0">
      <TabsList className={`${isVeryNarrow ? 'p-0.5' : 'p-2'} justify-center border-b border-gray-100 flex-shrink-0`}>
        <TabsTrigger value="reviews" className="flex gap-1 items-center text-xs min-w-0">
          <MessageSquare className={`${isExtremelyNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0`} />
          {!isExtremelyNarrow && <span className="truncate">レビュー</span>}
        </TabsTrigger>
        {canInteract && (
          <TabsTrigger value="checklist" className="flex gap-1 items-center text-xs min-w-0">
            <Clipboard className={`${isExtremelyNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0`} />
            {!isExtremelyNarrow && <span className="truncate">チェックリスト</span>}
          </TabsTrigger>
        )}
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
        <ReviewCommentsList
          reviews={reviews}
          isVeryNarrow={isVeryNarrow}
          isExtremelyNarrow={isExtremelyNarrow}
          isShort={isShort}
          canInteract={canInteract}
          selectedReview={selectedReview}
          onSelectReview={setSelectedReview}
        />
      </TabsContent>

      {canInteract && (
        <TabsContent value="checklist" className="flex-grow p-0 m-0 overflow-hidden">
          <ReviewChecklistTabs
            currentSlide={currentSlide}
            onSubmitComment={onChecklistComment}
            userType={userType}
          />
        </TabsContent>
      )}
      
      <TabsContent value="summary" className={`${isVeryNarrow ? 'p-1' : 'p-4'} m-0 overflow-auto`}>
        <ReviewSummaryTab
          isVeryNarrow={isVeryNarrow}
          isExtremelyNarrow={isExtremelyNarrow}
          isShort={isShort}
          mockReviews={mockReviews}
        />
      </TabsContent>
      
      <TabsContent value="ai-summary" className="p-0 m-0 flex-grow overflow-auto">
        <div className={isVeryNarrow ? 'p-1' : 'p-4'}>
          <AIReviewSummary slideId={currentSlide} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ReviewPanelContent;
