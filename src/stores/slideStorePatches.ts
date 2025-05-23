
import { create } from 'zustand';
import { useSlideStore } from './slideStore';
import { PPTXImportSlice } from './slideStoreExtensions';

// Extend the existing store with new functionality
const extendSlideStore = () => {
  const originalStore = useSlideStore;
  
  // Create a combined hook that merges both stores
  return () => {
    const originalState = originalStore();
    
    return {
      ...originalState
    };
  };
};

// Export the extended store
export const useExtendedSlideStore = extendSlideStore();

// Add types to make TypeScript happy
declare module './slideStore' {
  interface SlideStore extends PPTXImportSlice {}
}
