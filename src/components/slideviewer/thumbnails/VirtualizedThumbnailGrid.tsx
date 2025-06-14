
import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import EnhancedThumbnailCard from './EnhancedThumbnailCard';
import type { EnhancedSlideData, ThumbnailSize } from '@/types/slide.types';

interface VirtualizedThumbnailGridProps {
  slides: EnhancedSlideData[];
  currentSlide: number;
  thumbnailSize: ThumbnailSize;
  containerWidth: number;
  containerHeight: number;
  onSlideClick: (slideIndex: number) => void;
  onContextMenu?: (slideIndex: number, action: string) => void;
  userType?: "student" | "enterprise";
}

interface GridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    slides: EnhancedSlideData[];
    columnCount: number;
    thumbnailSize: ThumbnailSize;
    currentSlide: number;
    onSlideClick: (slideIndex: number) => void;
    onContextMenu?: (slideIndex: number, action: string) => void;
    userType: "student" | "enterprise";
  };
}

const GridItem = ({ columnIndex, rowIndex, style, data }: GridItemProps) => {
  const {
    slides,
    columnCount,
    thumbnailSize,
    currentSlide,
    onSlideClick,
    onContextMenu,
    userType
  } = data;

  const index = rowIndex * columnCount + columnIndex;
  const slide = slides[index];

  if (!slide) {
    return <div style={style} />;
  }

  const slideIndex = index + 1;
  const enhancedSlide = {
    ...slide,
    isActive: currentSlide === slideIndex
  };

  return (
    <div style={{ ...style, padding: '8px' }}>
      <EnhancedThumbnailCard
        slide={enhancedSlide}
        slideIndex={slideIndex}
        thumbnailSize={thumbnailSize}
        onClick={onSlideClick}
        onContextMenu={onContextMenu}
        userType={userType}
      />
    </div>
  );
};

const VirtualizedThumbnailGrid = ({
  slides,
  currentSlide,
  thumbnailSize,
  containerWidth,
  containerHeight,
  onSlideClick,
  onContextMenu,
  userType = "enterprise"
}: VirtualizedThumbnailGridProps) => {
  const gridRef = useRef<Grid>(null);

  // サムネイルサイズに基づく設定
  const { itemWidth, itemHeight } = useMemo(() => {
    const sizeConfig = {
      compact: { width: 156, height: 140 }, // 140 + 16px padding
      normal: { width: 216, height: 180 },  // 200 + 16px padding
      large: { width: 296, height: 240 }    // 280 + 16px padding
    };
    return {
      itemWidth: sizeConfig[thumbnailSize].width,
      itemHeight: sizeConfig[thumbnailSize].height
    };
  }, [thumbnailSize]);

  // カラム数の計算
  const columnCount = useMemo(() => {
    return Math.max(1, Math.floor(containerWidth / itemWidth));
  }, [containerWidth, itemWidth]);

  // 行数の計算
  const rowCount = useMemo(() => {
    return Math.ceil(slides.length / columnCount);
  }, [slides.length, columnCount]);

  // 現在のスライドまでスクロール
  const scrollToCurrentSlide = useCallback(() => {
    if (gridRef.current && currentSlide > 0) {
      const slideIndex = currentSlide - 1;
      const rowIndex = Math.floor(slideIndex / columnCount);
      gridRef.current.scrollToItem({
        align: 'center',
        rowIndex,
        columnIndex: slideIndex % columnCount
      });
    }
  }, [currentSlide, columnCount]);

  useEffect(() => {
    scrollToCurrentSlide();
  }, [scrollToCurrentSlide]);

  // グリッドデータの準備
  const gridData = useMemo(() => ({
    slides,
    columnCount,
    thumbnailSize,
    currentSlide,
    onSlideClick,
    onContextMenu,
    userType
  }), [slides, columnCount, thumbnailSize, currentSlide, onSlideClick, onContextMenu, userType]);

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
          <p className="text-sm text-gray-400 mt-1">検索条件を変更してください</p>
        </div>
      </div>
    );
  }

  return (
    <Grid
      ref={gridRef}
      className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      height={containerHeight}
      width={containerWidth}
      columnCount={columnCount}
      columnWidth={itemWidth}
      rowCount={rowCount}
      rowHeight={itemHeight}
      itemData={gridData}
      overscanRowCount={2}
      overscanColumnCount={1}
    >
      {GridItem}
    </Grid>
  );
};

export default VirtualizedThumbnailGrid;
