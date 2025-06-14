
import React, { useRef, useEffect, useState } from "react";
import { useSlideStore } from "@/stores/slide-store";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import UnifiedSlideThumbnailsContainer from "./UnifiedSlideThumbnailsContainer";
import SimplifiedSlideThumbnailsContent from "./SimplifiedSlideThumbnailsContent";
import SimplifiedThumbnailHeader from "./SimplifiedThumbnailHeader";
import type { BaseThumbnailProps } from "@/types/slideviewer/thumbnail-common.types";

interface UnifiedSlideThumbnailsProps extends BaseThumbnailProps {
  height: number;
}

/**
 * 固定モード用のスライドサムネイル表示コンポーネント
 * デスクトップなど、画面幅に余裕がある環境で使用
 * 折りたたみ機能付き
 */
const UnifiedSlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise"
}: UnifiedSlideThumbnailsProps) => {
  const { slides } = useSlideStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // レスポンシブなサムネイルサイズの計算
  const { 
    thumbnailWidth, 
    gap 
  } = useResponsiveThumbnails({
    containerWidth,
    isPopupMode: false
  });

  const showAddSlide = userType === "enterprise";
  
  // スムーズスクロール機能
  const {
    scrollContainerRef,
    scrollToItem,
    scrollByDirection,
    handleKeyboardNavigation,
  } = useSmoothScroll({ itemWidth: thumbnailWidth, gap });
  
  // スライドデータの変換
  const slideData = slides.map((slide, index) => ({
    id: slide.id,
    title: slide.title || `スライド ${index + 1}`,
    thumbnail: slide.thumbnail,
    elements: slide.elements || [],
    hasComments: (slide as any).comments?.length > 0 || false,
    isReviewed: (slide as any).isReviewed || false
  }));

  // 折りたたみ時の高さ
  const collapsedHeight = 24; // Much smaller when collapsed
  const currentHeight = isCollapsed ? collapsedHeight : height;

  // Enhanced toggle function with smooth animation
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 現在のスライドへの自動スクロール
  useEffect(() => {
    if (!isCollapsed) {
      scrollToItem(currentSlide);
    }
  }, [currentSlide, scrollToItem, isCollapsed]);

  // Enhanced keyboard navigation with space bar toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        // Space bar to toggle collapse
        if (event.code === 'Space' && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          handleToggleCollapse();
          return;
        }
        
        handleKeyboardNavigation(event, currentSlide, slides.length, onSlideClick);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, onSlideClick, handleKeyboardNavigation, isCollapsed]);

  return (
    <UnifiedSlideThumbnailsContainer
      currentHeight={currentHeight}
      isCollapsed={isCollapsed}
      onToggleCollapse={handleToggleCollapse}
    >
      {!isCollapsed && (
        <>
          {/* ヘッダー部分 */}
          <SimplifiedThumbnailHeader
            slideCount={slides.length}
            userType={userType}
          />
          
          {/* メインコンテンツ部分 */}
          <SimplifiedSlideThumbnailsContent
            slideData={slideData}
            currentSlide={currentSlide}
            thumbnailWidth={thumbnailWidth}
            gap={gap}
            showAddSlide={showAddSlide}
            userType={userType}
            onSlideClick={onSlideClick}
            onOpenOverallReview={onOpenOverallReview}
            onScrollLeft={() => scrollByDirection('left')}
            onScrollRight={() => scrollByDirection('right')}
            scrollContainerRef={scrollContainerRef}
          />
        </>
      )}
    </UnifiedSlideThumbnailsContainer>
  );
};

export default UnifiedSlideThumbnails;
