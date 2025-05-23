
import React from "react";
import NotesPanel from "./NotesPanel";
import ReviewPanel from "./ReviewPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  // Check if we're on a mobile device
  const isMobile = useIsMobile();
  
  // Determine if we should display the panel at all
  const shouldDisplay = shouldShowNotes || shouldShowReviewPanel;
  
  // No display if conditions not met
  if (!shouldDisplay) {
    return null;
  }

  // Default to the tab that's enabled
  const defaultTab = shouldShowNotes ? "notes" : "reviews";

  return (
    <div className={`${isMobile ? 'w-full' : 'w-80'} h-full bg-gray-50 border-l border-gray-200 overflow-hidden flex flex-col`}>
      <Tabs defaultValue={defaultTab} className="h-full flex flex-col">
        <div className="px-4 py-2 border-b border-gray-200">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger 
              value="notes" 
              disabled={!shouldShowNotes}
              className="flex items-center gap-1"
              data-testid="notes-tab"
            >
              <BookOpen className="h-4 w-4" />
              <span>メモ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              disabled={!shouldShowReviewPanel}
              className="flex items-center gap-1"
              data-testid="reviews-tab"
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
