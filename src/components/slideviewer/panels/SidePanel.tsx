
import React, { useState, useRef, useEffect } from "react";
import NotesPanel from "./NotesPanel";
import ReviewPanel from "./ReviewPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare, X, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidePanelProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const SidePanel = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
  isCollapsed = false,
  onToggleCollapse,
}: SidePanelProps) => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Track panel width changes
  useEffect(() => {
    const updateWidth = () => {
      if (panelRef.current) {
        setPanelWidth(panelRef.current.offsetWidth);
      }
    };

    updateWidth();
    
    const resizeObserver = new ResizeObserver(updateWidth);
    if (panelRef.current) {
      resizeObserver.observe(panelRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);
  
  // Determine if we should display the panel at all
  const shouldDisplay = shouldShowNotes || shouldShowReviewPanel;
  
  // No display if conditions not met
  if (!shouldDisplay) {
    return null;
  }

  // Default to the tab that's enabled
  const defaultTab = shouldShowNotes ? "notes" : "reviews";
  
  // Determine layout mode based on width
  const isNarrow = panelWidth > 0 && panelWidth < 250;
  const isVeryNarrow = panelWidth > 0 && panelWidth < 180;

  // Panel content component
  const PanelContent = () => (
    <Tabs defaultValue={defaultTab} className="h-full flex flex-col">
      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <TabsList className={`grid ${shouldShowNotes && shouldShowReviewPanel ? 'grid-cols-2' : 'grid-cols-1'} flex-1`}>
          {shouldShowNotes && (
            <TabsTrigger 
              value="notes" 
              className="flex items-center gap-1"
              data-testid="notes-tab"
            >
              <BookOpen className="h-4 w-4" />
              {!isVeryNarrow && <span>メモ</span>}
            </TabsTrigger>
          )}
          {shouldShowReviewPanel && (
            <TabsTrigger 
              value="reviews" 
              className="flex items-center gap-1"
              data-testid="reviews-tab"
            >
              <MessageSquare className="h-4 w-4" />
              {!isVeryNarrow && <span>レビュー</span>}
            </TabsTrigger>
          )}
        </TabsList>
        
        {/* Collapse/Expand button for desktop */}
        {!isMobile && onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="ml-2 h-8 w-8 p-0"
          >
            {isCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
          </Button>
        )}
        
        {/* Close button for mobile sheet */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSheetOpen(false)}
            className="ml-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <TabsContent value="notes" className="flex-grow overflow-hidden m-0 p-0">
        {shouldShowNotes && (
          <NotesPanel 
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            presenterNotes={presenterNotes}
            panelWidth={panelWidth}
            isNarrow={isNarrow}
            isVeryNarrow={isVeryNarrow}
          />
        )}
      </TabsContent>
      
      <TabsContent value="reviews" className="flex-grow overflow-hidden m-0 p-0">
        {shouldShowReviewPanel && (
          <ReviewPanel
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            panelWidth={panelWidth}
            isNarrow={isNarrow}
            isVeryNarrow={isVeryNarrow}
          />
        )}
      </TabsContent>
    </Tabs>
  );

  // Mobile implementation with Sheet
  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-4 right-4 z-50 shadow-lg"
          >
            {shouldShowNotes && shouldShowReviewPanel ? (
              <MessageSquare className="h-4 w-4 mr-1" />
            ) : shouldShowNotes ? (
              <BookOpen className="h-4 w-4 mr-1" />
            ) : (
              <MessageSquare className="h-4 w-4 mr-1" />
            )}
            パネル
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-md p-0">
          <div className="h-full bg-gray-50" ref={panelRef}>
            <PanelContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop implementation
  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-gray-50 border-l border-gray-200 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0 mb-2"
        >
          <PanelRightOpen className="h-4 w-4" />
        </Button>
        {shouldShowNotes && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 mb-1"
            title="メモパネル"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        )}
        {shouldShowReviewPanel && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="レビューパネル"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-gray-50 border-l border-gray-200 overflow-hidden flex flex-col" ref={panelRef}>
      <PanelContent />
    </div>
  );
};

export default SidePanel;
