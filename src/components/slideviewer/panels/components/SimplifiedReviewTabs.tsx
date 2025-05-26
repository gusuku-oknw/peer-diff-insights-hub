
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, CheckCircle } from "lucide-react";
import ReviewCommentsList from "./ReviewCommentsList";
import ReviewCommentInput from "./ReviewCommentInput";
import ReviewChecklistPanel from "./ReviewChecklistPanel";

interface SimplifiedReviewTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  canInteract: boolean;
  comments: any[];
  checklistCategories: any;
  newComment: string;
  currentSlide: number;
  isVeryNarrow: boolean;
  checklistState: any;
  onCommentChange: (comment: string) => void;
  onSubmitComment: () => void;
  onCheckboxChange: (categoryKey: string, itemId: string, checked: boolean) => void;
}

const SimplifiedReviewTabs: React.FC<SimplifiedReviewTabsProps> = ({
  activeTab,
  onTabChange,
  canInteract,
  comments,
  checklistCategories,
  newComment,
  currentSlide,
  isVeryNarrow,
  checklistState,
  onCommentChange,
  onSubmitComment,
  onCheckboxChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="flex-grow flex flex-col">
      <TabsList className="mx-4 mt-3 grid grid-cols-2 bg-gray-50">
        <TabsTrigger value="review" className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          レビュー
        </TabsTrigger>
        <TabsTrigger value="checklist" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          チェック
        </TabsTrigger>
      </TabsList>

      <TabsContent value="review" className="flex-grow mx-4 mt-3 space-y-3 overflow-hidden">
        <ReviewCommentsList 
          comments={comments}
          checklistCategories={checklistCategories}
        />
        <ReviewCommentInput
          newComment={newComment}
          currentSlide={currentSlide}
          isVeryNarrow={isVeryNarrow}
          onCommentChange={onCommentChange}
          onSubmitComment={onSubmitComment}
        />
      </TabsContent>

      <TabsContent value="checklist" className="flex-grow mx-4 mt-3 overflow-hidden">
        <ReviewChecklistPanel
          checklistState={checklistState}
          onCheckboxChange={onCheckboxChange}
          checklistCategories={checklistCategories}
          canInteract={canInteract}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SimplifiedReviewTabs;
