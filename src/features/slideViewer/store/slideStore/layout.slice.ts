
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
}

const DEFAULT_LAYOUT = {
  leftSidebarWidth: 256,
  rightSidebarWidth: 320,
  editSidebarWidth: 280,
  thumbnailsHeight: 128,
  leftSidebarOpen: false,
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
    const clampedWidth = Math.max(240, Math.min(500, width));
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
  
  resetLayoutToDefaults: () => set(DEFAULT_LAYOUT),
  
  getContentAreaDimensions: () => {
    const state = get();
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    
    let usedWidth = 0;
    if (state.leftSidebarOpen) usedWidth += state.leftSidebarWidth;
    if (!state.rightPanelHidden) usedWidth += state.rightSidebarWidth;
    if (state.viewerMode === 'edit') usedWidth += state.editSidebarWidth;
    
    const availableWidth = windowWidth - usedWidth;
    
    return {
      width: windowWidth,
      availableWidth,
      thumbnailsWidth: Math.max(400, availableWidth - 40), // 40px for padding
    };
  },
  
  getSlideThumbnailsWidth: () => {
    const state = get();
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    
    let usedWidth = 0;
    
    // Calculate width used by visible panels
    if (state.leftSidebarOpen) {
      usedWidth += state.leftSidebarWidth;
    }
    
    // Check if right panel should be shown
    const shouldShowNotes = (state.viewerMode === "presentation" && state.showPresenterNotes) || 
                           (state.viewerMode === "review" && state.showPresenterNotes);
    const shouldShowReviewPanel = state.viewerMode === "review";
    const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
    const hideRightPanelCompletely = (state.viewerMode === "presentation" && state.isFullScreen) || 
                                    !shouldDisplayRightPanel;
    
    if (!hideRightPanelCompletely && shouldDisplayRightPanel && !state.rightPanelHidden) {
      usedWidth += state.rightSidebarWidth;
    }
    
    if (state.viewerMode === 'edit') {
      usedWidth += state.editSidebarWidth;
    }
    
    // Reserve some padding
    const padding = 40;
    const availableWidth = Math.max(400, windowWidth - usedWidth - padding);
    
    return availableWidth;
  },
});
