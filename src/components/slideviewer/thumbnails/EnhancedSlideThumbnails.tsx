
import React, { useState, useRef, useEffect } from "react";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import { useEnhancedSlideData } from "@/hooks/slideviewer/useEnhancedSlideData";
import { useThumbnailSize } from "@/hooks/slideviewer/useThumbnailSize";
import ThumbnailControls from "./ThumbnailControls";
import ThumbnailLayoutContainer from "./ThumbnailLayoutContainer";
import HorizontalNavigationButtons from "./HorizontalNavigationButtons";
import ThumbnailList from "./ThumbnailList";
import CollapseThumbnailsButton from "./CollapseThumbnailsButton";
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
  const containerRef = useRef<HTMLDivElement>(null);

  // 折りたたみ状態の管理
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 表示設定とフィルター状態
  const [displaySettings, setDisplaySettings] = useState<ThumbnailDisplaySettings>({
    viewMode: 'horizontal',
    thumbnailSize: 'normal',
    showDetails: true,
    showProgress: userType === "student"
  });

  const [searchFilters, setSearchFilters] = useState<SlideSearchFilters>({
    status: 'all',
    sortBy: 'created',
    sortOrder: 'asc'
  });

  // カスタムフックから機能を取得
  const { enhancedSlideData, getFilteredAndSortedSlides } = useEnhancedSlideData();
  const { thumbnailWidth, gap } = useThumbnailSize({ containerWidth, displaySettings });

  const showAddSlide = userType === "enterprise";

  // スムーズスクロール
  const {
    scrollContainerRef,
    scrollToItem,
    scrollByDirection,
    handleKeyboardNavigation,
  } = useSmoothScroll({ itemWidth: thumbnailWidth, gap });

  // フィルタリングとソート
  const filteredAndSortedSlides = getFilteredAndSortedSlides(searchFilters);

  // 現在のスライドに自動スクロール
  useEffect(() => {
    if (displaySettings.viewMode === 'horizontal' && !isCollapsed) {
      scrollToItem(currentSlide);
    }
  }, [currentSlide, scrollToItem, displaySettings.viewMode, isCollapsed]);

  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        handleKeyboardNavigation(event, currentSlide, enhancedSlideData.length, onSlideClick);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, enhancedSlideData.length, onSlideClick, handleKeyboardNavigation]);

  // 折りたたみ時の高さ計算
  const collapsedHeight = 48; // ボタンのみ表示する高さ
  const currentHeight = isCollapsed ? collapsedHeight : height;

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'overflow-hidden' : ''
      }`}
      style={{ height: `${currentHeight}px` }}
      tabIndex={0}
      role="region"
      aria-label="拡張スライド一覧"
    >
      {!isCollapsed && (
        <>
          <ThumbnailControls
            displaySettings={displaySettings}
            searchFilters={searchFilters}
            onDisplaySettingsChange={setDisplaySettings}
            onSearchFiltersChange={setSearchFilters}
            slideCount={filteredAndSortedSlides.length}
            userType={userType}
          />
          
          <div className="flex-1 relative overflow-hidden">
            <HorizontalNavigationButtons
              viewMode={displaySettings.viewMode}
              onScrollLeft={() => scrollByDirection('left')}
              onScrollRight={() => scrollByDirection('right')}
            />
            
            <ThumbnailLayoutContainer
              viewMode={displaySettings.viewMode}
              gap={gap}
              scrollContainerRef={scrollContainerRef}
              showCollapseButton={true}
            >
              <ThumbnailList
                filteredSlides={filteredAndSortedSlides}
                enhancedSlideData={enhancedSlideData}
                currentSlide={currentSlide}
                displaySettings={displaySettings}
                thumbnailWidth={thumbnailWidth}
                onSlideClick={onSlideClick}
                onOpenOverallReview={onOpenOverallReview}
                userType={userType}
                showAddSlide={showAddSlide}
              />
            </ThumbnailLayoutContainer>
          </div>
        </>
      )}
      
      <CollapseThumbnailsButton
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
    </div>
  );
};

export default EnhancedSlideThumbnails;
