
import { useRef, useEffect } from 'react';
import { useSlideStore } from '@/stores/slide-store';
import { useSmoothScroll } from './useSmoothScroll';
import { useResponsiveThumbnails } from './useResponsiveThumbnails';

interface UseSimplifiedThumbnailsProps {
  currentSlide: number;
  containerWidth: number;
  userType: "student" | "enterprise";
  isOpen: boolean;
  onSlideClick: (slideIndex: number) => void;
  onClose: () => void;
}

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
  
  const {
    scrollContainerRef,
    scrollToItem,
    scrollByDirection,
    handleKeyboardNavigation,
  } = useSmoothScroll({ itemWidth: thumbnailWidth, gap });
  
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
