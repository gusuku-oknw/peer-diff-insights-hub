
import React from "react";
import NotesPanel from "./NotesPanel";
import ReviewPanel from "./ReviewPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare } from "lucide-react";

interface SidePanelProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
}

const SidePanel = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
}: SidePanelProps) => {
  // サイドパネルを表示するかどうかをチェック
  const shouldDisplay = shouldShowNotes || shouldShowReviewPanel;
  
  // 表示条件が満たされない場合は何も表示しない
  if (!shouldDisplay) {
    return null;
  }

  // デフォルトのタブを決定
  const defaultTab = shouldShowNotes ? "notes" : "reviews";

  return (
    <div className="w-80 h-full bg-gray-50 border-l border-gray-200 overflow-hidden flex flex-col">
      <Tabs defaultValue={defaultTab} className="h-full flex flex-col">
        <div className="px-4 py-2 border-b border-gray-200">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger 
              value="notes" 
              disabled={!shouldShowNotes}
              className="flex items-center gap-1"
            >
              <BookOpen className="h-4 w-4" />
              <span>メモ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              disabled={!shouldShowReviewPanel}
              className="flex items-center gap-1"
            >
              <MessageSquare className="h-4 w-4" />
              <span>レビュー</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="notes" className="flex-grow overflow-hidden m-0 p-0">
          {shouldShowNotes && (
            <NotesPanel 
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
            />
          )}
        </TabsContent>
        
        <TabsContent value="reviews" className="flex-grow overflow-hidden m-0 p-0">
          {shouldShowReviewPanel && (
            <ReviewPanel
              currentSlide={currentSlide}
              totalSlides={totalSlides}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SidePanel;
