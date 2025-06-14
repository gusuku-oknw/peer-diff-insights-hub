
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, BookOpen, MessageSquare } from "lucide-react";

interface PanelHeaderProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  isVeryNarrow: boolean;
  isMobile: boolean;
  onToggleHide?: () => void;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  isVeryNarrow,
  isMobile,
  onToggleHide
}) => {
  return (
    <div className={`${isVeryNarrow ? 'px-2 py-1' : 'px-4 py-2'} border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 relative z-20`}>
      <TabsList className="grid grid-cols-2 flex-1 min-w-0 bg-white shadow-sm">
        {shouldShowNotes && (
          <TabsTrigger 
            value="notes" 
            className="flex items-center gap-1 min-w-0 transition-all hover:bg-blue-50 data-[state=active]:bg-blue-100"
          >
            <BookOpen className="h-4 w-4 flex-shrink-0 text-blue-600" />
            <span className="truncate font-medium">メモ</span>
          </TabsTrigger>
        )}
        {shouldShowReviewPanel && (
          <TabsTrigger 
            value="reviews" 
            className="flex items-center gap-1 min-w-0 transition-all hover:bg-purple-50 data-[state=active]:bg-purple-100"
          >
            <MessageSquare className="h-4 w-4 flex-shrink-0 text-purple-600" />
            <span className="truncate font-medium">レビュー</span>
          </TabsTrigger>
        )}
      </TabsList>
      {!isMobile && onToggleHide && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleHide}
          className="ml-2 h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-200 transition-colors relative z-30"
          title="パネルを閉じる"
        >
          <X className="h-4 w-4 text-gray-600" />
        </Button>
      )}
    </div>
  );
};

export default PanelHeader;
