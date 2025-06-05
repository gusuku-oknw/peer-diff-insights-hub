
import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/stores/slide-store";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import ThumbnailHeader from "./thumbnails/ThumbnailHeader";
import ThumbnailCard from "./thumbnails/ThumbnailCard";
import AddSlideCard from "./thumbnails/AddSlideCard";
import EvaluationCard from "./thumbnails/EvaluationCard";

interface SlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
}

const SlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise"
}: SlideThumbnailsProps) => {
  const { slides } = useSlideStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced responsive thumbnail size calculation
  const calculateThumbnailSize = (width: number) => {
    if (width < 600) {
      return Math.max(80, Math.min(120, width * 0.12));
    } else if (width < 900) {
      return Math.max(100, Math.min(150, width * 0.14));
    } else if (width < 1200) {
      return Math.max(120, Math.min(180, width * 0.15));
    } else if (width < 1600) {
      return Math.max(140, Math.min(200, width * 0.16));
    } else {
      return Math.max(160, Math.min(220, width * 0.17));
    }
  };
  
  const thumbnailWidth = calculateThumbnailSize(containerWidth);
  const gap = Math.max(8, Math.min(16, containerWidth * 0.01));
  const showAddSlide = userType === "enterprise";
  
  // スムーズスクロールフックを使用
  const {
    scrollContainerRef,
    scrollToItem,
    scrollByDirection,
    handleKeyboardNavigation,
  } = useSmoothScroll({ itemWidth: thumbnailWidth, gap });
  
  const mockSlideData = slides.map((slide, index) => ({
    id: slide.id,
    title: slide.title || `スライド ${index + 1}`,
    thumbnail: slide.thumbnail,
    elements: slide.elements || [],
    hasComments: Math.random() > 0.7,
    commentCount: Math.floor(Math.random() * 5),
    isReviewed: Math.random() > 0.5
  }));
  
  const reviewedCount = mockSlideData.filter(slide => slide.isReviewed).length;
  const totalComments = mockSlideData.reduce((sum, slide) => sum + slide.commentCount, 0);

  // 現在のスライドに自動スクロール（改善版）
  useEffect(() => {
    scrollToItem(currentSlide);
  }, [currentSlide, scrollToItem]);

  // キーボードナビゲーション
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
      <ThumbnailHeader 
        slideCount={slides.length}
        userType={userType}
        reviewedCount={reviewedCount}
        totalComments={totalComments}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
          onClick={() => scrollByDirection('left')}
          aria-label="前のスライドへスクロール"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
          onClick={() => scrollByDirection('right')}
          aria-label="次のスライドへスクロール"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div
          ref={scrollContainerRef}
          className="flex items-center h-full px-4 lg:px-6 py-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-all duration-300 ease-in-out scroll-smooth"
          style={{ 
            scrollbarWidth: 'thin',
            gap: `${gap}px`
          }}
          role="tablist"
          aria-label="スライドサムネイル"
        >
          {mockSlideData.map((slide, index) => (
            <div 
              key={slide.id} 
              data-slide={index + 1}
              className="flex-shrink-0 transition-all duration-300 ease-in-out"
              role="tab"
              aria-selected={currentSlide === index + 1}
            >
              <ThumbnailCard
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
