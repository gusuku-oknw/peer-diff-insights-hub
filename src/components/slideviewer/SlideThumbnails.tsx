
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/stores/slide-store";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import EnhancedSlideThumbnails from "./thumbnails/EnhancedSlideThumbnails";
import ImprovedSlideThumbnails from "./thumbnails/ImprovedSlideThumbnails";
import SimplifiedSlideThumbnails from "./thumbnails/SimplifiedSlideThumbnails";
import SimplifiedThumbnailHeader from "./thumbnails/SimplifiedThumbnailHeader";
import ThumbnailNavigationButtons from "./thumbnails/ThumbnailNavigationButtons";
import ThumbnailScrollArea from "./thumbnails/ThumbnailScrollArea";
import { useThumbnailContainer } from "./thumbnails/ThumbnailContainer";

interface SlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
  enhanced?: boolean;
  showAsPopup?: boolean;
  // 新しいプロパティ：改善版UI/UXを使用するかどうか
  useImprovedUI?: boolean;
}

const SlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise",
  enhanced = false,
  showAsPopup = false,
  useImprovedUI = true // デフォルトで改善版を使用
}: SlideThumbnailsProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { slides } = useSlideStore();

  // レスポンシブ判定
  const { shouldUsePopup, optimalHeight } = useResponsiveThumbnails({
    containerWidth,
    isPopupMode: false
  });

  // 強制ポップアップまたは自動判定でポップアップを使用
  const usePopupMode = showAsPopup || shouldUsePopup;

  // ポップアップモードの場合
  if (usePopupMode) {
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

  // 改善版UI/UXを使用する場合
  if (useImprovedUI) {
    return (
      <ImprovedSlideThumbnails
        currentSlide={currentSlide}
        onSlideClick={onSlideClick}
        onOpenOverallReview={onOpenOverallReview}
        height={Math.max(height, optimalHeight)}
        containerWidth={containerWidth}
        userType={userType}
        showAsPopup={showAsPopup}
      />
    );
  }

  // 拡張版を使用する場合（従来版）
  if (enhanced) {
    return (
      <EnhancedSlideThumbnails
        currentSlide={currentSlide}
        onSlideClick={onSlideClick}
        onOpenOverallReview={onOpenOverallReview}
        height={Math.max(height, optimalHeight)}
        containerWidth={containerWidth}
        userType={userType}
      />
    );
  }

  // 固定表示モード（従来版）
  const {
    containerRef,
    scrollContainerRef,
    scrollByDirection,
    thumbnailWidth,
    gap,
    slideData
  } = useThumbnailContainer({
    currentSlide,
    onSlideClick,
    containerWidth,
    isPopupMode: false
  });

  const showAddSlide = userType === "enterprise";
  const adjustedHeight = Math.max(height, optimalHeight);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-white border-t border-gray-200"
      style={{ height: `${adjustedHeight}px` }}
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
          scrollContainerRef={scrollContainerRef}
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
