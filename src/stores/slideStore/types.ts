
export interface NavigationSlice {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  goToSlide: (slide: number) => void;
}
