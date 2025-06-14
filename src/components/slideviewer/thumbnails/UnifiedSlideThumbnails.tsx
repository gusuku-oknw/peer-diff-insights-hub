
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSlideStore } from "@/stores/slide-store";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, LayoutGrid, List, Layers, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import MinimalThumbnailCard from './MinimalThumbnailCard';
import ThumbnailSizeControls from './ThumbnailSizeControls';
import VirtualizedThumbnailList from './VirtualizedThumbnailList';

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
  const controlsHeight = 28; // Significantly reduced from 40px
  const collapseButtonHeight = 48;
  const currentHeight = isCollapsed ? collapseButtonHeight : height;
  const contentHeight = currentHeight - controlsHeight;

  // View mode icons with better mapping
  const viewModeIcons = {
    horizontal: Layers,
    grid: LayoutGrid,
    list: List
  };

  // Enhanced render functions
  const renderCompactControls = () => (
    <div className="flex items-center justify-between px-3 py-1 bg-white border-b border-gray-200 h-7">
      {/* Compact view mode toggle */}
      <div className="flex items-center gap-0.5 bg-gray-100 rounded-md p-0.5">
        {Object.entries(viewModeIcons).map(([mode, Icon]) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                className={`h-6 w-6 p-0 transition-all duration-200 ${
                  viewMode === mode 
                    ? "bg-white shadow-sm text-blue-600 ring-1 ring-blue-200" 
                    : "hover:bg-white/70 text-gray-600"
                }`}
                onClick={() => setViewMode(mode as ViewMode)}
                aria-label={`${mode}モードに切り替え`}
              >
                <Icon className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {mode === 'horizontal' && '水平スクロール'}
              {mode === 'grid' && 'グリッド'}
              {mode === 'list' && 'リスト'}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Center controls */}
      <div className="flex items-center gap-2">
        <ThumbnailSizeControls
          currentSize={thumbnailWidth}
          onSizeChange={setThumbnailWidth}
          minSize={minSize}
          maxSize={maxSize}
          step={20}
        />

        <Select value={filterMode} onValueChange={(value) => setFilterMode(value as FilterMode)}>
          <SelectTrigger className="w-20 h-6 text-xs border-gray-300">
            <Filter className="h-2.5 w-2.5 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全て</SelectItem>
            <SelectItem value="reviewed">済</SelectItem>
            <SelectItem value="unreviewed">未</SelectItem>
            <SelectItem value="commented">※</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Right side info */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{currentSlide}/{slides.length}</span>
        <span className="text-gray-300">|</span>
        <span>{filteredSlides.length}表示</span>
      </div>
    </div>
  );

  const renderNavigationButtons = () => {
    if (viewMode !== 'horizontal') return null;
    
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 p-0 bg-white/95 hover:bg-white shadow-lg border-gray-300 transition-all duration-200 hover:scale-105"
          onClick={() => scrollByDirection('left')}
          aria-label="左にスクロール"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 p-0 bg-white/95 hover:bg-white shadow-lg border-gray-300 transition-all duration-200 hover:scale-105"
          onClick={() => scrollByDirection('right')}
          aria-label="右にスクロール"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </>
    );
  };

  const renderThumbnails = () => {
    // Use virtualization for large datasets
    if (useVirtualization && viewMode === 'horizontal') {
      return (
        <VirtualizedThumbnailList
          slides={filteredSlides}
          currentSlide={currentSlide}
          thumbnailWidth={thumbnailWidth}
          containerHeight={contentHeight}
          onSlideClick={onSlideClick}
          userType={userType}
          orientation="horizontal"
        />
      );
    }

    const containerClasses = {
      horizontal: `flex items-center h-full px-4 py-3 pb-12 overflow-x-auto scroll-smooth gap-${gap/4} scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`,
      grid: `grid gap-4 p-4 pb-12 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`,
      list: `space-y-2 p-4 pb-12 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`
    };

    // Calculate grid columns dynamically
    const gridStyle = viewMode === 'grid' ? {
      gridTemplateColumns: `repeat(auto-fill, minmax(${thumbnailWidth}px, 1fr))`
    } : {};

    return (
      <div
        ref={viewMode === 'horizontal' ? scrollContainerRef : null}
        className={containerClasses[viewMode]}
        style={viewMode === 'horizontal' ? { gap: `${gap}px` } : gridStyle}
        role="tablist"
        aria-label="スライドサムネイル一覧"
      >
        {filteredSlides.map((slide) => (
          <div
            key={slide.id}
            className={viewMode === 'horizontal' ? "flex-shrink-0" : ""}
            role="tab"
            aria-selected={currentSlide === slide.slideIndex}
          >
            <MinimalThumbnailCard
              slide={slide}
              slideIndex={slide.slideIndex}
              isActive={currentSlide === slide.slideIndex}
              thumbnailWidth={thumbnailWidth}
              onClick={onSlideClick}
              userType={userType}
              showHoverActions={true}
            />
          </div>
        ))}
      </div>
    );
  };

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
          {renderCompactControls()}
          <div className="flex-1 relative overflow-hidden" style={{ height: `${contentHeight}px` }}>
            {renderNavigationButtons()}
            {renderThumbnails()}
          </div>
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
