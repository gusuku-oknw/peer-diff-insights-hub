
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MinimalThumbnailCard from './MinimalThumbnailCard';
import ThumbnailGrid from './ThumbnailGrid';
import VirtualizedThumbnailList from './VirtualizedThumbnailList';

interface SlideData {
  id: number;
  title?: string;
  thumbnail?: string;
  elements?: any[];
  hasComments?: boolean;
  isReviewed?: boolean;
  slideIndex: number;
}

type ViewMode = 'horizontal' | 'grid' | 'list';

interface ThumbnailMainContentProps {
  slides: SlideData[];
  currentSlide: number;
  thumbnailWidth: number;
  contentHeight: number;
  containerWidth: number;
  viewMode: ViewMode;
  gap: number;
  onSlideClick: (slideIndex: number) => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  userType?: "student" | "enterprise";
  useVirtualization: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const ThumbnailMainContent = ({
  slides,
  currentSlide,
  thumbnailWidth,
  contentHeight,
  containerWidth,
  viewMode,
  gap,
  onSlideClick,
  onScrollLeft,
  onScrollRight,
  userType = "enterprise",
  useVirtualization,
  scrollContainerRef
}: ThumbnailMainContentProps) => {
  const renderNavigationButtons = () => {
    if (viewMode !== 'horizontal') return null;
    
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 p-0 bg-white/95 hover:bg-white shadow-lg border-gray-300 transition-all duration-200 hover:scale-105"
          onClick={onScrollLeft}
          aria-label="左にスクロール"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 p-0 bg-white/95 hover:bg-white shadow-lg border-gray-300 transition-all duration-200 hover:scale-105"
          onClick={onScrollRight}
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
          slides={slides}
          currentSlide={currentSlide}
          thumbnailWidth={thumbnailWidth}
          containerHeight={contentHeight}
          onSlideClick={onSlideClick}
          userType={userType}
          orientation="horizontal"
        />
      );
    }

    // Grid view
    if (viewMode === 'grid') {
      return (
        <ThumbnailGrid
          slides={slides}
          currentSlide={currentSlide}
          thumbnailWidth={thumbnailWidth}
          containerWidth={containerWidth}
          onSlideClick={onSlideClick}
          userType={userType}
          showHoverActions={true}
        />
      );
    }

    // Horizontal and list views
    const containerClasses = {
      horizontal: `flex items-center h-full px-4 py-3 pb-12 overflow-x-auto scroll-smooth gap-${gap/4} scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`,
      list: `space-y-2 p-4 pb-12 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`
    };

    return (
      <div
        ref={viewMode === 'horizontal' ? scrollContainerRef : null}
        className={containerClasses[viewMode] || containerClasses.horizontal}
        style={viewMode === 'horizontal' ? { gap: `${gap}px` } : {}}
        role="tablist"
        aria-label="スライドサムネイル一覧"
      >
        {slides.map((slide) => (
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

  return (
    <div className="flex-1 relative overflow-hidden" style={{ height: `${contentHeight}px` }}>
      {renderNavigationButtons()}
      {renderThumbnails()}
    </div>
  );
};

export default ThumbnailMainContent;
