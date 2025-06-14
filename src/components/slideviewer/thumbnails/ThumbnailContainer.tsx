
import { useRef, useEffect } from "react";
import { useSlideStore } from "@/stores/slide-store";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";

interface ThumbnailContainerProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  containerWidth: number;
  isPopupMode?: boolean;
}

export const useThumbnailContainer = ({
  currentSlide,
  onSlideClick,
  containerWidth,
  isPopupMode = false
}: ThumbnailContainerProps) => {
  const { slides } = useSlideStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // レスポンシブサムネイル設定を取得
  const { thumbnailWidth, gap } = useResponsiveThumbnails({ 
    containerWidth, 
    isPopupMode 
  });
  
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

  return {
    containerRef,
    scrollContainerRef,
    scrollByDirection,
    thumbnailWidth,
    gap,
    slideData,
    slides
  };
};
