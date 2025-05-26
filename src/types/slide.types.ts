
// Unified slide types - consolidating from multiple locations
export type SlideElementType = 'text' | 'image' | 'shape' | 'chart';

export interface SlideElement {
  id: string;
  type: SlideElementType;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  angle?: number;
  zIndex?: number;
  props: Record<string, any>;
}

export interface Slide {
  id: number;
  title?: string;
  content?: string;
  notes: string;
  elements: SlideElement[];
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ViewerMode = "presentation" | "edit" | "review";

export interface SlideNavigationState {
  currentSlide: number;
  totalSlides: number;
  history: number[];
}
