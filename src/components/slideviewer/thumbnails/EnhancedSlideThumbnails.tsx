
import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/stores/slide-store";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import ThumbnailControls from "./ThumbnailControls";
import EnhancedThumbnailCard from "./EnhancedThumbnailCard";
import AddSlideCard from "./AddSlideCard";
import EvaluationCard from "./EvaluationCard";
import type { ThumbnailDisplaySettings, SlideSearchFilters } from "@/types/slide-viewer/thumbnail.types";

interface EnhancedSlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
}

const EnhancedSlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise"
}: EnhancedSlideThumbnailsProps) => {
  const { slides } = useSlideStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // 表示設定とフィルター状態
  const [displaySettings, setDisplaySettings] = useState<ThumbnailDisplaySettings>({
    viewMode: 'horizontal',
    thumbnailSize: 'normal',
    showDetails: true,
    showProgress: userType === "student"
  });

  const [searchFilters, setSearchFilters] = useState<SlideSearchFilters>({
    searchText: '',
    status: 'all',
    sortBy: 'created',
    sortOrder: 'asc'
  });

  // サムネイルサイズ計算
  const calculateThumbnailSize = (width: number, mode: string) => {
    if (mode === 'list' || mode === 'compact') return width - 40;
    
    const sizeMultipliers = {
      compact: 0.12,
      normal: 0.15,
      large: 0.18
    };
    
    const multiplier = sizeMultipliers[displaySettings.thumbnailSize] || 0.15;
    return Math.max(120, Math.min(220, width * multiplier));
  };

  const thumbnailWidth = calculateThumbnailSize(containerWidth, displaySettings.viewMode);
  const gap = Math.max(8, Math.min(16, containerWidth * 0.01));
  const showAddSlide = userType === "enterprise";

  // スムーズスクロール
  const {
    scrollContainerRef,
    scrollToItem,
    scrollByDirection,
    handleKeyboardNavigation,
  } = useSmoothScroll({ itemWidth: thumbnailWidth, gap });

  // サンプルデータの強化
  const enhancedSlideData = useMemo(() => {
    return slides.map((slide, index) => ({
      id: slide.id,
      title: slide.title || `スライド ${index + 1}`,
      thumbnail: slide.thumbnail,
      elements: slide.elements || [],
      hasComments: Math.random() > 0.7,
      commentCount: Math.floor(Math.random() * 5),
      isReviewed: Math.random() > 0.5,
      progress: Math.floor(Math.random() * 100),
      lastUpdated: `${Math.floor(Math.random() * 24)}時間前`,
      isImportant: Math.random() > 0.8,
      status: ['draft', 'review', 'approved'][Math.floor(Math.random() * 3)] as any
    }));
  }, [slides]);

  // フィルタリングとソート
  const filteredAndSortedSlides = useMemo(() => {
    let filtered = enhancedSlideData;

    // 検索フィルター
    if (searchFilters.searchText) {
      filtered = filtered.filter(slide =>
        slide.title.toLowerCase().includes(searchFilters.searchText.toLowerCase())
      );
    }

    // ステータスフィルター
    if (searchFilters.status !== 'all') {
      filtered = filtered.filter(slide => {
        switch (searchFilters.status) {
          case 'reviewed': return slide.isReviewed;
          case 'unreviewed': return !slide.isReviewed;
          case 'commented': return slide.commentCount > 0;
          default: return true;
        }
      });
    }

    // ソート
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (searchFilters.sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'updated':
        case 'created':
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (typeof aValue === 'string') {
        return searchFilters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      } else {
        return searchFilters.sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return filtered;
  }, [enhancedSlideData, searchFilters]);

  // 現在のスライドに自動スクロール
  useEffect(() => {
    if (displaySettings.viewMode === 'horizontal') {
      scrollToItem(currentSlide);
    }
  }, [currentSlide, scrollToItem, displaySettings.viewMode]);

  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        handleKeyboardNavigation(event, currentSlide, slides.length, onSlideClick);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, onSlideClick, handleKeyboardNavigation]);

  // レイアウトクラス
  const getContainerClass = () => {
    switch (displaySettings.viewMode) {
      case 'grid':
        return "grid grid-cols-auto-fit gap-4 p-4 overflow-y-auto";
      case 'list':
        return "space-y-2 p-4 overflow-y-auto";
      case 'compact':
        return "space-y-1 p-4 overflow-y-auto";
      case 'horizontal':
      default:
        return "flex items-center h-full px-4 lg:px-6 py-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-all duration-300 ease-in-out scroll-smooth";
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-white border-t border-gray-200"
      tabIndex={0}
      role="region"
      aria-label="拡張スライド一覧"
    >
      <ThumbnailControls
        displaySettings={displaySettings}
        searchFilters={searchFilters}
        onDisplaySettingsChange={setDisplaySettings}
        onSearchFiltersChange={setSearchFilters}
        slideCount={filteredAndSortedSlides.length}
        userType={userType}
      />
      
      <div className="flex-1 relative overflow-hidden">
        {displaySettings.viewMode === 'horizontal' && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
              onClick={() => scrollByDirection('left')}
              aria-label="前のスライドへスクロール"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
              onClick={() => scrollByDirection('right')}
              aria-label="次のスライドへスクロール"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        
        <div
          ref={displaySettings.viewMode === 'horizontal' ? scrollContainerRef : null}
          className={getContainerClass()}
          style={displaySettings.viewMode === 'horizontal' ? { gap: `${gap}px` } : {}}
          role="tablist"
          aria-label="スライドサムネイル"
        >
          {filteredAndSortedSlides.map((slide, index) => {
            const slideIndex = enhancedSlideData.findIndex(s => s.id === slide.id) + 1;
            const isActive = currentSlide === slideIndex;
            
            return (
              <div 
                key={slide.id} 
                data-slide={slideIndex}
                className={displaySettings.viewMode === 'horizontal' ? "flex-shrink-0 transition-all duration-300 ease-in-out" : ""}
                role="tab"
                aria-selected={isActive}
              >
                <EnhancedThumbnailCard
                  slide={slide}
                  slideIndex={slideIndex}
                  isActive={isActive}
                  viewMode={displaySettings.viewMode}
                  thumbnailSize={displaySettings.thumbnailSize}
                  showDetails={displaySettings.showDetails}
                  onClick={onSlideClick}
                  userType={userType}
                />
              </div>
            );
          })}
          
          {showAddSlide && displaySettings.viewMode === 'horizontal' && (
            <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
              <AddSlideCard thumbnailWidth={thumbnailWidth} />
            </div>
          )}
          
          {displaySettings.viewMode === 'horizontal' && (
            <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
              <EvaluationCard 
                thumbnailWidth={thumbnailWidth}
                onOpenOverallReview={onOpenOverallReview}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSlideThumbnails;
