
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
 */
const createSlideStore: StateCreator<SlideStore> = (set, get, api) => {
  const sampleSlides = createSampleSlides();
  console.log('Creating unified slide store with sample slides:', sampleSlides.length);
  
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
 */
export const useSlideStore = create<SlideStore>()(
  persist(
    createSlideStore,
    {
      name: 'unified-slide-storage',
      partialize: (state) => ({ 
        slides: state.slides, 
        currentSlide: state.currentSlide,
        zoom: state.zoom,
        viewerMode: state.viewerMode,
        showPresenterNotes: state.showPresenterNotes,
        isPPTXImported: state.isPPTXImported,
        pptxFilename: state.pptxFilename,
        leftSidebarWidth: state.leftSidebarWidth,
        rightSidebarWidth: state.rightSidebarWidth,
        editSidebarWidth: state.editSidebarWidth,
        thumbnailsHeight: state.thumbnailsHeight,
        leftSidebarOpen: state.leftSidebarOpen,
        rightPanelHidden: state.rightPanelHidden,
      }),
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
          });
          
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
