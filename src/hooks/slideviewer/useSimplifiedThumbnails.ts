
import { useRef, useEffect } from 'react';
import { useSlideStore } from '@/stores/slide-store';
import { useSmoothScroll } from './useSmoothScroll';
import { useResponsiveThumbnails } from './useResponsiveThumbnails';
import type { UserType } from '@/types/slideviewer/thumbnail-common.types';

interface UseSimplifiedThumbnailsProps {
  currentSlide: number;
  containerWidth: number;
  userType: UserType;
  isOpen: boolean;
  onSlideClick: (slideIndex: number) => void;
  onClose: () => void;
}

/**
 * SimplifiedSlideThumbnailsのロジックを管理するカスタムフック
 * スライドデータの変換、スクロール機能、キーボードナビゲーションを提供
 */
export const useSimplifiedThumbnails = ({
  currentSlide,
  containerWidth,
  userType,
  isOpen,
  onSlideClick,
  onClose
}: UseSimplifiedThumbnailsProps) => {
  const { slides } = useSlideStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // レスポンシブなサムネイルサイズの計算
  const { 
    thumbnailWidth, 
    gap, 
    isMobile,
    isTablet 
  } = useResponsiveThumbnails({
    containerWidth,
    isPopupMode: true
  });

  // 企業ユーザーのみスライド追加可能
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

  // スライドクリック時の処理（ダイアログを閉じる）
  const handleSlideClick = (slideIndex: number) => {
    onSlideClick(slideIndex);
    onClose();
  };

  // ダイアログ開閉時の現在スライドへのスクロール
  useEffect(() => {
    if (isOpen) {
      scrollToItem(currentSlide);
    }
  }, [currentSlide, scrollToItem, isOpen]);

  // キーボードナビゲーション（ESCキーでダイアログを閉じる）
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

  return {
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
  };
};
