
import { StateCreator } from 'zustand';
import { ViewerMode } from '@/utils/types/slide.types';
import { SlideStore, NavigationSlice } from './types';

// ナビゲーションスライスの作成
export const createNavigationSlice: StateCreator<
  SlideStore,
  [],
  [],
  NavigationSlice
> = (set, get) => ({
  currentSlide: 1,
  zoom: 100,
  viewerMode: "presentation",
  isFullScreen: false,
  leftSidebarOpen: false,
  showPresenterNotes: true,  // デフォルトでtrueに変更
  displayCount: 1,
  
  setCurrentSlide: (index) => {
    set({ currentSlide: index });
  },
  
  previousSlide: () => {
    const { currentSlide } = get();
    if (currentSlide > 1) {
      set({ currentSlide: currentSlide - 1 });
    }
  },
  
  nextSlide: () => {
    const { currentSlide, slides } = get();
    if (currentSlide < slides.length) {
      set({ currentSlide: currentSlide + 1 });
    }
  },
  
  goToSlide: (slideNumber) => {
    const { slides } = get();
    if (slideNumber >= 1 && slideNumber <= slides.length) {
      set({ currentSlide: slideNumber });
    }
  },
  
  setZoom: (zoom) => {
    set({ zoom });
  },
  
  setViewerMode: (mode) => {
    set({ viewerMode: mode });
    console.log("Navigation slice: Mode changed to", mode);
  },
  
  toggleLeftSidebar: () => {
    const { leftSidebarOpen } = get();
    set({ leftSidebarOpen: !leftSidebarOpen });
  },
  
  toggleFullScreen: () => {
    const { isFullScreen } = get();
    set({ isFullScreen: !isFullScreen });
  },
  
  togglePresenterNotes: () => {
    const { showPresenterNotes } = get();
    const newValue = !showPresenterNotes;
    console.log("Navigation slice: Toggling presenter notes:", { 
      current: showPresenterNotes, 
      new: newValue
    });
    set({ showPresenterNotes: newValue });
  },
  
  setDisplayCount: (count) => {
    set({ displayCount: count });
  }
});
