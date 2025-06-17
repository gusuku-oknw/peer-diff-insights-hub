
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { SlideStore } from './slide-store/types';
import { createNavigationSlice } from './slide-store/navigation.slice';
import { createElementsSlice } from './slide-store/elements.slice';
import { createPresentationSlice } from './slide-store/presentation.slice';
import { createLayoutSlice } from './slide-store/layout.slice';
import { createPPTXImportSlice } from './slide-store/createPPTXImport';
import { createSampleSlides } from './slide-store/createSampleSlides';
import { updateSlideThumbnails } from '@/utils/slideviewer/thumbnailGenerator';
import type { ViewerMode } from '@/types/slide.types';

/**
 * Unified slide store with all functionality
 * - Consolidates all slide-related state management
 * - Includes navigation, elements, presentation, layout functionality
 * - Supports persistence and filtering for different user types
 */
const createSlideStore: StateCreator<SlideStore> = (set, get, api) => {
  // サンプルスライドを作成
  const sampleSlides = createSampleSlides();
  console.log('Creating unified slide store with sample slides:', sampleSlides.length);
  
  // 各スライスを結合
  return {
    slides: sampleSlides,
    thumbnails: {},
    
    // Base methods
    setSlides: (slides) => set({ slides }),
    addSlide: (slide) => set((state) => ({ slides: [...state.slides, slide] })),
    removeSlide: (slideId) => set((state) => ({ 
      slides: state.slides.filter(slide => slide.id !== slideId) 
    })),
    updateSlide: (slideId, updates) => set((state) => ({
      slides: state.slides.map(slide => 
        slide.id === slideId ? { ...slide, ...updates } : slide
      )
    })),
    
    // Thumbnail management
    updateThumbnail: (slideId, thumbnail) => set((state) => ({
      thumbnails: { ...state.thumbnails, [slideId]: thumbnail }
    })),
    generateThumbnails: async () => {
      const state = get();
      try {
        await updateSlideThumbnails(
          state.slides,
          (slideId, thumbnail) => {
            set((currentState) => ({
              thumbnails: { ...currentState.thumbnails, [slideId]: thumbnail }
            }));
          },
          { width: 320, height: 180, quality: 0.8 }
        );
      } catch (error) {
        console.error('Failed to generate thumbnails:', error);
      }
    },
    
    // Navigation slice
    ...createNavigationSlice(set, get, api),
    
    // Elements slice
    ...createElementsSlice(set, get, api),
    
    // Presentation slice
    ...createPresentationSlice(set, get, api),
    
    // Layout slice
    ...createLayoutSlice(set, get, api),
    
    // PPTX import slice
    ...createPPTXImportSlice(set, get, api),
  };
};

/**
 * 学生アカウント用のビューアーモードフィルタリング
 * 編集モードを無効化し、プレゼンテーションモードに変更
 */
const filterViewerModeForStudent = (mode: ViewerMode): ViewerMode => {
  if (mode === "edit") {
    console.log('Filtering edit mode to presentation for student account');
    return "presentation";
  }
  return mode;
};

/**
 * Main slide store with persistence
 * - Consolidates all slide functionality
 * - Includes layout state persistence
 * - Applies student account filtering
 */
export const useSlideStore = create<SlideStore>()(
  persist(
    createSlideStore,
    {
      name: 'unified-slide-storage',
      // 永続化する部分状態を指定（レイアウト状態を追加）
      partialize: (state) => ({ 
        slides: state.slides, 
        currentSlide: state.currentSlide,
        zoom: state.zoom,
        viewerMode: state.viewerMode,
        showPresenterNotes: state.showPresenterNotes,
        isPPTXImported: state.isPPTXImported,
        pptxFilename: state.pptxFilename,
        // Layout state
        leftSidebarWidth: state.leftSidebarWidth,
        rightSidebarWidth: state.rightSidebarWidth,
        editSidebarWidth: state.editSidebarWidth,
        thumbnailsHeight: state.thumbnailsHeight,
        leftSidebarOpen: state.leftSidebarOpen,
        rightPanelHidden: state.rightPanelHidden,
      }),
      // 復元時に学生アカウント用のフィルタリングを適用
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate unified slide store:', error);
          return;
        }
        
        if (state) {
          console.log('Unified slide store rehydrated:', {
            slides: state.slides?.length || 0,
            viewerMode: state.viewerMode,
            currentSlide: state.currentSlide,
            layoutState: {
              leftSidebarWidth: state.leftSidebarWidth,
              rightSidebarWidth: state.rightSidebarWidth,
              editSidebarWidth: state.editSidebarWidth,
            }
          });
          
          // 学生アカウント用のフィルタリング（将来的にはAuthContextから判定）
          if (state.viewerMode) {
            const filteredMode = filterViewerModeForStudent(state.viewerMode);
            if (filteredMode !== state.viewerMode) {
              state.viewerMode = filteredMode;
            }
          }
        }
      },
    }
  )
);
