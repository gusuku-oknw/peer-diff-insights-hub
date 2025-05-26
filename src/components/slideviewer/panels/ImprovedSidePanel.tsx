
import React, { useState, useRef, useEffect } from "react";
import NotesPanel from "./NotesPanel";
import ReviewPanel from "./ReviewPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare, X, PanelRightClose, PanelRightOpen, Plus, Edit3, Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { SidePanelProps } from "@/types/slide-viewer/panel.types";

const ImprovedSidePanel = ({
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
  const [panelDimensions, setPanelDimensions] = useState({ width: 0, height: 0 });
  const [activeTab, setActiveTab] = useState(shouldShowNotes ? "notes" : "reviews");
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Track panel dimensions with ResizeObserver
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
  
  if (!shouldDisplay) {
    return null;
  }

  // Quick action handlers
  const handleAddComment = () => {
    toast({
      title: "コメント追加",
      description: "コメント追加機能を実装中です",
    });
  };

  const handleEditNote = () => {
    toast({
      title: "ノート編集",
      description: "ノート編集機能を実装中です",
    });
  };

  const handleSendReview = () => {
    toast({
      title: "レビュー送信",
      description: "レビュー送信機能を実装中です",
    });
  };

  // Determine layout mode based on actual panel width
  const isNarrow = panelDimensions.width > 0 && panelDimensions.width < 280;
  const isVeryNarrow = panelDimensions.width > 0 && panelDimensions.width < 200;

  // Default to the tab that's enabled
  const defaultTab = shouldShowNotes ? "notes" : "reviews";
  
  // Panel content component
  const PanelContent = () => (
    <div className="h-full flex flex-col" style={{ minWidth: 0 }}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className={`${isVeryNarrow ? 'px-2 py-1' : 'px-4 py-2'} border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-gray-50`}>
          <TabsList className={`grid ${shouldShowNotes && shouldShowReviewPanel ? 'grid-cols-2' : 'grid-cols-1'} flex-1 min-w-0 bg-white`}>
            {shouldShowNotes && (
              <TabsTrigger 
                value="notes" 
                className={`flex items-center gap-1 ${isVeryNarrow ? 'px-1' : 'px-2'} min-w-0 relative`}
                data-testid="notes-tab"
              >
                <BookOpen className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0`} />
                {!isVeryNarrow && <span className="truncate">メモ</span>}
                {presenterNotes[currentSlide] && (
                  <Badge variant="secondary" className="h-4 w-4 p-0 text-xs rounded-full">
                    1
                  </Badge>
                )}
              </TabsTrigger>
            )}
            {shouldShowReviewPanel && (
              <TabsTrigger 
                value="reviews" 
                className={`flex items-center gap-1 ${isVeryNarrow ? 'px-1' : 'px-2'} min-w-0 relative`}
                data-testid="reviews-tab"
              >
                <MessageSquare className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0`} />
                {!isVeryNarrow && <span className="truncate">レビュー</span>}
                <Badge variant="destructive" className="h-4 w-4 p-0 text-xs rounded-full">
                  3
                </Badge>
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Collapse/Expand button for desktop */}
          {!isMobile && onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={`ml-2 ${isVeryNarrow ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'} flex-shrink-0 hover:bg-gray-200 transition-colors`}
              title={isCollapsed ? "パネルを展開" : "パネルを折りたたみ"}
            >
              {isCollapsed ? (
                <PanelRightOpen className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'}`} />
              ) : (
                <PanelRightClose className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'}`} />
              )}
            </Button>
          )}
          
          {/* Close button for mobile sheet */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSheetOpen(false)}
              className="ml-2 h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick action buttons when not very narrow */}
        {!isVeryNarrow && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center space-x-1">
              {activeTab === "notes" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditNote}
                  className="h-7 px-2 text-xs hover:bg-gray-200"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  編集
                </Button>
              )}
              {activeTab === "reviews" && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddComment}
                    className="h-7 px-2 text-xs hover:bg-gray-200"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    追加
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSendReview}
                    className="h-7 px-2 text-xs hover:bg-gray-200"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    送信
                  </Button>
                </>
              )}
            </div>
            <div className="text-xs text-gray-500">
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
            />
          )}
        </TabsContent>
      </Tabs>
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
            className="fixed bottom-4 right-4 z-50 shadow-lg bg-white hover:bg-gray-50"
          >
            {shouldShowNotes && shouldShowReviewPanel ? (
              <MessageSquare className="h-4 w-4 mr-1" />
            ) : shouldShowNotes ? (
              <BookOpen className="h-4 w-4 mr-1" />
            ) : (
              <MessageSquare className="h-4 w-4 mr-1" />
            )}
            パネル
            {(presenterNotes[currentSlide] || shouldShowReviewPanel) && (
              <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs rounded-full">
                !
              </Badge>
            )}
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
      <div className="w-12 h-full bg-gray-50 border-l border-gray-200 flex flex-col items-center py-4 flex-shrink-0 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0 mb-4 hover:bg-gray-200 transition-colors"
          title="パネルを展開"
        >
          <PanelRightOpen className="h-4 w-4" />
        </Button>
        
        {/* Quick access buttons when collapsed */}
        <div className="flex flex-col space-y-2">
          {shouldShowNotes && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 relative hover:bg-gray-200 transition-colors"
              title="メモパネル"
              onClick={() => {
                onToggleCollapse?.();
                setActiveTab("notes");
              }}
            >
              <BookOpen className="h-4 w-4" />
              {presenterNotes[currentSlide] && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </Button>
          )}
          {shouldShowReviewPanel && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 relative hover:bg-gray-200 transition-colors"
              title="レビューパネル"
              onClick={() => {
                onToggleCollapse?.();
                setActiveTab("reviews");
              }}
            >
              <MessageSquare className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </Button>
          )}
        </div>

        {/* Quick action buttons when collapsed */}
        <div className="mt-auto flex flex-col space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-gray-200 transition-colors"
            title="クイックコメント追加"
            onClick={handleAddComment}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-gray-200 transition-colors"
            title="レビュー送信"
            onClick={handleSendReview}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 border-l border-gray-200 overflow-hidden flex flex-col flex-shrink-0 min-w-0 transition-all duration-300 ease-in-out" ref={panelRef}>
      <PanelContent />
    </div>
  );
};

export default ImprovedSidePanel;
