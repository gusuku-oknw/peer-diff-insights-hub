
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { SlideStore } from './types';
import { createNavigationSlice } from './createNavigationSlice';
import { createElementsSlice } from './createElementsSlice';
import { createPresentationSlice } from './createPresentationSlice';
import { createPPTXImportSlice } from './createPPTXImport';
import { createSampleSlides } from './createSampleSlides';

// スライドストアの作成
const createSlideStore: StateCreator<SlideStore, [], [], SlideStore> = (set, get) => {
  // 各スライスを結合
  return {
    slides: createSampleSlides(),
    
    // Navigation slice
    ...createNavigationSlice(set, get),
    
    // Elements slice
    ...createElementsSlice(set, get),
    
    // Presentation slice
    ...createPresentationSlice(set, get),
    
    // PPTX import slice
    ...createPPTXImportSlice(set, get),
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
    }
  )
);
