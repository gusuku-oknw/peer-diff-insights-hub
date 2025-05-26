
import React, { useState, useRef, useEffect } from "react";
import { BookOpen, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import SidePanelContent from "../slideviewer/panels/components/SidePanelContent";
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
  
  const getDefaultTab = () => {
    if (shouldShowNotes && shouldShowReviewPanel) {
      return "notes";
    }
    return shouldShowNotes ? "notes" : "reviews";
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  console.log('ImprovedSidePanel render:', {
    shouldShowNotes,
    shouldShowReviewPanel,
    userType,
    currentSlide,
    activeTab
  });
  
  useEffect(() => {
    const newDefaultTab = getDefaultTab();
    setActiveTab(newDefaultTab);
  }, [shouldShowNotes, shouldShowReviewPanel]);
  
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
  
  const shouldDisplay = shouldShowNotes || shouldShowReviewPanel;
  
  if (!shouldDisplay || isHidden) {
    return null;
  }

  const handleAddComment = () => {
    if (userType === "enterprise") {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはレビューの閲覧のみ可能です",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "コメント追加",
      description: "新しいコメントを追加しました",
      variant: "default"
    });
  };

  const handleSendReview = () => {
    if (userType === "enterprise") {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはレビューの送信はできません",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "レビュー送信",
      description: "レビューを送信しました",
      variant: "default"
    });
  };

  const isNarrow = panelDimensions.width > 0 && panelDimensions.width < 280;
  const isVeryNarrow = panelDimensions.width > 0 && panelDimensions.width < 200;

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
            <SidePanelContent
              activeTab={activeTab}
              onTabChange={setActiveTab}
              shouldShowNotes={shouldShowNotes}
              shouldShowReviewPanel={shouldShowReviewPanel}
              isVeryNarrow={isVeryNarrow}
              isMobile={isMobile}
              userType={userType}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              onSheetClose={() => setIsSheetOpen(false)}
              onAddComment={handleAddComment}
              onSendReview={handleSendReview}
              panelDimensions={panelDimensions}
              presenterNotes={presenterNotes}
              isNarrow={isNarrow}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop implementation
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 overflow-hidden flex flex-col transition-all duration-300 ease-in-out shadow-sm" ref={panelRef}>
      <SidePanelContent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        shouldShowNotes={shouldShowNotes}
        shouldShowReviewPanel={shouldShowReviewPanel}
        isVeryNarrow={isVeryNarrow}
        isMobile={isMobile}
        userType={userType}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onToggleHide={onToggleHide}
        onAddComment={handleAddComment}
        onSendReview={handleSendReview}
        panelDimensions={panelDimensions}
        presenterNotes={presenterNotes}
        isNarrow={isNarrow}
      />
    </div>
  );
};

export default ImprovedSidePanel;
