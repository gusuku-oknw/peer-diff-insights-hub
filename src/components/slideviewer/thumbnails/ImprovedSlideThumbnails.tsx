
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSlideStore } from "@/stores/slide-store";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import ThumbnailDisplayControls from './ThumbnailDisplayControls';
import VirtualizedThumbnailGrid from './VirtualizedThumbnailGrid';
import SimplifiedSlideThumbnails from './SimplifiedSlideThumbnails';
import type { 
  ThumbnailDisplayOptions, 
  EnhancedSlideData, 
  ThumbnailFilter 
} from '@/types/slide.types';

interface ImprovedSlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
  showAsPopup?: boolean;
}

const ImprovedSlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise",
  showAsPopup = false
}: ImprovedSlideThumbnailsProps) => {
  const { slides } = useSlideStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // レスポンシブ判定
  const { shouldUsePopup } = useResponsiveThumbnails({
    containerWidth,
    isPopupMode: false
  });

  // 表示オプションの状態管理（検索機能を削除）
  const [displayOptions, setDisplayOptions] = useState<ThumbnailDisplayOptions>({
    size: 'normal',
    filter: 'all',
    sort: 'created',
    sortOrder: 'asc',
    showSearch: false, // 検索機能を無効化
    searchQuery: '' // 空の検索クエリ
  });

  // スライドデータの拡張（実際のプロジェクトではAPIから取得）
  const enhancedSlides = useMemo((): EnhancedSlideData[] => {
    return slides.map((slide, index) => ({
      id: slide.id,
      title: slide.title || `スライド ${index + 1}`,
      thumbnail: slide.thumbnail,
      elements: slide.elements || [],
      hasComments: (slide as any).comments?.length > 0 || Math.random() > 0.7,
      commentCount: (slide as any).comments?.length || Math.floor(Math.random() * 5),
      isReviewed: (slide as any).isReviewed || Math.random() > 0.5,
      status: (slide as any).status || (['draft', 'review', 'approved'][Math.floor(Math.random() * 3)] as any),
      progress: (slide as any).progress || Math.floor(Math.random() * 100),
      isImportant: (slide as any).isImportant || Math.random() > 0.8,
      lastUpdated: `${Math.floor(Math.random() * 24)}時間前`
    }));
  }, [slides]);

  // フィルタリングとソート（検索機能を削除）
  const filteredAndSortedSlides = useMemo(() => {
    let filtered = [...enhancedSlides];

    // ステータスフィルター
    switch (displayOptions.filter) {
      case 'reviewed':
        filtered = filtered.filter(slide => slide.isReviewed);
        break;
      case 'unreviewed':
        filtered = filtered.filter(slide => !slide.isReviewed);
        break;
      case 'commented':
        filtered = filtered.filter(slide => slide.hasComments);
        break;
      case 'important':
        filtered = filtered.filter(slide => slide.isImportant);
        break;
    }

    // ソート
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (displayOptions.sort) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'updated':
        case 'created':
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (typeof aValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return displayOptions.sortOrder === 'asc' ? result : -result;
      } else {
        const result = aValue - bValue;
        return displayOptions.sortOrder === 'asc' ? result : -result;
      }
    });

    return filtered;
  }, [enhancedSlides, displayOptions]);

  // コンテキストメニューのハンドリング
  const handleContextMenu = useCallback((slideIndex: number, action: string) => {
    console.log(`Context action: ${action} on slide ${slideIndex}`);
    // 実際の実装では、適切なアクションを実行
    switch (action) {
      case 'duplicate':
        // スライド複製ロジック
        break;
      case 'edit':
        // 編集モードに切り替え
        break;
      case 'delete':
        // 削除確認ダイアログ表示
        break;
    }
  }, []);

  // 小さい画面ではポップアップモードを使用
  if (showAsPopup || shouldUsePopup) {
    return (
      <SimplifiedSlideThumbnails
        currentSlide={currentSlide}
        onSlideClick={onSlideClick}
        onOpenOverallReview={onOpenOverallReview}
        containerWidth={containerWidth}
        userType={userType}
        isOpen={true}
        onClose={() => {}}
      />
    );
  }

  // コントロールの高さを大幅に削減
  const controlsHeight = 48; // 検索機能削除により大幅削減
  const gridHeight = Math.max(300, height - controlsHeight);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-white border-t border-gray-200"
      style={{ height: `${height}px` }}
    >
      {/* 簡素化された表示コントロール */}
      <ThumbnailDisplayControls
        options={displayOptions}
        onOptionsChange={setDisplayOptions}
        slideCount={enhancedSlides.length}
        filteredCount={filteredAndSortedSlides.length}
        userType={userType}
      />

      {/* 仮想化されたサムネイルグリッド */}
      <div className="flex-1 overflow-hidden">
        <VirtualizedThumbnailGrid
          slides={filteredAndSortedSlides}
          currentSlide={currentSlide}
          thumbnailSize={displayOptions.size}
          containerWidth={containerWidth}
          containerHeight={gridHeight}
          onSlideClick={onSlideClick}
          onContextMenu={handleContextMenu}
          userType={userType}
        />
      </div>
    </div>
  );
};

export default ImprovedSlideThumbnails;
