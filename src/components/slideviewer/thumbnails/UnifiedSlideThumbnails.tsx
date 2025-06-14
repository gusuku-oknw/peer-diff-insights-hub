
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSlideStore } from "@/stores/slide-store";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, LayoutGrid, List, Layers, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import MinimalThumbnailCard from './MinimalThumbnailCard';

type ViewMode = 'horizontal' | 'grid' | 'list';
type ThumbnailSize = 'small' | 'medium' | 'large';
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
  
  // State management
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('horizontal');
  const [thumbnailSize, setThumbnailSize] = useState<ThumbnailSize>('medium');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  // Responsive calculations
  const { isMobile, isTablet } = useResponsiveThumbnails({ containerWidth });
  
  // Enhanced slide data with mock properties
  const enhancedSlides = useMemo(() => {
    return slides.map((slide, index) => ({
      ...slide,
      hasComments: Math.random() > 0.7,
      isReviewed: Math.random() > 0.5,
      slideIndex: index + 1
    }));
  }, [slides]);

  // Filtered slides
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

  // Thumbnail sizing
  const thumbnailWidth = useMemo(() => {
    const baseSize = {
      small: isMobile ? 120 : 140,
      medium: isMobile ? 160 : 180,
      large: isMobile ? 200 : 220
    };
    return baseSize[thumbnailSize];
  }, [thumbnailSize, isMobile]);

  const gap = useMemo(() => (isMobile ? 12 : 16), [isMobile]);

  // Smooth scroll for horizontal mode
  const { scrollContainerRef, scrollToItem, scrollByDirection } = useSmoothScroll({
    itemWidth: thumbnailWidth,
    gap
  });

  // Auto-scroll to current slide
  useEffect(() => {
    if (viewMode === 'horizontal' && !isCollapsed) {
      scrollToItem(currentSlide - 1);
    }
  }, [currentSlide, scrollToItem, viewMode, isCollapsed]);

  // Layout calculations
  const controlsHeight = 40;
  const collapseButtonHeight = 48;
  const currentHeight = isCollapsed ? collapseButtonHeight : height;
  const contentHeight = currentHeight - controlsHeight;

  // View mode icons
  const viewModeIcons = {
    horizontal: Layers,
    grid: LayoutGrid,
    list: List
  };

  // Render functions
  const renderControls = () => (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 h-10">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
        {Object.entries(viewModeIcons).map(([mode, Icon]) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                className={`h-7 w-7 p-0 ${
                  viewMode === mode ? "bg-white shadow-sm text-blue-600" : "hover:bg-white/50"
                }`}
                onClick={() => setViewMode(mode as ViewMode)}
              >
                <Icon className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {mode === 'horizontal' && '水平スクロール'}
              {mode === 'grid' && 'グリッド'}
              {mode === 'list' && 'リスト'}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Size and Filter Controls */}
      <div className="flex items-center gap-2">
        <Select value={thumbnailSize} onValueChange={(value) => setThumbnailSize(value as ThumbnailSize)}>
          <SelectTrigger className="w-20 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">小</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="large">大</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterMode} onValueChange={(value) => setFilterMode(value as FilterMode)}>
          <SelectTrigger className="w-24 h-7 text-xs">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="reviewed">済</SelectItem>
            <SelectItem value="unreviewed">未</SelectItem>
            <SelectItem value="commented">※</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-gray-500 ml-2">
          {filteredSlides.length}/{slides.length}
        </span>
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
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white/90 shadow-md"
          onClick={() => scrollByDirection('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white/90 shadow-md"
          onClick={() => scrollByDirection('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </>
    );
  };

  const renderThumbnails = () => {
    const containerClasses = {
      horizontal: `flex items-center h-full px-4 py-3 pb-12 overflow-x-auto scroll-smooth gap-${gap/4}`,
      grid: `grid grid-cols-auto-fit gap-4 p-4 pb-12 overflow-y-auto`,
      list: `space-y-2 p-4 pb-12 overflow-y-auto`
    };

    return (
      <div
        ref={viewMode === 'horizontal' ? scrollContainerRef : null}
        className={containerClasses[viewMode]}
        style={viewMode === 'horizontal' ? { gap: `${gap}px` } : {}}
      >
        {filteredSlides.map((slide) => (
          <div
            key={slide.id}
            className={viewMode === 'horizontal' ? "flex-shrink-0" : ""}
          >
            <MinimalThumbnailCard
              slide={slide}
              slideIndex={slide.slideIndex}
              isActive={currentSlide === slide.slideIndex}
              thumbnailWidth={thumbnailWidth}
              onClick={onSlideClick}
              userType={userType}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderCollapseButton = () => (
    <div className="absolute bottom-2 right-4 z-20">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-gray-300"
            aria-label={isCollapsed ? "スライド一覧を表示" : "スライド一覧を隠す"}
          >
            {isCollapsed ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {isCollapsed ? "スライド一覧を表示" : "スライド一覧を隠す"}
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'overflow-hidden' : ''
      }`}
      style={{ height: `${currentHeight}px` }}
      tabIndex={0}
      role="region"
      aria-label="スライド一覧"
    >
      {!isCollapsed && (
        <>
          {renderControls()}
          <div className="flex-1 relative overflow-hidden" style={{ height: `${contentHeight}px` }}>
            {renderNavigationButtons()}
            {renderThumbnails()}
          </div>
        </>
      )}
      {renderCollapseButton()}
    </div>
  );
};

export default UnifiedSlideThumbnails;
