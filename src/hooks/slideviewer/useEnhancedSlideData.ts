
import { useMemo } from 'react';
import { useSlideStore } from '@/stores/slide-store';
import type { EnhancedSlideData } from '@/types/slide.types';
import type { SlideSearchFilters } from '@/types/slide-viewer/thumbnail.types';

export const useEnhancedSlideData = () => {
  const { slides } = useSlideStore();

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

  const getFilteredAndSortedSlides = (
    searchFilters: SlideSearchFilters
  ): EnhancedSlideData[] => {
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
  };

  return {
    enhancedSlideData,
    getFilteredAndSortedSlides
  };
};
