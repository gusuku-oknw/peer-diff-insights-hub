
import { useRef, useEffect } from "react";
import { useSlideStore } from "@/stores/slide-store";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";

interface ThumbnailContainerProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  containerWidth: number;
  children: React.ReactNode;
}

export const useThumbnailContainer = ({
  currentSlide,
  onSlideClick,
  containerWidth
}: Omit<ThumbnailContainerProps, 'children'>) => {
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
