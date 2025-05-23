
import { create } from 'zustand';
import { useSlideStore } from './slideStore';
import { createPPTXImportSlice, PPTXImportSlice } from './slideStoreExtensions';

// Extend the existing store with new functionality
const extendSlideStore = () => {
  const originalStore = useSlideStore;
  
  // Create a new store function with the extended state
  const createExtendedStore = create<PPTXImportSlice>()((...a) => ({
    ...createPPTXImportSlice(...a)
  }));
  
  // Create a combined hook that merges both stores
  return () => {
    const originalState = originalStore();
    const extensionState = createExtendedStore();
    
    return {
      ...originalState,
      ...extensionState
    };
  };
};

// Export the extended store
export const useExtendedSlideStore = extendSlideStore();

// Add types to make TypeScript happy
declare module './slideStore' {
  interface SlideStore extends PPTXImportSlice {}
}
