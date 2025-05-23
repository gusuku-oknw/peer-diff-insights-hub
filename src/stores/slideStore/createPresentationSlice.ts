
import { StateCreator } from 'zustand';
import { SlideStore } from './types';

// プレゼンテーション関連のスライス
export interface PresentationSlice {
  presentationStartTime: Date | null;
  
  startPresentation: () => void;
  endPresentation: () => void;
  generateThumbnails: () => void;
  exportToPPTX: () => void;
}

// プレゼンテーションスライスの作成
export const createPresentationSlice: StateCreator<
  SlideStore,
  [],
  [],
  PresentationSlice
> = (set, get) => ({
  presentationStartTime: null,
  
  startPresentation: () => {
    set({ presentationStartTime: new Date() });
  },
  
  endPresentation: () => {
    set({ presentationStartTime: null });
  },
  
  generateThumbnails: () => {
    console.log("Generating thumbnails for slides");
    const { slides } = get();
    
    const updatedSlides = slides.map(slide => ({
      ...slide,
      thumbnail: slide.thumbnail || `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="113" viewBox="0 0 200 113"><rect width="200" height="113" fill="%23f0f0f0"/><text x="100" y="60" font-family="Arial" font-size="16" text-anchor="middle" fill="%23666">Slide ${slide.id}</text></svg>`
    }));
    
    set({ slides: updatedSlides });
  },
  
  exportToPPTX: () => {
    console.log("Exporting presentation to PPTX format");
    // This would be implemented with a library like JSZip, PptxGenJS, etc.
    alert("PPTX export functionality is coming soon!");
  }
});
