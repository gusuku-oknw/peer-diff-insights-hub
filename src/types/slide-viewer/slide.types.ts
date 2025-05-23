
export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart';
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  angle?: number;
  props: Record<string, any>;
}

export interface Slide {
  id: number;
  title: string;
  content: string;
  notes: string;
  elements: SlideElement[];
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SlideNavigationState {
  currentSlide: number;
  totalSlides: number;
  history: number[];
}
