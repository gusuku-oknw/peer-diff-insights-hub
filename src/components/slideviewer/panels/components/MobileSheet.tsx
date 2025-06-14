
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageSquare, BookOpen } from "lucide-react";
import PanelContent from "../../core/PanelContent";

interface MobileSheetProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  userType: "student" | "enterprise";
  panelDimensions: { width: number; height: number };
  isNarrow: boolean;
  isVeryNarrow: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  panelRef: React.RefObject<HTMLDivElement>;
}

const MobileSheet: React.FC<MobileSheetProps> = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
  userType,
  panelDimensions,
  isNarrow,
  isVeryNarrow,
  activeTab,
  onTabChange,
  isSheetOpen,
  setIsSheetOpen,
  panelRef,
}) => {
  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-white shadow-lg border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
          aria-label="レビューパネルを開く"
        >
          {shouldShowReviewPanel && <MessageSquare className="h-4 w-4 mr-1 text-purple-600" />}
          {shouldShowNotes && <BookOpen className="h-4 w-4 mr-1 text-blue-600" />}
          <span className="text-sm font-medium">
            {shouldShowReviewPanel ? "レビュー" : "メモ"}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-full sm:w-96 p-0 bg-white"
        aria-describedby="mobile-panel-description"
      >
        <div id="mobile-panel-description" className="sr-only">
          {shouldShowReviewPanel ? "レビュー管理パネル" : "プレゼンターノートパネル"}
        </div>
        
        <div ref={panelRef} className="h-full">
          <PanelContent
            shouldShowNotes={shouldShowNotes}
            shouldShowReviewPanel={shouldShowReviewPanel}
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            presenterNotes={presenterNotes}
            userType={userType}
            panelWidth={panelDimensions.width}
            isNarrow={isNarrow}
            isVeryNarrow={isVeryNarrow}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSheet;
