
import { StateCreator } from 'zustand';
import { Slide } from '@/utils/types/slide.types';
import { SlideStore, PPTXImportSlice } from './types';

// PPTXインポートスライスの作成
export const createPPTXImportSlice: StateCreator<
  SlideStore,
  [],
  [],
  PPTXImportSlice
> = (set, get, api) => ({
  isPPTXImported: false,
  pptxFilename: null,
  
  setPPTXImported: (imported, filename = null) => {
    set({ isPPTXImported: imported, pptxFilename: filename });
  },
  
  importSlidesFromPPTX: (slidesData: Slide[]) => {
    if (slidesData && Array.isArray(slidesData) && slidesData.length > 0) {
      set({ slides: slidesData });
      console.log(`Imported ${slidesData.length} slides from PPTX`);
    } else {
      console.error("Invalid slides data provided for import");
    }
  }
});
