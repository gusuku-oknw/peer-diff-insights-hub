
import { StateCreator } from 'zustand';
import { ViewerMode } from '@/utils/types/slide.types';
import { SlideStore } from './types';

// ナビゲーション関連のスライス
export interface NavigationSlice {
  currentSlide: number;
  zoom: number;
  viewerMode: ViewerMode;
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  displayCount: number;
  
  setCurrentSlide: (index: number) => void;
  previousSlide: () => void;
  nextSlide: () => void;
  setZoom: (zoom: number) => void;
  setViewerMode: (mode: ViewerMode) => void;
  toggleLeftSidebar: () => void;
  toggleFullScreen: () => void;
  togglePresenterNotes: () => void;
  setDisplayCount: (count: number) => void;
}

// ナビゲーションスライスの作成
export const createNavigationSlice: StateCreator<
  SlideStore,
  [],
  [],
  NavigationSlice
> = (set, get) => ({
  currentSlide: 1,
  zoom: 100,
  viewerMode: "edit",
  isFullScreen: false,
  leftSidebarOpen: false,
  showPresenterNotes: false,  // デフォルトは非表示
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
  
  setZoom: (zoom) => {
    set({ zoom });
  },
  
  setViewerMode: (mode) => {
    set({ viewerMode: mode });
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
    console.log("Toggling presenter notes:", { current: showPresenterNotes, new: !showPresenterNotes });
    set({ showPresenterNotes: !showPresenterNotes });
  },
  
  setDisplayCount: (count) => {
    set({ displayCount: count });
  }
});
