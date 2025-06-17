import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useSlideStore } from '@/stores/slide.store';
import { useResponsiveLayout } from '@/hooks/slideviewer/useResponsiveLayout';
import { useSmoothScroll } from '@/hooks/slideviewer/useSmoothScroll';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import ThumbnailCard from './ThumbnailCard';
import AddSlideCard from './AddSlideCard';
import EvaluationCard from './EvaluationCard';
import SimplifiedSlideThumbnailsHeader from './SimplifiedSlideThumbnailsHeader';

interface UnifiedSlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
}

/**
 * 統合されたスライドサムネイル表示コンポーネント
 * デスクトップとモバイルの両方に対応し、レスポンシブなレイアウトを提供
 */
const UnifiedSlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise"
}: UnifiedSlideThumbnailsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  
  const { slides } = useSlideStore();
  const { mobile, tablet, desktop } = useResponsiveLayout();
  
  // スムーススクロール機能
  const { scrollToItem, scrollByDirection } = useSmoothScroll({
    slideCount: slides.length,
    currentSlide
  });

  // レスポンシブなサムネイルサイズの計算
  const { thumbnailWidth, gap, columnsCount } = useMemo(() => {
    const availableWidth = containerWidth - 32; // パディングを考慮
    const baseWidth = mobile ? 120 : 160;
    const gapSize = mobile ? 8 : 12;
    
    // 利用可能な幅に基づいてカラム数を計算
    const maxColumns = Math.floor((availableWidth + gapSize) / (baseWidth + gapSize));
    const actualColumns = Math.max(1, Math.min(maxColumns, slides.length + 2)); // +2 for add slide and evaluation
    
    // 実際のサムネイル幅を計算
    const actualThumbnailWidth = Math.floor((availableWidth - (actualColumns - 1) * gapSize) / actualColumns);
    
    return {
      thumbnailWidth: Math.max(100, actualThumbnailWidth),
      gap: gapSize,
      columnsCount: actualColumns
    };
  }, [containerWidth, mobile, slides.length]);

  // スライドデータの準備
  const slideData = useMemo(() => {
    return slides.map(slide => ({
      id: slide.id,
      title: slide.title || `スライド ${slide.id}`,
      thumbnail: slide.thumbnail,
      hasComments: slide.comments && slide.comments.length > 0,
      commentCount: slide.comments?.length || 0,
      isReviewed: slide.isReviewed || false,
      progress: slide.progress || 0,
      isImportant: slide.isImportant || false,
      lastUpdated: slide.updatedAt || new Date().toISOString()
    }));
  }, [slides]);

  // スクロール可能性をチェック
  useEffect(() => {
    const checkScrollability = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [slides.length, thumbnailWidth]);

  // 現在のスライドにスクロール
  useEffect(() => {
    if (currentSlide && scrollContainerRef.current) {
      scrollToItem(currentSlide - 1);
    }
  }, [currentSlide, scrollToItem]);

  const handleSlideClick = useCallback((slideIndex: number) => {
    onSlideClick(slideIndex);
  }, [onSlideClick]);

  const showAddSlide = userType === "enterprise";

  return (
    <div 
      ref={containerRef}
      className="h-full flex flex-col bg-white border-t border-gray-200"
      style={{ height: `${height}px` }}
    >
      {/* ヘッダー部分（モバイル時のみ表示） */}
      {mobile && (
        <SimplifiedSlideThumbnailsHeader
          slidesCount={slides.length}
          currentSlide={currentSlide}
          onClose={() => {}}
        />
      )}
      
      {/* メインコンテンツエリア */}
      <div className="flex-1 relative overflow-hidden">
        {/* 左スクロールボタン */}
        {showScrollButtons && (
          <Button
            variant="outline"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white/95 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200"
            onClick={() => scrollByDirection('left')}
            aria-label="前のスライドへスクロール"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        {/* 右スクロールボタン */}
        {showScrollButtons && (
          <Button
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white/95 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200"
            onClick={() => scrollByDirection('right')}
            aria-label="次のスライドへスクロール"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        
        {/* サムネイル一覧 */}
        <div
          ref={scrollContainerRef}
          className="flex items-center h-full px-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth"
          style={{ gap: `${gap}px` }}
          role="tablist"
          aria-label="スライドサムネイル"
        >
          {/* スライドサムネイル */}
          {slideData.map((slide, index) => (
            <div 
              key={slide.id} 
              className="flex-shrink-0"
              role="tab"
              aria-selected={currentSlide === index + 1}
            >
              <ThumbnailCard
                slide={slide}
                slideIndex={index + 1}
                isActive={currentSlide === index + 1}
                thumbnailWidth={thumbnailWidth}
                onClick={handleSlideClick}
                userType={userType}
              />
            </div>
          ))}
          
          {/* 新しいスライド追加カード（企業ユーザーのみ） */}
          {showAddSlide && (
            <div className="flex-shrink-0">
              <AddSlideCard thumbnailWidth={thumbnailWidth} />
            </div>
          )}
          
          {/* 全体評価カード */}
          <div className="flex-shrink-0">
            <EvaluationCard 
              thumbnailWidth={thumbnailWidth}
              onOpenOverallReview={onOpenOverallReview}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSlideThumbnails;
