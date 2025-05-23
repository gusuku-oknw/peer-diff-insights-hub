
import { StateCreator } from 'zustand';
import { SlideElement } from '@/utils/types/slide.types';
import { SlideStore } from './types';

// 要素操作関連のスライス
export interface ElementsSlice {
  updateElement: (slideId: number, elementId: string, updates: Partial<SlideElement>) => void;
  addElement: (slideId: number, element: SlideElement) => void;
  removeElement: (slideId: number, elementId: string) => void;
}

// 要素操作スライスの作成
export const createElementsSlice: StateCreator<
  SlideStore,
  [],
  [],
  ElementsSlice
> = (set, get) => ({
  updateElement: (slideId, elementId, updates) => {
    const { slides } = get();
    
    const updatedSlides = slides.map(slide => {
      if (slide.id !== slideId) return slide;
      
      const updatedElements = slide.elements.map(element => {
        if (element.id !== elementId) return element;
        
        return {
          ...element,
          ...updates,
          props: updates.props ? { ...element.props, ...updates.props } : element.props,
          position: updates.position ? { ...element.position, ...updates.position } : element.position,
          size: updates.size ? { ...element.size, ...updates.size } : element.size
        };
      });
      
      return { ...slide, elements: updatedElements };
    });
    
    set({ slides: updatedSlides });
  },
  
  addElement: (slideId, element) => {
    const { slides } = get();
    
    const updatedSlides = slides.map(slide => {
      if (slide.id !== slideId) return slide;
      
      return {
        ...slide,
        elements: [...slide.elements, element]
      };
    });
    
    set({ slides: updatedSlides });
  },
  
  removeElement: (slideId, elementId) => {
    const { slides } = get();
    
    const updatedSlides = slides.map(slide => {
      if (slide.id !== slideId) return slide;
      
      return {
        ...slide,
        elements: slide.elements.filter(el => el.id !== elementId)
      };
    });
    
    set({ slides: updatedSlides });
  }
});
