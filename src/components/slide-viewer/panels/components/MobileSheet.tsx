
import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import TabsContainer from "./TabsContainer";

interface MobileSheetProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
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
  panelRef: React.RefObject<HTMLDivElement>;
}

const MobileSheet: React.FC<MobileSheetProps> = ({
  isSheetOpen,
  setIsSheetOpen,
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
  panelRef,
}) => {
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-lg bg-white hover:bg-gray-50 border-2 transition-all duration-200 hover:scale-105"
        >
          <MessageSquare className="h-4 w-4 mr-1 text-purple-600" />
          <span className="font-medium">レビュー</span>
          {(presenterNotes[currentSlide] || shouldShowReviewPanel) && (
            <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs rounded-full animate-pulse">
              !
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md p-0 z-50">
        <div className="h-full bg-gradient-to-b from-gray-50 to-white" ref={panelRef}>
          <TabsContainer
            shouldShowNotes={shouldShowNotes}
            shouldShowReviewPanel={shouldShowReviewPanel}
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            presenterNotes={presenterNotes}
            userType={userType}
            panelDimensions={panelDimensions}
            isNarrow={isNarrow}
            isVeryNarrow={isVeryNarrow}
            activeTab={activeTab}
            onTabChange={onTabChange}
            isMobile={true}
            onSheetClose={() => setIsSheetOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSheet;
