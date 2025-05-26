
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { SlideStore } from './types';
import { createNavigationSlice } from './navigation.slice';
import { createElementsSlice } from './elements.slice';
import { createPresentationSlice, ViewerMode } from './presentation.slice';
import { createLayoutSlice } from './layout.slice';
import { createPPTXImportSlice } from './createPPTXImport';
import { createSampleSlides } from './createSampleSlides';

// スライドストアの作成
const createSlideStore: StateCreator<SlideStore> = (set, get, api) => {
  // サンプルスライドを作成
  const sampleSlides = createSampleSlides();
  console.log('Creating slide store with sample slides:', sampleSlides.length);
  
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

// 学生アカウント用のフィルタリング関数
const filterViewerModeForStudent = (mode: ViewerMode): ViewerMode => {
  if (mode === "edit") {
    console.log('Filtering edit mode to presentation for student account');
    return "presentation";
  }
  return mode;
};

// 永続化付きのスライドストア
export const useSlideStore = create<SlideStore>()(
  persist(
    createSlideStore,
    {
      name: 'slide-storage',
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
          console.error('Failed to rehydrate slide store:', error);
          return;
        }
        
        if (state) {
          console.log('Slide store rehydrated:', {
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
