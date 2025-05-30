
import type { StateCreator } from 'zustand';
import type { SlideStore } from './types';
import type { ViewerMode } from '@/types/slide.types';

export interface NavigationSlice {
  currentSlide: number;
  zoom: number;
  viewerMode: ViewerMode;
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  displayCount: number;
  
  setCurrentSlide: (slide: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  goToSlide: (slideNumber: number) => void;
  setZoom: (zoom: number) => void;
  setViewerMode: (mode: ViewerMode) => void;
  toggleLeftSidebar: () => void;
  toggleFullScreen: () => void;
  togglePresenterNotes: () => void;
  setDisplayCount: (count: number) => void;
}

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
  showPresenterNotes: true,
  displayCount: 1,
  
  setCurrentSlide: (slide: number) => {
    const { slides } = get();
    if (slide >= 1 && slide <= slides.length) {
      set({ currentSlide: slide });
    }
  },
  
  nextSlide: () => {
    const { currentSlide, slides } = get();
    if (currentSlide < slides.length) {
      set({ currentSlide: currentSlide + 1 });
    }
  },
  
  previousSlide: () => {
    const { currentSlide } = get();
    if (currentSlide > 1) {
      set({ currentSlide: currentSlide - 1 });
    }
  },
  
  goToSlide: (slideNumber: number) => {
    const { slides } = get();
    if (slideNumber >= 1 && slideNumber <= slides.length) {
      set({ currentSlide: slideNumber });
    }
  },
  
  setZoom: (zoom: number) => {
    set({ zoom });
  },
  
  setViewerMode: (mode: ViewerMode) => {
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
  
  setDisplayCount: (count: number) => {
    set({ displayCount: count });
  }
});
