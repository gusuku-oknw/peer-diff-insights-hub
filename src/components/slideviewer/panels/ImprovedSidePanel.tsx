
import React, { useState, useRef, useEffect } from "react";
import NotesPanel from "../../slide-viewer/panels/NotesPanel";
import SimplifiedReviewPanel from "./SimplifiedReviewPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useResizablePanels } from "@/hooks/useResizablePanels";
import type { SidePanelProps } from "@/types/slide-viewer/panel.types";

interface ImprovedSidePanelProps extends Omit<SidePanelProps, 'isCollapsed' | 'onToggleCollapse'> {
  userType: "student" | "enterprise";
  isHidden?: boolean;
  onToggleHide?: () => void;
  onWidthChange?: (width: number) => void;
  initialWidth?: number;
}

const ImprovedSidePanel = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
  isHidden = false,
  onToggleHide,
  userType,
  onWidthChange,
  initialWidth = 320,
}: ImprovedSidePanelProps) => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [panelDimensions, setPanelDimensions] = useState({ width: 0, height: 0 });
  
  // リサイズ機能を追加
  const { width, ResizeHandle } = useResizablePanels({
    initialWidth,
    minWidth: 220,
    maxWidth: 500,
    onWidthChange,
    orientation: 'vertical'
  });
  
  // Simplified default tab logic
  const getDefaultTab = () => {
    if (shouldShowReviewPanel) return "reviews";
    return shouldShowNotes ? "notes" : "reviews";
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const panelRef = useRef<HTMLDivElement>(null);
  
  console.log('ImprovedSidePanel render:', {
    shouldShowNotes,
    shouldShowReviewPanel,
    userType,
    currentSlide,
    activeTab,
    width
  });
  
  // FIXED: Prevent unwanted tab resets - only update when panel visibility actually changes
  useEffect(() => {
    const newDefaultTab = getDefaultTab();
    // Only change tab if the current tab is no longer valid for the new panel state
    if (activeTab === "notes" && !shouldShowNotes && shouldShowReviewPanel) {
      console.log('ImprovedSidePanel: Switching from notes to reviews (notes panel hidden)');
      setActiveTab("reviews");
    } else if (activeTab === "reviews" && !shouldShowReviewPanel && shouldShowNotes) {
      console.log('ImprovedSidePanel: Switching from reviews to notes (review panel hidden)');
      setActiveTab("notes");
    }
    // DO NOT reset tab if both panels are visible - let user control stay
  }, [shouldShowNotes, shouldShowReviewPanel]); // Removed activeTab from dependencies to prevent loops
  
  // Track panel dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        setPanelDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setPanelDimensions({ width, height });
      }
    });
    
    if (panelRef.current) {
      resizeObserver.observe(panelRef.current);
    }

    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Determine if we should display the panel at all
  const shouldDisplay = shouldShowNotes || shouldShowReviewPanel;
  
  if (!shouldDisplay || isHidden) {
    return null;
  }

  // Determine layout mode based on actual panel width
  const isNarrow = panelDimensions.width > 0 && panelDimensions.width < 280;
  const isVeryNarrow = panelDimensions.width > 0 && panelDimensions.width < 200;

  // Enhanced tab change handler with strict control
  const handleTabChange = (newTab: string) => {
    console.log('ImprovedSidePanel: Manual tab change requested', { from: activeTab, to: newTab });
    setActiveTab(newTab);
  };

  // Simplified panel content
  const PanelContent = () => (
    <div className="h-full flex flex-col relative z-10">
      {shouldShowNotes && shouldShowReviewPanel ? (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
          <div className={`${isVeryNarrow ? 'px-2 py-1' : 'px-4 py-2'} border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 relative z-20`}>
            <TabsList className="grid grid-cols-2 flex-1 min-w-0 bg-white shadow-sm">
              <TabsTrigger 
                value="notes" 
                className={`flex items-center gap-1 ${isVeryNarrow ? 'px-1' : 'px-2'} min-w-0 transition-all hover:bg-blue-50 data-[state=active]:bg-blue-100`}
              >
                <BookOpen className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0 text-blue-600`} />
                {!isVeryNarrow && <span className="truncate font-medium">メモ</span>}
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className={`flex items-center gap-1 ${isVeryNarrow ? 'px-1' : 'px-2'} min-w-0 transition-all hover:bg-purple-50 data-[state=active]:bg-purple-100`}
              >
                <MessageSquare className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0 text-purple-600`} />
                {!isVeryNarrow && <span className="truncate font-medium">レビュー</span>}
              </TabsTrigger>
            </TabsList>
            
            {/* Close button */}
            {!isMobile && onToggleHide && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleHide}
                className={`ml-2 ${isVeryNarrow ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'} flex-shrink-0 hover:bg-gray-200 transition-colors relative z-30`}
                title="パネルを閉じる"
              >
                <X className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />
              </Button>
            )}
            
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSheetOpen(false)}
                className="ml-2 h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-200 transition-colors relative z-30"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <TabsContent value="notes" className="flex-grow overflow-hidden m-0 p-0 min-h-0">
            <NotesPanel 
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
              panelWidth={panelDimensions.width}
              panelHeight={panelDimensions.height}
              isNarrow={isNarrow}
              isVeryNarrow={isVeryNarrow}
            />
          </TabsContent>
          
          <TabsContent value="reviews" className="flex-grow overflow-hidden m-0 p-0 min-h-0">
            <SimplifiedReviewPanel
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              userType={userType}
              panelWidth={panelDimensions.width}
              panelHeight={panelDimensions.height}
              isNarrow={isNarrow}
              isVeryNarrow={isVeryNarrow}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </TabsContent>
        </Tabs>
      ) : shouldShowReviewPanel ? (
        <SimplifiedReviewPanel
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          userType={userType}
          panelWidth={panelDimensions.width}
          panelHeight={panelDimensions.height}
          isNarrow={isNarrow}
          isVeryNarrow={isVeryNarrow}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      ) : shouldShowNotes ? (
        <NotesPanel 
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          presenterNotes={presenterNotes}
          panelWidth={panelDimensions.width}
          panelHeight={panelDimensions.height}
          isNarrow={isNarrow}
          isVeryNarrow={isVeryNarrow}
        />
      ) : null}
    </div>
  );

  // Mobile implementation with Sheet
  if (isMobile) {
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
            <PanelContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop implementation with resizable functionality
  return (
    <div 
      className="h-full bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 overflow-hidden flex flex-col transition-all duration-300 ease-in-out shadow-sm relative z-10" 
      ref={panelRef}
      style={{ width }}
    >
      {/* Resize handle on the left side */}
      <ResizeHandle position="left" className="z-30" />
      
      <PanelContent />
    </div>
  );
};

export default ImprovedSidePanel;
