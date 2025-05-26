
import type { StateCreator } from 'zustand';
import type { SlideStore } from './types';

export type ViewerMode = "presentation" | "edit" | "review";

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
  generateThumbnails: () => void;
}

export const createPresentationSlice: StateCreator<
  SlideStore,
  [],
  [],
  PresentationSlice
> = (set, get) => ({
  viewerMode: "presentation", // 学生アカウントのデフォルト
  zoom: 100,
  isFullScreen: false,
  showPresenterNotes: false,
  leftSidebarOpen: false,
  presentationStartTime: null,
  displayCount: 1,
  
  setViewerMode: (mode: ViewerMode) => {
    console.log('PresentationSlice: Setting viewer mode to', mode);
    set({ viewerMode: mode });
  },
  
  setZoom: (zoom: number) => {
    const numericZoom = typeof zoom === 'number' ? zoom : parseFloat(String(zoom));
    const validZoom = Math.max(25, Math.min(200, isNaN(numericZoom) ? 100 : numericZoom));
    
    const currentZoom = get().zoom;
    if (currentZoom === validZoom) return;
    
    console.log(`Setting zoom to ${validZoom}% (input: ${zoom}, current: ${currentZoom})`);
    set({ zoom: validZoom });
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
  
  generateThumbnails: () => {
    console.log("Generating thumbnails for slides");
    const { slides } = get();
    
    const updatedSlides = slides.map(slide => ({
      ...slide,
      thumbnail: slide.thumbnail || `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="113" viewBox="0 0 200 113"><rect width="200" height="113" fill="%23f0f0f0"/><text x="100" y="60" font-family="Arial" font-size="16" text-anchor="middle" fill="%23666">Slide ${slide.id}</text></svg>`
    }));
    
    set({ slides: updatedSlides });
  },
});
