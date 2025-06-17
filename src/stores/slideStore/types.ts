
import { ViewerMode } from '@/utils/types/slide.types';
import { Slide } from '@/utils/types/slide.types';

export interface NavigationSlice {
  currentSlide: number;
  zoom: number;
  viewerMode: ViewerMode;
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  displayCount: number;
  
  setCurrentSlide: (slide: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  goToSlide: (slide: number) => void;
  setZoom: (zoom: number) => void;
  setViewerMode: (mode: ViewerMode) => void;
  toggleLeftSidebar: () => void;
  toggleFullScreen: () => void;
  togglePresenterNotes: () => void;
  setDisplayCount: (count: number) => void;
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

export interface PPTXImportSlice {
  isPPTXImported: boolean;
  pptxFilename: string | null;
  
  setPPTXImported: (imported: boolean, filename?: string | null) => void;
  importSlidesFromPPTX: (slidesData: Slide[]) => void;
}

export interface ElementsSlice {
  selectedElementIds: string[];
  
  selectElement: (id: string) => void;
  deselectElement: (id: string) => void;
  clearElementSelection: () => void;
  selectMultipleElements: (ids: string[]) => void;
}

export interface PresentationSlice {
  presentationStartTime: number | null;
  
  startPresentation: () => void;
  endPresentation: () => void;
}

export type SlideStore = BaseSlideStore & 
  NavigationSlice & 
  PresentationSlice & 
  ElementsSlice &
  PPTXImportSlice;
