
import { StateCreator } from 'zustand';
import { SlideStore } from './slideStore';

export interface PPTXImportSlice {
  isPPTXImported: boolean;
  pptxFilename: string | null;
  setPPTXImported: (imported: boolean, filename?: string) => void;
  importSlidesFromPPTX: (slides: any[]) => void;
}

export const createPPTXImportSlice: StateCreator<
  SlideStore & PPTXImportSlice, 
  [], 
  [], 
  PPTXImportSlice
> = (set, get) => ({
  isPPTXImported: false,
  pptxFilename: null,
  setPPTXImported: (imported, filename = null) => set({ isPPTXImported: imported, pptxFilename: filename }),
  importSlidesFromPPTX: (slidesData) => {
    // Convert the PPTX slides data to our application's slide format
    // and update the store
    set({
      slides: slidesData,
      isPPTXImported: true,
      currentSlide: 1,
      pptxFilename: get().pptxFilename || "imported-presentation.pptx"
    });
  }
});
