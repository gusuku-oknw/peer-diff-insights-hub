
import { StateCreator } from 'zustand';
import { SlideStore, Slide } from './slideStore';

export interface PPTXImportSlice {
  isPPTXImported: boolean;
  pptxFilename: string | null;
  setPPTXImported: (imported: boolean, filename?: string | null) => void;
  importSlidesFromPPTX: (slidesData: Slide[]) => void;
}

export const createPPTXImportSlice: StateCreator<
  SlideStore, 
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
    const currentState = get();
    
    // Update store values
    set({ 
      currentSlide: 1,
      isPPTXImported: true,
      pptxFilename: currentState.pptxFilename || "imported-presentation.pptx"
    });
    
    // Update slides separately
    set((state) => ({ 
      slides: slidesData 
    }));
  }
});
