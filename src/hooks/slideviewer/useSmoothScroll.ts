import { useCallback, RefObject } from 'react';

export interface UseSmoothScrollProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  slideCount: number;
  currentSlide: number;
}

interface UseSmoothScrollReturn {
  scrollToItem: (itemIndex: number) => void;
  scrollByDirection: (direction: 'left' | 'right') => void;
}

export const useSmoothScroll = ({ 
  scrollContainerRef,
  slideCount, 
  currentSlide 
}: UseSmoothScrollProps): UseSmoothScrollReturn => {

  const scrollToItem = useCallback((itemIndex: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const items = Array.from(container.children);
    
    if (itemIndex < 0 || itemIndex >= items.length) return;
    
    const targetItem = items[itemIndex] as HTMLElement;
    const containerWidth = container.clientWidth;
    const itemLeft = targetItem.offsetLeft;
    const itemWidth = targetItem.offsetWidth;
    
    // Calculate the center position for the item
    const scrollPosition = itemLeft - (containerWidth / 2) + (itemWidth / 2);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }, [scrollContainerRef]);

  const scrollByDirection = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    const newScrollPosition = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  }, [scrollContainerRef]);

  return {
    scrollToItem,
    scrollByDirection
  };
};
