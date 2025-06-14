
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
    isMobile,
    isTablet 
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
    hasComments: (slide as any).comments?.length > 0 || false,
    isReviewed: (slide as any).isReviewed || false
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

  // レスポンシブ高さ計算
  const getOptimalHeight = () => {
    if (isMobile) return 'h-[95vh]';
    if (isTablet) return 'h-[90vh]';
    return 'h-[85vh]';
  };

  // サムネイル一覧のコンテンツ
  const thumbnailsContent = (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-white"
      tabIndex={0}
      role="region"
      aria-label="スライド一覧"
    >
      {/* 改善されたヘッダー */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-xl text-gray-800">
            スライド一覧
          </h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">
              {slides.length} スライド
            </span>
            <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-full font-medium">
              現在: {currentSlide}
            </span>
          </div>
        </div>
        
        {/* 大幅改善された閉じるボタン */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:block">
            ESCキーでも閉じます
          </span>
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-12 p-0 hover:bg-red-50 hover:border-red-200 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={onClose}
            aria-label="スライド一覧を閉じる"
          >
            <X className="h-6 w-6 text-gray-600 hover:text-red-600 transition-colors" />
          </Button>
        </div>
      </div>
      
      {/* 最大化されたサムネイル一覧 */}
      <div className="flex-1 relative overflow-hidden">
        {/* 改善されたナビゲーションボタン */}
        <Button
          variant="outline"
          size="lg"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 h-12 w-12 p-0 bg-white/95 shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-200 border-gray-300 rounded-full"
          onClick={() => scrollByDirection('left')}
          aria-label="前のスライドへスクロール"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 h-12 w-12 p-0 bg-white/95 shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-200 border-gray-300 rounded-full"
          onClick={() => scrollByDirection('right')}
          aria-label="次のスライドへスクロール"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        <div
          ref={scrollContainerRef}
          className="flex items-center h-full px-8 py-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-all duration-300 ease-in-out scroll-smooth"
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

  // モバイル・タブレット：Drawer表示（最大化）
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className={`${getOptimalHeight()} max-h-[95vh]`}>
          <DrawerHeader className="sr-only">
            <DrawerTitle>スライド一覧</DrawerTitle>
          </DrawerHeader>
          {thumbnailsContent}
        </DrawerContent>
      </Drawer>
    );
  }

  // デスクトップ：Dialog表示（最大化）
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-7xl ${getOptimalHeight()} max-h-[85vh] p-0`}>
        <DialogHeader className="sr-only">
          <DialogTitle>スライド一覧</DialogTitle>
        </DialogHeader>
        {thumbnailsContent}
      </DialogContent>
    </Dialog>
  );
};

export default SimplifiedSlideThumbnails;
