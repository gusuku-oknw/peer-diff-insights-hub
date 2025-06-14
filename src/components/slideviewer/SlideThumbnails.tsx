
import { useState } from "react";
import { Button } from "@/components/ui/button";
import EnhancedSlideThumbnails from "./thumbnails/EnhancedSlideThumbnails";
import SimplifiedSlideThumbnails from "./thumbnails/SimplifiedSlideThumbnails";
import SimplifiedThumbnailHeader from "./thumbnails/SimplifiedThumbnailHeader";
import ThumbnailNavigationButtons from "./thumbnails/ThumbnailNavigationButtons";
import ThumbnailScrollArea from "./thumbnails/ThumbnailScrollArea";
import { useThumbnailContainer } from "./thumbnails/ThumbnailContainer";
import { useSlideStore } from "@/stores/slide-store";

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
  const { slides } = useSlideStore();

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
            スライド一覧を表示 ({currentSlide}/{slides.length})
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
  const {
    containerRef,
    scrollByDirection,
    thumbnailWidth,
    gap,
    slideData
  } = useThumbnailContainer({
    currentSlide,
    onSlideClick,
    containerWidth
  });

  const showAddSlide = userType === "enterprise";

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
        <ThumbnailNavigationButtons
          onScrollLeft={() => scrollByDirection('left')}
          onScrollRight={() => scrollByDirection('right')}
        />
        
        <ThumbnailScrollArea
          scrollContainerRef={useThumbnailContainer({ currentSlide, onSlideClick, containerWidth }).scrollContainerRef}
          slideData={slideData}
          currentSlide={currentSlide}
          thumbnailWidth={thumbnailWidth}
          gap={gap}
          onSlideClick={onSlideClick}
          userType={userType}
          showAddSlide={showAddSlide}
          onOpenOverallReview={onOpenOverallReview}
        />
      </div>
    </div>
  );
};

export default SlideThumbnails;
