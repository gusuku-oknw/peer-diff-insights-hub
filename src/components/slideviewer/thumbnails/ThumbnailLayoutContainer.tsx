
import React from 'react';
import type { ThumbnailViewMode } from '@/types/slide-viewer/thumbnail.types';

interface ThumbnailLayoutContainerProps {
  viewMode: ThumbnailViewMode;
  gap?: number;
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  showCollapseButton?: boolean;
}

const ThumbnailLayoutContainer = ({ 
  viewMode, 
  gap, 
  children, 
  scrollContainerRef,
  showCollapseButton = false
}: ThumbnailLayoutContainerProps) => {
  const getContainerClass = () => {
    const baseBottomPadding = showCollapseButton ? "pb-12" : "pb-3";
    
    switch (viewMode) {
      case 'grid':
        return `grid grid-cols-auto-fit gap-4 p-4 ${baseBottomPadding} overflow-y-auto`;
      case 'list':
        return `space-y-2 p-4 ${baseBottomPadding} overflow-y-auto`;
      case 'compact':
        return `space-y-1 p-4 ${baseBottomPadding} overflow-y-auto`;
      case 'horizontal':
      default:
        return `flex items-center h-full px-4 lg:px-6 py-3 ${baseBottomPadding} overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-all duration-300 ease-in-out scroll-smooth`;
    }
  };

  return (
    <div
      ref={viewMode === 'horizontal' ? scrollContainerRef : null}
      className={getContainerClass()}
      style={viewMode === 'horizontal' ? { gap: `${gap}px` } : {}}
      role="tablist"
      aria-label="スライドサムネイル"
    >
      {children}
    </div>
  );
};

export default ThumbnailLayoutContainer;
