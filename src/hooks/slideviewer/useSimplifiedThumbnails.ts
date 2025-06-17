
import { useState, useRef, useCallback, useMemo } from 'react';
import { useSlideStore } from '@/stores/slide.store';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slides = useSlideStore(state => state.slides);
  
  // Basic responsive calculations
  const isMobile = containerWidth < 768;
  const isTablet = containerWidth >= 768 && containerWidth < 1024;
  
  // Thumbnail sizing
  const thumbnailWidth = useMemo(() => {
    if (isMobile) return 120;
    if (isTablet) return 160;
    return 200;
  }, [isMobile, isTablet]);
  
  const gap = isMobile ? 8 : 12;
  
  // Convert slides to slide data format
  const slideData = useMemo(() => {
    return slides.map(slide => ({
      id: slide.id,
      title: slide.title || `スライド ${slide.id}`,
      thumbnail: slide.thumbnail,
      hasComments: false,
      commentCount: 0,
      isReviewed: false,
      progress: 0,
      isImportant: false,
      lastUpdated: slide.updatedAt || new Date().toISOString()
    }));
  }, [slides]);
  
  // Show add slide button for enterprise users
  const showAddSlide = userType === "enterprise";
  
  // Handle slide click
  const handleSlideClick = useCallback((slideIndex: number) => {
    onSlideClick(slideIndex);
    onClose();
  }, [onSlideClick, onClose]);
  
  // Scroll functions
  const scrollByDirection = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = thumbnailWidth + gap;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const newScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  }, [thumbnailWidth, gap]);
  
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
