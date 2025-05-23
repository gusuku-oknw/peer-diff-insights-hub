
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { SlideStore } from './types';
import { createNavigationSlice } from './createNavigationSlice';
import { createElementsSlice } from './createElementsSlice';
import { createPresentationSlice } from './createPresentationSlice';
import { createPPTXImportSlice } from './createPPTXImport';
import { createSampleSlides } from './createSampleSlides';

// Define empty third argument type for StateCreator
type EmptyStateCreator = [["zustand/persist", unknown]];

// スライドストアの作成
const createSlideStore: StateCreator<SlideStore, [], [], SlideStore> = (set, get, api) => {
  // サンプルスライドを作成
  const sampleSlides = createSampleSlides();
  console.log('Creating slide store with sample slides:', sampleSlides.length);
  
  // 各スライスを結合
  return {
    slides: sampleSlides,
    
    // Navigation slice
    ...createNavigationSlice(set, get, api),
    
    // Elements slice
    ...createElementsSlice(set, get, api),
    
    // Presentation slice
    ...createPresentationSlice(set, get, api),
    
    // PPTX import slice
    ...createPPTXImportSlice(set, get, api),
  };
};

// 永続化付きのスライドストア
export const useSlideStore = create<SlideStore>()(
  persist(
    (set, get, api) => createSlideStore(set, get, api),
    {
      name: 'slide-storage',
      // 永続化する部分状態を指定
      partialize: (state) => ({ 
        slides: state.slides, 
        currentSlide: state.currentSlide,
        zoom: state.zoom,
        isPPTXImported: state.isPPTXImported,
        pptxFilename: state.pptxFilename
      }),
      // デバッグ用のログを追加
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Slide store rehydrated with slides:', state.slides?.length || 0);
        }
      },
    }
  )
);
