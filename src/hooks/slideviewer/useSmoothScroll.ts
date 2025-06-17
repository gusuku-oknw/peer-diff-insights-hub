
import { useRef, useCallback } from 'react';

interface UseSmoothScrollProps {
  itemWidth: number;
  gap: number;
}

export const useSmoothScroll = ({ itemWidth, gap }: UseSmoothScrollProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToItem = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const itemElement = container.querySelector(`[data-slide="${index}"]`) as HTMLElement;
    
    if (itemElement) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = itemElement.getBoundingClientRect();
      
      const isVisible = 
        elementRect.left >= containerRect.left && 
        elementRect.right <= containerRect.right;
      
      if (!isVisible) {
        const scrollLeft = itemElement.offsetLeft - container.offsetWidth / 2 + itemElement.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, []);

  const scrollByDirection = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = (itemWidth + gap) * 3;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + 
      (direction === 'right' ? scrollAmount : -scrollAmount);
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  }, [itemWidth, gap]);

  const handleKeyboardNavigation = useCallback((event: KeyboardEvent, currentSlide: number, totalSlides: number, onSlideClick: (slide: number) => void) => {
    let newSlide = currentSlide;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newSlide = Math.max(1, currentSlide - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        newSlide = Math.min(totalSlides, currentSlide + 1);
        break;
      case 'Home':
        event.preventDefault();
        newSlide = 1;
        break;
      case 'End':
        event.preventDefault();
        newSlide = totalSlides;
        break;
      default:
        return;
    }
    
    if (newSlide !== currentSlide) {
      onSlideClick(newSlide);
      scrollToItem(newSlide);
    }
  }, [scrollToItem]);

  return {
    scrollContainerRef,
    scrollToItem,
    scrollByDirection,
    handleKeyboardNavigation,
  };
};
