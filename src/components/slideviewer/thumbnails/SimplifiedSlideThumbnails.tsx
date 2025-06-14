
import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/stores/slide-store";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import MinimalThumbnailCard from "./MinimalThumbnailCard";
import AddSlideCard from "./AddSlideCard";
import EvaluationCard from "./EvaluationCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface SimplifiedSlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  containerWidth: number;
  userType?: "student" | "enterprise";
  isOpen: boolean;
  onClose: () => void;
}

const SimplifiedSlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  containerWidth,
  userType = "enterprise",
  isOpen,
  onClose
}: SimplifiedSlideThumbnailsProps) => {
  const { slides } = useSlideStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // レスポンシブサムネイル設定
  const { 
    thumbnailWidth, 
    gap, 
    isMobile 
  } = useResponsiveThumbnails({
    containerWidth,
    isPopupMode: true
  });

  const showAddSlide = userType === "enterprise";
  
  // スムーズスクロールフック
  const {
    scrollContainerRef,
    scrollToItem,
    scrollByDirection,
    handleKeyboardNavigation,
  } = useSmoothScroll({ itemWidth: thumbnailWidth, gap });
  
  // 改善されたスライドデータ（実際のデータを優先）
  const slideData = slides.map((slide, index) => ({
    id: slide.id,
    title: slide.title || `スライド ${index + 1}`,
    thumbnail: slide.thumbnail,
    elements: slide.elements || [],
    hasComments: slide.comments?.length > 0 || false,
    isReviewed: slide.isReviewed || false
  }));

  const handleSlideClick = (slideIndex: number) => {
    onSlideClick(slideIndex);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      scrollToItem(currentSlide);
    }
  }, [currentSlide, scrollToItem, isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && containerRef.current?.contains(event.target as Node)) {
        handleKeyboardNavigation(event, currentSlide, slides.length, handleSlideClick);
        
        if (event.key === 'Escape') {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, handleSlideClick, handleKeyboardNavigation, isOpen, onClose]);

  // サムネイル一覧のコンテンツ
  const thumbnailsContent = (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-white"
      tabIndex={0}
      role="region"
      aria-label="スライド一覧"
    >
      {/* ヘッダー */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg text-gray-800">
            スライド一覧
          </h3>
          <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-600 text-sm rounded-full font-medium">
            {slides.length} スライド
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 hover:bg-gray-100"
          onClick={onClose}
          aria-label="スライド一覧を閉じる"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* サムネイル一覧 */}
      <div className="flex-1 relative overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
          onClick={() => scrollByDirection('left')}
          aria-label="前のスライドへスクロール"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
          onClick={() => scrollByDirection('right')}
          aria-label="次のスライドへスクロール"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        
        <div
          ref={scrollContainerRef}
          className="flex items-center h-full px-6 py-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-all duration-300 ease-in-out scroll-smooth"
          style={{ gap: `${gap}px` }}
          role="tablist"
          aria-label="スライドサムネイル"
        >
          {slideData.map((slide, index) => (
            <div 
              key={slide.id} 
              data-slide={index + 1}
              className="flex-shrink-0 transition-all duration-300 ease-in-out"
              role="tab"
              aria-selected={currentSlide === index + 1}
            >
              <MinimalThumbnailCard
                slide={slide}
                slideIndex={index + 1}
                isActive={currentSlide === index + 1}
                thumbnailWidth={thumbnailWidth}
                onClick={handleSlideClick}
                userType={userType}
              />
            </div>
          ))}
          
          {showAddSlide && (
            <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
              <AddSlideCard thumbnailWidth={thumbnailWidth} />
            </div>
          )}
          
          <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
            <EvaluationCard 
              thumbnailWidth={thumbnailWidth}
              onOpenOverallReview={onOpenOverallReview}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // モバイル・タブレット：Drawer表示
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[75vh] max-h-[75vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>スライド一覧</DrawerTitle>
          </DrawerHeader>
          {thumbnailsContent}
        </DrawerContent>
      </Drawer>
    );
  }

  // デスクトップ：Dialog表示
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[75vh] max-h-[75vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>スライド一覧</DialogTitle>
        </DialogHeader>
        {thumbnailsContent}
      </DialogContent>
    </Dialog>
  );
};

export default SimplifiedSlideThumbnails;
