
import type { StateCreator } from 'zustand';
import type { SlideStore } from './types';

export interface NavigationSlice {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  goToSlide: (slideNumber: number) => void;
}

export const createNavigationSlice: StateCreator<
  SlideStore,
  [],
  [],
  NavigationSlice
> = (set, get) => ({
  currentSlide: 1,
  
  setCurrentSlide: (slide: number) => {
    const { slides } = get();
    if (slide >= 1 && slide <= slides.length) {
      set({ currentSlide: slide });
    }
  },
  
  nextSlide: () => {
    const { currentSlide, slides } = get();
    if (currentSlide < slides.length) {
      set({ currentSlide: currentSlide + 1 });
    }
  },
  
  previousSlide: () => {
    const { currentSlide } = get();
    if (currentSlide > 1) {
      set({ currentSlide: currentSlide - 1 });
    }
  },
  
  goToSlide: (slideNumber: number) => {
    const { slides } = get();
    if (slideNumber >= 1 && slideNumber <= slides.length) {
      set({ currentSlide: slideNumber });
    }
  },
});
