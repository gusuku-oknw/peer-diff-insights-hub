
import { StateCreator } from 'zustand';
import { Slide } from '@/types/slide-viewer/slide.types';
import { SlideStore } from './types';

export interface PPTXImportSlice {
  isPPTXImported: boolean;
  pptxFilename: string | null;
  
  setPPTXImported: (imported: boolean, filename?: string | null) => void;
  importSlidesFromPPTX: (slidesData: Slide[]) => void;
}

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
