
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/stores/slide-store";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import SimplifiedThumbnailHeader from "./thumbnails/SimplifiedThumbnailHeader";
import MinimalThumbnailCard from "./thumbnails/MinimalThumbnailCard";
import EnhancedSlideThumbnails from "./thumbnails/EnhancedSlideThumbnails";
import SimplifiedSlideThumbnails from "./thumbnails/SimplifiedSlideThumbnails";
import AddSlideCard from "./thumbnails/AddSlideCard";
import EvaluationCard from "./thumbnails/EvaluationCard";

interface SlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
  enhanced?: boolean;
  showAsPopup?: boolean;
}

const SlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise",
  enhanced = false,
  showAsPopup = false
}: SlideThumbnailsProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ポップアップモードの場合
  if (showAsPopup) {
    return (
      <>
        {/* ポップアップ開くトリガーボタン */}
        <div className="flex items-center justify-center p-4 border-t border-gray-200 bg-white">
          <Button
            onClick={() => setIsPopupOpen(true)}
            variant="outline"
            className="w-full max-w-sm"
          >
            スライド一覧を表示 ({currentSlide}/{useSlideStore.getState().slides.length})
          </Button>
        </div>
        
        {/* ポップアップ */}
        <SimplifiedSlideThumbnails
          currentSlide={currentSlide}
          onSlideClick={onSlideClick}
          onOpenOverallReview={onOpenOverallReview}
          containerWidth={containerWidth}
          userType={userType}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </>
    );
  }

  // 拡張版を使用する場合
  if (enhanced) {
    return (
      <EnhancedSlideThumbnails
        currentSlide={currentSlide}
        onSlideClick={onSlideClick}
        onOpenOverallReview={onOpenOverallReview}
        height={height}
        containerWidth={containerWidth}
        userType={userType}
      />
    );
  }

  // 従来のUI実装（簡素化版・サイズ改善）
  const { slides } = useSlideStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 改善されたサムネイルサイズ計算（大幅に拡大）
  const calculateThumbnailSize = (width: number) => {
    // コンテナ幅の20-25%をベースとし、大きめに設定
    const basePercentage = 0.22; // 22%
    const calculatedSize = width * basePercentage;
    
    // 最小200px、最大300pxの範囲で調整（従来の140-180pxから大幅改善）
    return Math.max(200, Math.min(300, calculatedSize));
  };

  const thumbnailWidth = calculateThumbnailSize(containerWidth);
  const gap = Math.max(16, Math.min(24, containerWidth * 0.02)); // ギャップも少し拡大
  const showAddSlide = userType === "enterprise";
  
  // スムーズスクロールフック
  const {
    scrollContainerRef,
    scrollToItem,
    scrollByDirection,
    handleKeyboardNavigation,
  } = useSmoothScroll({ itemWidth: thumbnailWidth, gap });
  
  // 簡素化されたスライドデータ
  const slideData = slides.map((slide, index) => ({
    id: slide.id,
    title: slide.title || `スライド ${index + 1}`,
    thumbnail: slide.thumbnail,
    elements: slide.elements || [],
    hasComments: Math.random() > 0.8,
    isReviewed: Math.random() > 0.6
  }));

  useEffect(() => {
    scrollToItem(currentSlide);
  }, [currentSlide, scrollToItem]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        handleKeyboardNavigation(event, currentSlide, slides.length, onSlideClick);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, onSlideClick, handleKeyboardNavigation]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-white border-t border-gray-200"
      tabIndex={0}
      role="region"
      aria-label="スライド一覧"
    >
      <SimplifiedThumbnailHeader 
        slideCount={slides.length}
        userType={userType}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
          onClick={() => scrollByDirection('left')}
          aria-label="前のスライドへスクロール"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
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
                onClick={onSlideClick}
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
};

export default SlideThumbnails;
