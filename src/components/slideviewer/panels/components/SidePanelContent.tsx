
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare, X, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotesPanel from "../../../slideviewer/panels/NotesPanel";
import ReviewPanel from "../../panels/SimplifiedReviewPanel";

interface SidePanelContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  isVeryNarrow: boolean;
  isMobile: boolean;
  userType: "student" | "enterprise";
  currentSlide: number;
  totalSlides: number;
  onToggleHide?: () => void;
  onSheetClose?: () => void;
  onAddComment: () => void;
  onSendReview: () => void;
  panelDimensions: { width: number; height: number };
  presenterNotes: Record<number, string>;
  isNarrow: boolean;
}

const SidePanelContent: React.FC<SidePanelContentProps> = ({
  activeTab,
  onTabChange,
  shouldShowNotes,
  shouldShowReviewPanel,
  isVeryNarrow,
  isMobile,
  userType,
  currentSlide,
  totalSlides,
  onToggleHide,
  onSheetClose,
  onAddComment,
  onSendReview,
  panelDimensions,
  presenterNotes,
  isNarrow
}) => {
  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <div className={`${isVeryNarrow ? 'px-2 py-1' : 'px-4 py-2'} border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50`}>
          <TabsList className={`grid ${shouldShowNotes && shouldShowReviewPanel ? 'grid-cols-2' : 'grid-cols-1'} flex-1 min-w-0 bg-white shadow-sm`}>
            {shouldShowNotes && (
              <TabsTrigger 
                value="notes" 
                className={`flex items-center gap-1 ${isVeryNarrow ? 'px-1' : 'px-2'} min-w-0 relative transition-all hover:bg-blue-50 data-[state=active]:bg-blue-100 data-[state=active]:border-blue-300`}
                data-testid="notes-tab"
              >
                <BookOpen className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0 text-blue-600`} />
                {!isVeryNarrow && <span className="truncate font-medium">メモ</span>}
              </TabsTrigger>
            )}
            {shouldShowReviewPanel && (
              <TabsTrigger 
                value="reviews" 
                className={`flex items-center gap-1 ${isVeryNarrow ? 'px-1' : 'px-2'} min-w-0 relative transition-all hover:bg-red-50 data-[state=active]:bg-red-100 data-[state=active]:border-red-300`}
                data-testid="reviews-tab"
              >
                <MessageSquare className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0 text-red-600`} />
                {!isVeryNarrow && <span className="truncate font-medium">レビュー</span>}
                <Badge variant="destructive" className="h-4 w-4 p-0 text-xs rounded-full animate-pulse">
                  3
                </Badge>
              </TabsTrigger>
            )}
          </TabsList>
          
          {!isMobile && onToggleHide && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleHide}
              className={`ml-2 ${isVeryNarrow ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'} flex-shrink-0 hover:bg-gray-200 transition-all duration-200 hover:scale-105`}
              title="パネルを閉じる"
            >
              <X className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />
            </Button>
          )}
          
          {isMobile && onSheetClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSheetClose}
              className="ml-2 h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick action buttons - Only show for students in review mode */}
        {!isVeryNarrow && activeTab === "reviews" && userType === "student" && (
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddComment}
                className="h-7 px-2 text-xs hover:bg-green-100 transition-all duration-200 hover:scale-105 bg-green-50 border border-green-200"
              >
                <Plus className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-700 font-medium">追加</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSendReview}
                className="h-7 px-2 text-xs hover:bg-purple-100 transition-all duration-200 hover:scale-105 bg-purple-50 border border-purple-200"
              >
                <Send className="h-3 w-3 mr-1 text-purple-600" />
                <span className="text-purple-700 font-medium">送信</span>
              </Button>
            </div>
            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
              スライド {currentSlide}/{totalSlides}
            </div>
          </div>
        )}

        {/* Show slide info for enterprise users or when not in review mode */}
        {!isVeryNarrow && (activeTab !== "reviews" || userType === "enterprise") && (
          <div className="flex items-center justify-end px-4 py-2 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
            {userType === "enterprise" && activeTab === "reviews" && (
              <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 mr-2">
                閲覧専用
              </div>
            )}
            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
              スライド {currentSlide}/{totalSlides}
            </div>
          </div>
        )}
        
        <TabsContent value="notes" className="flex-grow overflow-hidden m-0 p-0 min-h-0">
          {shouldShowNotes && (
            <NotesPanel 
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
              panelWidth={panelDimensions.width}
              panelHeight={panelDimensions.height}
              isNarrow={isNarrow}
              isVeryNarrow={isVeryNarrow}
            />
          )}
        </TabsContent>
        
        <TabsContent value="reviews" className="flex-grow overflow-hidden m-0 p-0 min-h-0">
          {shouldShowReviewPanel && (
            <ReviewPanel
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              panelWidth={panelDimensions.width}
              panelHeight={panelDimensions.height}
              isNarrow={isNarrow}
              isVeryNarrow={isVeryNarrow}
              userType={userType}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SidePanelContent;
