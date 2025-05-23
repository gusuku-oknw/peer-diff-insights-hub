
import type { Slide } from '@/types/slide-viewer/slide.types';
import type { NavigationSlice } from './navigation.slice';
import type { PresentationSlice } from './presentation.slice';
import type { ElementsSlice } from './elements.slice';

export interface BaseSlideStore {
  slides: Slide[];
  thumbnails: Record<number, string>;
  isPPTXImported: boolean;
  pptxFilename: string | null;
  
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
  ElementsSlice;
