
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSlideStore } from "@/stores/slide-store";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp } from "lucide-react";
import ThumbnailControlsBar from './ThumbnailControlsBar';
import ThumbnailMainContent from './ThumbnailMainContent';

type ViewMode = 'horizontal' | 'grid' | 'list';
type FilterMode = 'all' | 'reviewed' | 'unreviewed' | 'commented';

interface UnifiedSlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
}

const UnifiedSlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise"
}: UnifiedSlideThumbnailsProps) => {
  const { slides } = useSlideStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State management with better defaults
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('horizontal');
  const [thumbnailWidth, setThumbnailWidth] = useState(160);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  // Responsive calculations
  const { isMobile, isTablet } = useResponsiveThumbnails({ containerWidth });
  
  // Enhanced slide data with consistent mock properties
  const enhancedSlides = useMemo(() => {
    return slides.map((slide, index) => ({
      ...slide,
      hasComments: Math.random() > 0.7,
      isReviewed: Math.random() > 0.5,
      slideIndex: index + 1
    }));
  }, [slides]);

  // Filtered slides with improved logic
  const filteredSlides = useMemo(() => {
    let filtered = [...enhancedSlides];
    
    switch (filterMode) {
      case 'reviewed':
        filtered = filtered.filter(slide => slide.isReviewed);
        break;
      case 'unreviewed':
        filtered = filtered.filter(slide => !slide.isReviewed);
        break;
      case 'commented':
        filtered = filtered.filter(slide => slide.hasComments);
        break;
    }
    
    return filtered;
  }, [enhancedSlides, filterMode]);

  // Dynamic gap calculation
  const gap = useMemo(() => (isMobile ? 12 : 16), [isMobile]);

  // Enhanced smooth scroll
  const { scrollContainerRef, scrollToItem, scrollByDirection } = useSmoothScroll({
    itemWidth: thumbnailWidth,
    gap
  });

  // Auto-scroll to current slide with smooth animation
  useEffect(() => {
    if (viewMode === 'horizontal' && !isCollapsed) {
      const timer = setTimeout(() => {
        scrollToItem(currentSlide - 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, scrollToItem, viewMode, isCollapsed]);

  // Keyboard navigation with better accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          if (currentSlide > 1) {
            event.preventDefault();
            onSlideClick(currentSlide - 1);
          }
          break;
        case 'ArrowRight':
          if (currentSlide < slides.length) {
            event.preventDefault();
            onSlideClick(currentSlide + 1);
          }
          break;
        case 'Home':
          event.preventDefault();
          onSlideClick(1);
          break;
        case 'End':
          event.preventDefault();
          onSlideClick(slides.length);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, onSlideClick]);

  // Size constraints based on screen size
  const { minSize, maxSize } = useMemo(() => {
    if (isMobile) return { minSize: 120, maxSize: 180 };
    if (isTablet) return { minSize: 140, maxSize: 200 };
    return { minSize: 160, maxSize: 240 };
  }, [isMobile, isTablet]);

  // Virtualization threshold
  const useVirtualization = slides.length > 20;

  // Layout calculations with optimized heights
  const controlsHeight = 28;
  const collapseButtonHeight = 48;
  const currentHeight = isCollapsed ? collapseButtonHeight : height;
  const contentHeight = currentHeight - controlsHeight;

  const renderEnhancedCollapseButton = () => (
    <div className="absolute bottom-3 right-3 z-30">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`h-10 w-10 p-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-gray-300 rounded-full ${
              isCollapsed ? 'hover:scale-110' : 'hover:scale-105'
            }`}
            aria-label={isCollapsed ? "スライド一覧を表示" : "スライド一覧を隠す"}
          >
            {isCollapsed ? (
              <ChevronUp className="h-5 w-5 transition-transform duration-300" />
            ) : (
              <ChevronDown className="h-5 w-5 transition-transform duration-300" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-900 text-white">
          {isCollapsed ? "スライド一覧を表示" : "スライド一覧を隠す"}
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-white border-t border-gray-200 transition-all duration-300 ease-in-out shadow-sm ${
        isCollapsed ? 'overflow-hidden' : ''
      }`}
      style={{ height: `${currentHeight}px` }}
      tabIndex={0}
      role="region"
      aria-label="スライド一覧"
      aria-expanded={!isCollapsed}
    >
      {!isCollapsed && (
        <>
          <ThumbnailControlsBar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            thumbnailWidth={thumbnailWidth}
            onThumbnailSizeChange={setThumbnailWidth}
            minSize={minSize}
            maxSize={maxSize}
            filterMode={filterMode}
            onFilterChange={setFilterMode}
            currentSlide={currentSlide}
            totalSlides={slides.length}
            filteredCount={filteredSlides.length}
          />
          
          <ThumbnailMainContent
            slides={filteredSlides}
            currentSlide={currentSlide}
            thumbnailWidth={thumbnailWidth}
            contentHeight={contentHeight}
            containerWidth={containerWidth}
            viewMode={viewMode}
            gap={gap}
            onSlideClick={onSlideClick}
            onScrollLeft={() => scrollByDirection('left')}
            onScrollRight={() => scrollByDirection('right')}
            userType={userType}
            useVirtualization={useVirtualization}
            scrollContainerRef={scrollContainerRef}
          />
        </>
      )}
      
      {renderEnhancedCollapseButton()}
      
      {/* Loading indicator for better UX */}
      {slides.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">スライドを読み込み中...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSlideThumbnails;
