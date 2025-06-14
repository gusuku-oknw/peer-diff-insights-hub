
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
}

const ThumbnailGrid = ({
  slides,
  currentSlide,
  thumbnailWidth,
  containerWidth,
  onSlideClick,
  userType = "enterprise"
}: ThumbnailGridProps) => {
  // Calculate columns based on container width and thumbnail width
  const columnsCount = Math.floor(containerWidth / (thumbnailWidth + 16));
  const actualColumns = Math.max(1, Math.min(columnsCount, 6));

  return (
    <div 
      className="grid gap-4 p-4 pb-12 overflow-y-auto"
      style={{ 
        gridTemplateColumns: `repeat(${actualColumns}, minmax(${thumbnailWidth}px, 1fr))`,
        justifyItems: 'center'
      }}
    >
      {slides.map((slide) => (
        <MinimalThumbnailCard
          key={slide.id}
          slide={slide}
          slideIndex={slide.slideIndex}
          isActive={currentSlide === slide.slideIndex}
          thumbnailWidth={thumbnailWidth}
          onClick={onSlideClick}
          userType={userType}
        />
      ))}
    </div>
  );
};

export default ThumbnailGrid;
