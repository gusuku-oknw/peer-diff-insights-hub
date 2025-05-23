
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
  showPresenterNotes: false,  // 確実に初期値はfalse
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
    const current = get();
    set({ viewerMode: mode });
    
    // 編集モードに切り替えたときは、常にノートパネルを非表示にする
    if (mode === "edit") {
      console.log("Navigation slice: Switching to edit mode, hiding presenter notes");
      set({ showPresenterNotes: false });
    }
    
    console.log("Navigation slice: Mode changed", {
      oldMode: current.viewerMode,
      newMode: mode,
      showPresenterNotes: mode === "edit" ? false : current.showPresenterNotes
    });
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
    const { showPresenterNotes, viewerMode } = get();
    
    // 編集モードの場合はノートパネルを表示できないようにする
    if (viewerMode === "edit") {
      console.log("Navigation slice: Cannot toggle presenter notes in edit mode");
      return;
    }
    
    const newValue = !showPresenterNotes;
    console.log("Navigation slice: Toggling presenter notes:", { 
      current: showPresenterNotes, 
      new: newValue,
      viewerMode 
    });
    
    set({ showPresenterNotes: newValue });
  },
  
  setDisplayCount: (count) => {
    set({ displayCount: count });
  }
});
