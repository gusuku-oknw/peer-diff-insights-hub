
import type { StateCreator } from 'zustand';
import type { SlideStore } from './types';
import type { SlideElement } from '@/types/slide-viewer/slide.types';

export interface ElementsSlice {
  selectedElementId: string | null;
  
  setSelectedElementId: (id: string | null) => void;
  updateSlideElement: (slideId: number, elementId: string, updates: Partial<SlideElement>) => void;
  updateElement: (slideId: number, elementId: string, updates: Partial<SlideElement>) => void; // Alias for compatibility
  addSlideElement: (slideId: number, element: SlideElement) => void;
  removeSlideElement: (slideId: number, elementId: string) => void;
}

export const createElementsSlice: StateCreator<
  SlideStore,
  [],
  [],
  ElementsSlice
> = (set, get) => ({
  selectedElementId: null,
  
  setSelectedElementId: (id: string | null) => {
    set({ selectedElementId: id });
  },
  
  updateSlideElement: (slideId: number, elementId: string, updates: Partial<SlideElement>) => {
    set((state) => ({
      slides: state.slides.map(slide => {
        if (slide.id === slideId) {
          return {
            ...slide,
            elements: slide.elements.map(element => 
              element.id === elementId 
                ? { ...element, ...updates }
                : element
            )
          };
        }
        return slide;
      })
    }));
  },
  
  // Alias for backward compatibility
  updateElement: (slideId: number, elementId: string, updates: Partial<SlideElement>) => {
    const { updateSlideElement } = get();
    updateSlideElement(slideId, elementId, updates);
  },
  
  addSlideElement: (slideId: number, element: SlideElement) => {
    set((state) => ({
      slides: state.slides.map(slide => {
        if (slide.id === slideId) {
          return {
            ...slide,
            elements: [...slide.elements, element]
          };
        }
        return slide;
      })
    }));
  },
  
  removeSlideElement: (slideId: number, elementId: string) => {
    set((state) => ({
      slides: state.slides.map(slide => {
        if (slide.id === slideId) {
          return {
            ...slide,
            elements: slide.elements.filter(element => element.id !== elementId)
          };
        }
        return slide;
      })
    }));
  },
});
