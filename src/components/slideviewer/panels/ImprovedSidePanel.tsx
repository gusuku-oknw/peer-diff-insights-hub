
import React, { useState, useRef, useEffect } from "react";
import NotesPanel from "../../slide-viewer/panels/NotesPanel";
import SimplifiedReviewPanel from "./SimplifiedReviewPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { SidePanelProps } from "@/types/slide-viewer/panel.types";

interface ImprovedSidePanelProps extends Omit<SidePanelProps, 'isCollapsed' | 'onToggleCollapse'> {
  userType: "student" | "enterprise";
  isHidden?: boolean;
  onToggleHide?: () => void;
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
}: ImprovedSidePanelProps) => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [panelDimensions, setPanelDimensions] = useState({ width: 0, height: 0 });
  
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
    activeTab
  });
  
  // Update tab when panel visibility changes
  useEffect(() => {
    const newDefaultTab = getDefaultTab();
    setActiveTab(newDefaultTab);
  }, [shouldShowNotes, shouldShowReviewPanel]);
  
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

  // Simplified panel content
  const PanelContent = () => (
    <div className="h-full flex flex-col">
      {shouldShowNotes && shouldShowReviewPanel ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className={`${isVeryNarrow ? 'px-2 py-1' : 'px-4 py-2'} border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50`}>
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
                className={`ml-2 ${isVeryNarrow ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'} flex-shrink-0 hover:bg-gray-200 transition-colors`}
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
                className="ml-2 h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-200 transition-colors"
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
        <SheetContent side="right" className="w-full max-w-md p-0">
          <div className="h-full bg-gradient-to-b from-gray-50 to-white" ref={panelRef}>
            <PanelContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop implementation
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 overflow-hidden flex flex-col transition-all duration-300 ease-in-out shadow-sm" ref={panelRef}>
      <PanelContent />
    </div>
  );
};

export default ImprovedSidePanel;
