
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
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

interface VirtualizedThumbnailListProps {
  slides: SlideData[];
  currentSlide: number;
  thumbnailWidth: number;
  containerHeight: number;
  onSlideClick: (slideIndex: number) => void;
  userType?: "student" | "enterprise";
  orientation?: 'horizontal' | 'vertical';
}

interface ListItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    slides: SlideData[];
    currentSlide: number;
    thumbnailWidth: number;
    onSlideClick: (slideIndex: number) => void;
    userType: "student" | "enterprise";
    orientation: 'horizontal' | 'vertical';
  };
}

const ListItem = ({ index, style, data }: ListItemProps) => {
  const { slides, currentSlide, thumbnailWidth, onSlideClick, userType, orientation } = data;
  const slide = slides[index];

  if (!slide) return <div style={style} />;

  const itemStyle = orientation === 'horizontal' 
    ? { ...style, display: 'flex', alignItems: 'center', paddingLeft: '8px', paddingRight: '8px' }
    : { ...style, padding: '8px' };

  return (
    <div style={itemStyle}>
      <MinimalThumbnailCard
        slide={slide}
        slideIndex={slide.slideIndex}
        isActive={currentSlide === slide.slideIndex}
        thumbnailWidth={thumbnailWidth}
        onClick={onSlideClick}
        userType={userType}
      />
    </div>
  );
};

const VirtualizedThumbnailList = ({
  slides,
  currentSlide,
  thumbnailWidth,
  containerHeight,
  onSlideClick,
  userType = "enterprise",
  orientation = 'horizontal'
}: VirtualizedThumbnailListProps) => {
  const itemData = useMemo(() => ({
    slides,
    currentSlide,
    thumbnailWidth,
    onSlideClick,
    userType,
    orientation
  }), [slides, currentSlide, thumbnailWidth, onSlideClick, userType, orientation]);

  const itemSize = orientation === 'horizontal' 
    ? thumbnailWidth + 16 // width + padding
    : (thumbnailWidth * 0.75) + 80; // height based on aspect ratio + text

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>スライドがありません</p>
      </div>
    );
  }

  return (
    <List
      className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      height={containerHeight}
      width="100%"
      itemCount={slides.length}
      itemSize={itemSize}
      itemData={itemData}
      layout={orientation}
      overscanCount={3}
    >
      {ListItem}
    </List>
  );
};

export default VirtualizedThumbnailList;
