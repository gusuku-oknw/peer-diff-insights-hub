
import React from "react";
import { useSimplifiedThumbnails } from "@/hooks/slideviewer/useSimplifiedThumbnails";
import SimplifiedSlideThumbnailsHeader from "./SimplifiedSlideThumbnailsHeader";
import SimplifiedSlideThumbnailsContent from "./SimplifiedSlideThumbnailsContent";
import SimplifiedSlideThumbnailsDialog from "./SimplifiedSlideThumbnailsDialog";

interface SimplifiedSlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  containerWidth: number;
  userType?: "student" | "enterprise";
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ポップアップモード用のスライドサムネイル表示コンポーネント
 * モバイルやタブレットなど、画面幅が制限される環境で使用
 */
const SimplifiedSlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  containerWidth,
  userType = "enterprise",
  isOpen,
  onClose
}: SimplifiedSlideThumbnailsProps) => {
  const {
    containerRef,
    slideData,
    slides,
    thumbnailWidth,
    gap,
    isMobile,
    isTablet,
    showAddSlide,
    scrollContainerRef,
    handleSlideClick,
    scrollByDirection
  } = useSimplifiedThumbnails({
    currentSlide,
    containerWidth,
    userType,
    isOpen,
    onSlideClick,
    onClose
  });

  // サムネイル表示コンテンツ
  const thumbnailsContent = (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-white"
      tabIndex={0}
      role="region"
      aria-label="スライド一覧"
    >
      {/* ヘッダー部分 */}
      <SimplifiedSlideThumbnailsHeader
        slidesCount={slides.length}
        currentSlide={currentSlide}
        onClose={onClose}
      />
      
      {/* メインコンテンツ部分 */}
      <SimplifiedSlideThumbnailsContent
        slideData={slideData}
        currentSlide={currentSlide}
        thumbnailWidth={thumbnailWidth}
        gap={gap}
        showAddSlide={showAddSlide}
        userType={userType}
        onSlideClick={handleSlideClick}
        onOpenOverallReview={onOpenOverallReview}
        onScrollLeft={() => scrollByDirection('left')}
        onScrollRight={() => scrollByDirection('right')}
        scrollContainerRef={scrollContainerRef}
      />
    </div>
  );

  return (
    <SimplifiedSlideThumbnailsDialog
      isOpen={isOpen}
      onClose={onClose}
      isMobile={isMobile}
      isTablet={isTablet}
    >
      {thumbnailsContent}
    </SimplifiedSlideThumbnailsDialog>
  );
};

export default SimplifiedSlideThumbnails;
