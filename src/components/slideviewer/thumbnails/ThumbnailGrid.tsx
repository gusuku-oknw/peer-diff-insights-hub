
import React from 'react';
import MinimalThumbnailCard from './MinimalThumbnailCard';

interface SlideData {
  id: number;
  title?: string;
  thumbnail?: string;
  elements?: any[];
  hasComments?: boolean;
  isReviewed?: boolean;
  slideIndex: number;
}

interface ThumbnailGridProps {
  slides: SlideData[];
  currentSlide: number;
  thumbnailWidth: number;
  containerWidth: number;
  onSlideClick: (slideIndex: number) => void;
  userType?: "student" | "enterprise";
  showHoverActions?: boolean;
}

const ThumbnailGrid = ({
  slides,
  currentSlide,
  thumbnailWidth,
  containerWidth,
  onSlideClick,
  userType = "enterprise",
  showHoverActions = true
}: ThumbnailGridProps) => {
  // Enhanced column calculation with better spacing
  const minGap = 16;
  const totalGapWidth = minGap;
  const availableWidth = containerWidth - (minGap * 2); // Account for container padding
  const itemsPerRow = Math.floor(availableWidth / (thumbnailWidth + minGap));
  const actualColumns = Math.max(1, Math.min(itemsPerRow, 6));
  
  // Calculate optimal gap to center the grid
  const totalItemWidth = actualColumns * thumbnailWidth;
  const totalGapNeeded = availableWidth - totalItemWidth;
  const optimalGap = totalGapNeeded > 0 ? Math.max(minGap, totalGapNeeded / (actualColumns + 1)) : minGap;

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium">スライドが見つかりません</p>
          <p className="text-sm text-gray-400 mt-1">フィルターを変更してください</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="grid gap-4 p-4 pb-12 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      style={{ 
        gridTemplateColumns: `repeat(${actualColumns}, minmax(${thumbnailWidth}px, 1fr))`,
        gap: `${optimalGap}px`,
        justifyItems: 'center',
        justifyContent: 'center'
      }}
      role="grid"
      aria-label="スライドグリッド"
    >
      {slides.map((slide) => (
        <div 
          key={slide.id}
          role="gridcell"
          className="transition-transform duration-200 hover:z-10"
        >
          <MinimalThumbnailCard
            slide={slide}
            slideIndex={slide.slideIndex}
            isActive={currentSlide === slide.slideIndex}
            thumbnailWidth={thumbnailWidth}
            onClick={onSlideClick}
            userType={userType}
            showHoverActions={showHoverActions}
          />
        </div>
      ))}
    </div>
  );
};

export default ThumbnailGrid;
