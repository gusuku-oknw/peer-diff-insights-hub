
import type { StateCreator } from 'zustand';
import type { SlideStore } from './types';
import type { ViewerMode } from '@/types/common.types';

export interface PresentationSlice {
  viewerMode: ViewerMode;
  zoom: number;
  isFullScreen: boolean;
  showPresenterNotes: boolean;
  leftSidebarOpen: boolean;
  presentationStartTime: number | null;
  displayCount: number;
  
  setViewerMode: (mode: ViewerMode) => void;
  setZoom: (zoom: number) => void;
  setIsFullScreen: (isFullScreen: boolean) => void;
  togglePresenterNotes: () => void;
  toggleLeftSidebar: () => void;
  setPresentationStartTime: (time: number | null) => void;
  setDisplayCount: (count: number) => void;
}

export const createPresentationSlice: StateCreator<
  SlideStore,
  [],
  [],
  PresentationSlice
> = (set, get) => ({
  viewerMode: "presentation",
  zoom: 100,
  isFullScreen: false,
  showPresenterNotes: false,
  leftSidebarOpen: false,
  presentationStartTime: null,
  displayCount: 1,
  
  setViewerMode: (mode: ViewerMode) => {
    set({ viewerMode: mode });
  },
  
  setZoom: (zoom: number) => {
    if (zoom >= 25 && zoom <= 200) {
      set({ zoom });
    }
  },
  
  setIsFullScreen: (isFullScreen: boolean) => {
    set({ isFullScreen });
  },
  
  togglePresenterNotes: () => {
    set((state) => ({ showPresenterNotes: !state.showPresenterNotes }));
  },
  
  toggleLeftSidebar: () => {
    set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen }));
  },
  
  setPresentationStartTime: (time: number | null) => {
    set({ presentationStartTime: time });
  },
  
  setDisplayCount: (count: number) => {
    set({ displayCount: count });
  },
});
