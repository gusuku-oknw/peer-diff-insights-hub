
import { StateCreator } from 'zustand';
import { SlideStore } from './slideStore';

export interface PPTXImportSlice {
  isPPTXImported: boolean;
  pptxFilename: string | null;
  setPPTXImported: (imported: boolean, filename?: string) => void;
  setSlides: (slides: any[]) => void;
}

export const createPPTXImportSlice: StateCreator<
  SlideStore & PPTXImportSlice, 
  [], 
  [], 
  PPTXImportSlice
> = (set) => ({
  isPPTXImported: false,
  pptxFilename: null,
  setPPTXImported: (imported, filename = null) => set({ isPPTXImported: imported, pptxFilename: filename }),
  setSlides: (slides) => set({ 
    slides,
    isPPTXImported: true,
    currentSlide: 1
  })
});
