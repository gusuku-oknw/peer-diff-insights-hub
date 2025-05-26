import React, { useState, useRef, useEffect } from "react";
import NotesPanel from "../../slide-viewer/panels/NotesPanel";
import ReviewPanel from "../../slide-viewer/panels/ReviewPanel";
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
      description: "新しいコメントを追加しました",
      variant: "default"
    });
  };

  const handleEditNote = () => {
    toast({
      title: "ノート編集",
      description: "ノートの編集モードを開始しました",
      variant: "default"
    });
  };

  const handleSendReview = () => {
    toast({
      title: "レビュー送信",
      description: "レビューを送信しました",
      variant: "default"
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
                {presenterNotes[currentSlide] && (
                  <Badge variant="secondary" className="h-4 w-4 p-0 text-xs rounded-full bg-blue-500 text-white">
                    1
                  </Badge>
                )}
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
          
          {/* Collapse/Expand button for desktop */}
          {!isMobile && onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={`ml-2 ${isVeryNarrow ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'} flex-shrink-0 hover:bg-gray-200 transition-all duration-200 hover:scale-105`}
              title={isCollapsed ? "パネルを展開" : "パネルを折りたたみ"}
            >
              {isCollapsed ? (
                <PanelRightOpen className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />
              ) : (
                <PanelRightClose className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />
              )}
            </Button>
          )}
          
          {/* Close button for mobile sheet */}
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

        {/* Quick action buttons when not very narrow */}
        {!isVeryNarrow && (
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
            <div className="flex items-center space-x-1">
              {activeTab === "notes" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditNote}
                  className="h-7 px-2 text-xs hover:bg-blue-100 transition-all duration-200 hover:scale-105 bg-blue-50 border border-blue-200"
                >
                  <Edit3 className="h-3 w-3 mr-1 text-blue-600" />
                  <span className="text-blue-700 font-medium">編集</span>
                </Button>
              )}
              {activeTab === "reviews" && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddComment}
                    className="h-7 px-2 text-xs hover:bg-green-100 transition-all duration-200 hover:scale-105 bg-green-50 border border-green-200"
                  >
                    <Plus className="h-3 w-3 mr-1 text-green-600" />
                    <span className="text-green-700 font-medium">追加</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSendReview}
                    className="h-7 px-2 text-xs hover:bg-purple-100 transition-all duration-200 hover:scale-105 bg-purple-50 border border-purple-200"
                  >
                    <Send className="h-3 w-3 mr-1 text-purple-600" />
                    <span className="text-purple-700 font-medium">送信</span>
                  </Button>
                </>
              )}
            </div>
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
            className="fixed bottom-4 right-4 z-50 shadow-lg bg-white hover:bg-gray-50 border-2 transition-all duration-200 hover:scale-105"
          >
            {shouldShowNotes && shouldShowReviewPanel ? (
              <MessageSquare className="h-4 w-4 mr-1 text-purple-600" />
            ) : shouldShowNotes ? (
              <BookOpen className="h-4 w-4 mr-1 text-blue-600" />
            ) : (
              <MessageSquare className="h-4 w-4 mr-1 text-red-600" />
            )}
            <span className="font-medium">パネル</span>
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
  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 flex flex-col items-center py-4 flex-shrink-0 relative shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0 mb-4 hover:bg-blue-100 transition-all duration-200 hover:scale-110 bg-blue-50 border border-blue-200"
          title="パネルを展開"
        >
          <PanelRightOpen className="h-4 w-4 text-blue-600" />
        </Button>
        
        {/* Quick access buttons when collapsed */}
        <div className="flex flex-col space-y-2">
          {shouldShowNotes && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 relative hover:bg-blue-100 transition-all duration-200 hover:scale-110 bg-blue-50 border border-blue-200"
              title="メモパネル"
              onClick={() => {
                onToggleCollapse?.();
                setActiveTab("notes");
              }}
            >
              <BookOpen className="h-4 w-4 text-blue-600" />
              {presenterNotes[currentSlide] && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </Button>
          )}
          {shouldShowReviewPanel && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 relative hover:bg-red-100 transition-all duration-200 hover:scale-110 bg-red-50 border border-red-200"
              title="レビューパネル"
              onClick={() => {
                onToggleCollapse?.();
                setActiveTab("reviews");
              }}
            >
              <MessageSquare className="h-4 w-4 text-red-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
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
            className="h-6 w-6 p-0 hover:bg-green-100 transition-all duration-200 hover:scale-110 bg-green-50 border border-green-200"
            title="クイックコメント追加"
            onClick={handleAddComment}
          >
            <Plus className="h-3 w-3 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-purple-100 transition-all duration-200 hover:scale-110 bg-purple-50 border border-purple-200"
            title="レビュー送信"
            onClick={handleSendReview}
          >
            <Send className="h-3 w-3 text-purple-600" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 overflow-hidden flex flex-col flex-shrink-0 min-w-0 transition-all duration-300 ease-in-out shadow-sm" ref={panelRef}>
      <PanelContent />
    </div>
  );
};

export default ImprovedSidePanel;
