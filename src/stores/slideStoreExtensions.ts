
import { StateCreator } from 'zustand';
import { SlideStore } from './slideStore';

export interface PPTXImportSlice {
  isPPTXImported: boolean;
  pptxFilename: string | null;
  setPPTXImported: (imported: boolean, filename?: string | null) => void;
  importSlidesFromPPTX: (slidesData: any[]) => void;
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
    const currentState = get();
    
    // Update store values
    set({ 
      currentSlide: 1,
      isPPTXImported: true,
      pptxFilename: currentState.pptxFilename || "imported-presentation.pptx"
    });
    
    // Update slides separately to avoid property error
    set((state: SlideStore & PPTXImportSlice) => ({ 
      slides: slidesData 
    }));
  }
});
