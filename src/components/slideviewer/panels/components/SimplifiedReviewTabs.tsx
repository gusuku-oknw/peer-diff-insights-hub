
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, CheckCircle } from "lucide-react";
import CommentSection from "./CommentSection";
import ChecklistSection from "./ChecklistSection";

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
  
  // FIXED: Isolated checkbox change handler that NEVER triggers tab changes
  const handleIsolatedCheckboxChange = (categoryKey: string, itemId: string, checked: boolean) => {
    console.log('SimplifiedReviewTabs: Isolated checkbox handler called', { 
      categoryKey, 
      itemId, 
      checked, 
      currentActiveTab: activeTab,
      timestamp: Date.now()
    });
    
    // Call the parent handler in isolation
    try {
      onCheckboxChange(categoryKey, itemId, checked);
      console.log('SimplifiedReviewTabs: Checkbox change completed successfully, activeTab preserved:', activeTab);
    } catch (error) {
      console.error('SimplifiedReviewTabs: Error in checkbox change:', error);
    }
  };

  // FIXED: Tab change handler that only responds to explicit user clicks
  const handleExplicitTabChange = (newTab: string) => {
    console.log('SimplifiedReviewTabs: Explicit tab change requested by user', { 
      from: activeTab, 
      to: newTab,
      timestamp: Date.now()
    });
    onTabChange(newTab);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleExplicitTabChange} className="flex-grow flex flex-col">
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
        <CommentSection
          comments={comments}
          checklistCategories={checklistCategories}
          newComment={newComment}
          currentSlide={currentSlide}
          isVeryNarrow={isVeryNarrow}
          onCommentChange={onCommentChange}
          onSubmitComment={onSubmitComment}
        />
      </TabsContent>

      <TabsContent value="checklist" className="flex-grow mx-4 mt-3 overflow-hidden">
        <ChecklistSection
          checklistState={checklistState}
          onCheckboxChange={handleIsolatedCheckboxChange}
          checklistCategories={checklistCategories}
          canInteract={canInteract}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SimplifiedReviewTabs;
