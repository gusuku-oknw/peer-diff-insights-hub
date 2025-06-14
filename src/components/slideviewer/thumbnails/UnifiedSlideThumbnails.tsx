
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

  // Enhanced layout calculations with better height utilization
  const controlsHeight = 28;
  const collapseButtonHeight = 56; // Increased for better UX
  const enhancedHeight = Math.max(height, isMobile ? 160 : isTablet ? 200 : 240);
  const currentHeight = isCollapsed ? collapseButtonHeight : enhancedHeight;
  const contentHeight = currentHeight - controlsHeight;

  const renderEnhancedCollapseButton = () => (
    <div className="absolute bottom-4 right-4 z-30">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`h-12 w-12 p-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-gray-300 rounded-full ${
              isCollapsed ? 'hover:scale-110 ring-2 ring-blue-200' : 'hover:scale-105'
            }`}
            aria-label={isCollapsed ? "スライド一覧を表示" : "スライド一覧を隠す"}
          >
            {isCollapsed ? (
              <ChevronUp className="h-6 w-6 transition-transform duration-300 text-blue-600" />
            ) : (
              <ChevronDown className="h-6 w-6 transition-transform duration-300 text-gray-600" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-900 text-white text-sm">
          {isCollapsed ? "スライド一覧を表示" : "スライド一覧を隠す"}
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-white border-t border-gray-200 transition-all duration-300 ease-in-out shadow-lg ${
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
      
      {/* Enhanced loading indicator */}
      {slides.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-base font-medium text-gray-700">スライドを読み込み中...</p>
            <p className="text-sm text-gray-500 mt-1">しばらくお待ちください</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSlideThumbnails;
