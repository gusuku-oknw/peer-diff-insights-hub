
import type { Slide } from '@/types/slide-viewer/slide.types';
import type { NavigationSlice } from './navigation.slice';
import type { PresentationSlice } from './presentation.slice';
import type { ElementsSlice } from './elements.slice';
import type { LayoutSlice } from './layout.slice';

export interface PPTXImportSlice {
  isPPTXImported: boolean;
  pptxFilename: string | null;
  
  setPPTXImported: (imported: boolean, filename?: string | null) => void;
  importSlidesFromPPTX: (slidesData: Slide[]) => void;
}

export interface BaseSlideStore {
  slides: Slide[];
  thumbnails: Record<number, string>;
  
  // Methods
  generateThumbnails: () => void;
  setSlides: (slides: Slide[]) => void;
  addSlide: (slide: Slide) => void;
  removeSlide: (slideId: number) => void;
  updateSlide: (slideId: number, updates: Partial<Slide>) => void;
}

export type SlideStore = BaseSlideStore & 
  NavigationSlice & 
  PresentationSlice & 
  ElementsSlice &
  PPTXImportSlice &
  LayoutSlice;
