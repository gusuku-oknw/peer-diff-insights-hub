
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  CheckCircle, 
  BarChart3, 
  Lightbulb,
  Target,
  Users
} from "lucide-react";
import CommentSection from "./CommentSection";
import ChecklistSection from "./ChecklistSection";
import ReviewDashboard from "./ReviewDashboard";
import SmartSuggestions from "./SmartSuggestions";

interface EnhancedReviewTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  canInteract: boolean;
  comments: any[];
  checklistCategories: any;
  newComment: string;
  currentSlide: number;
  isVeryNarrow: boolean;
  checklistState: any;
  completionPercentage: number;
  onCommentChange: (comment: string) => void;
  onSubmitComment: () => void;
  onCheckboxChange: (categoryKey: string, itemId: string, checked: boolean) => void;
}

const EnhancedReviewTabs: React.FC<EnhancedReviewTabsProps> = ({
  activeTab,
  onTabChange,
  canInteract,
  comments,
  checklistCategories,
  newComment,
  currentSlide,
  isVeryNarrow,
  checklistState,
  completionPercentage,
  onCommentChange,
  onSubmitComment,
  onCheckboxChange
}) => {
  const handleIsolatedCheckboxChange = (categoryKey: string, itemId: string, checked: boolean) => {
    console.log('EnhancedReviewTabs: Isolated checkbox handler called', { 
      categoryKey, 
      itemId, 
      checked, 
      currentActiveTab: activeTab,
      timestamp: Date.now()
    });
    
    try {
      onCheckboxChange(categoryKey, itemId, checked);
      console.log('EnhancedReviewTabs: Checkbox change completed successfully, activeTab preserved:', activeTab);
    } catch (error) {
      console.error('EnhancedReviewTabs: Error in checkbox change:', error);
    }
  };

  const handleExplicitTabChange = (newTab: string) => {
    console.log('EnhancedReviewTabs: Explicit tab change requested by user', { 
      from: activeTab, 
      to: newTab,
      timestamp: Date.now()
    });
    onTabChange(newTab);
  };

  // Mock data for dashboard and suggestions
  const mockApplySuggestion = (suggestionId: string) => {
    console.log('Applying suggestion:', suggestionId);
  };

  const mockDismissSuggestion = (suggestionId: string) => {
    console.log('Dismissing suggestion:', suggestionId);
  };

  const tabs = [
    {
      value: "dashboard",
      label: isVeryNarrow ? "概要" : "ダッシュボード",
      icon: BarChart3,
      color: "blue"
    },
    {
      value: "review",
      label: isVeryNarrow ? "レビュー" : "レビュー",
      icon: MessageSquare,
      color: "purple"
    },
    {
      value: "checklist",
      label: isVeryNarrow ? "チェック" : "チェックリスト",
      icon: CheckCircle,
      color: "green"
    },
    {
      value: "suggestions",
      label: isVeryNarrow ? "提案" : "AI提案",
      icon: Lightbulb,
      color: "orange"
    }
  ];

  return (
    <Tabs value={activeTab} onValueChange={handleExplicitTabChange} className="flex-grow flex flex-col">
      <TabsList className={`mx-4 mt-3 grid grid-cols-4 bg-gray-50 ${isVeryNarrow ? 'gap-0' : 'gap-1'}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className={`flex items-center gap-1 transition-all duration-200 ${
                isVeryNarrow ? 'px-1 text-xs' : 'px-2 text-xs'
              } ${
                tab.color === 'blue' ? 'data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700' :
                tab.color === 'purple' ? 'data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700' :
                tab.color === 'green' ? 'data-[state=active]:bg-green-100 data-[state=active]:text-green-700' :
                'data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700'
              }`}
            >
              <Icon className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'}`} />
              {!isVeryNarrow && <span>{tab.label}</span>}
              {isVeryNarrow && activeTab === tab.value && <span className="truncate">{tab.label}</span>}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="dashboard" className="flex-grow mx-0 mt-0 overflow-hidden">
        <ReviewDashboard
          currentSlide={currentSlide}
          totalSlides={10} // This should come from props
          completionPercentage={completionPercentage}
          pendingItems={3}
          urgentItems={1}
          completedToday={5}
          isVeryNarrow={isVeryNarrow}
        />
      </TabsContent>

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

      <TabsContent value="suggestions" className="flex-grow mx-0 mt-0 overflow-hidden">
        <SmartSuggestions
          currentSlide={currentSlide}
          onApplySuggestion={mockApplySuggestion}
          onDismissSuggestion={mockDismissSuggestion}
          isVeryNarrow={isVeryNarrow}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedReviewTabs;
