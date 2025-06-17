
import type { StateCreator } from 'zustand';
import type { SlideStore } from './types';

export interface LayoutSlice {
  // Panel dimensions
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  editSidebarWidth: number;
  thumbnailsHeight: number;
  
  // Panel visibility states
  leftSidebarOpen: boolean;
  rightPanelHidden: boolean;
  isFullScreen: boolean;
  
  // Layout methods
  setLeftSidebarWidth: (width: number) => void;
  setRightSidebarWidth: (width: number) => void;
  setEditSidebarWidth: (width: number) => void;
  setThumbnailsHeight: (height: number) => void;
  setLeftSidebarOpen: (open: boolean) => void;
  setRightPanelHidden: (hidden: boolean) => void;
  setIsFullScreen: (fullScreen: boolean) => void;
  
  // Enhanced utility methods
  resetLayoutToDefaults: () => void;
  getContentAreaDimensions: () => {
    width: number;
    availableWidth: number;
    thumbnailsWidth: number;
  };
  getSlideThumbnailsWidth: () => number;
  isRightPanelVisible: () => boolean;
  getRightSidebarWidth: () => number;
  toggleLeftSidebar: () => void;
}

const DEFAULT_LAYOUT = {
  leftSidebarWidth: 256,
  rightSidebarWidth: 280,
  editSidebarWidth: 280,
  thumbnailsHeight: 128,
  leftSidebarOpen: true, // Changed to true by default
  rightPanelHidden: false,
  isFullScreen: false,
};

export const createLayoutSlice: StateCreator<
  SlideStore,
  [],
  [],
  LayoutSlice
> = (set, get) => ({
  ...DEFAULT_LAYOUT,
  
  setLeftSidebarWidth: (width: number) => {
    const clampedWidth = Math.max(200, Math.min(400, width));
    set({ leftSidebarWidth: clampedWidth });
  },
  
  setRightSidebarWidth: (width: number) => {
    const clampedWidth = Math.max(200, Math.min(500, width));
    set({ rightSidebarWidth: clampedWidth });
  },
  
  setEditSidebarWidth: (width: number) => {
    const clampedWidth = Math.max(240, Math.min(400, width));
    set({ editSidebarWidth: clampedWidth });
  },
  
  setThumbnailsHeight: (height: number) => {
    const clampedHeight = Math.max(80, Math.min(400, height));
    set({ thumbnailsHeight: clampedHeight });
  },
  
  setLeftSidebarOpen: (open: boolean) => set({ leftSidebarOpen: open }),
  setRightPanelHidden: (hidden: boolean) => set({ rightPanelHidden: hidden }),
  setIsFullScreen: (fullScreen: boolean) => set({ isFullScreen: fullScreen }),
  
  toggleLeftSidebar: () => {
    const state = get();
    set({ leftSidebarOpen: !state.leftSidebarOpen });
  },
  
  resetLayoutToDefaults: () => set(DEFAULT_LAYOUT),
  
  // Optimized responsive width calculation
  getRightSidebarWidth: () => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    
    // Enhanced responsive calculations with better constraints
    if (windowWidth < 640) {
      // Mobile: Use most of screen but ensure content space
      return Math.min(windowWidth * 0.85, 320);
    } else if (windowWidth < 1024) {
      // Tablet: Conservative approach
      return Math.min(windowWidth * 0.5, 400);
    } else if (windowWidth < 1440) {
      // Desktop: Balanced
      return Math.min(windowWidth * 0.3, 450);
    } else {
      // Large screens: Can use more space
      return Math.min(windowWidth * 0.25, 500);
    }
  },
  
  // Simplified right panel visibility logic
  isRightPanelVisible: () => {
    const state = get();
    
    // Don't show if explicitly hidden or in fullscreen presentation mode
    if (state.rightPanelHidden || (state.viewerMode === "presentation" && state.isFullScreen)) {
      return false;
    }
    
    // Show by default for all other cases
    return true;
  },
  
  // Unified content area calculation
  getContentAreaDimensions: () => {
    const state = get();
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    
    let usedWidth = 0;
    if (state.leftSidebarOpen) usedWidth += state.leftSidebarWidth;
    if (state.isRightPanelVisible()) usedWidth += state.getRightSidebarWidth();
    if (state.viewerMode === 'edit') usedWidth += state.editSidebarWidth;
    
    // Ensure minimum content width based on screen size
    const minContentWidth = windowWidth < 640 ? 280 : 400;
    const availableWidth = Math.max(minContentWidth, windowWidth - usedWidth - 20);
    
    const result = {
      width: windowWidth,
      availableWidth,
      thumbnailsWidth: availableWidth,
    };
    
    return result;
  },
  
  // Simplified method that uses the unified calculation
  getSlideThumbnailsWidth: () => {
    const state = get();
    return state.getContentAreaDimensions().thumbnailsWidth;
  },
});
