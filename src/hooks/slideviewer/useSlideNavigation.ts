
import { useCallback } from "react";
import { useSlideStore } from "@/stores/slideStore";
import { useToast } from "@/hooks/use-toast";

interface UseSlideNavigationProps {
  totalSlides: number;
}

export const useSlideNavigation = ({ totalSlides }: UseSlideNavigationProps) => {
  const { toast } = useToast();
  const currentSlide = useSlideStore(state => state.currentSlide);
  const setCurrentSlide = useSlideStore(state => state.setCurrentSlide);
  const previousSlide = useSlideStore(state => state.previousSlide);
  const nextSlide = useSlideStore(state => state.nextSlide);

  const handlePreviousSlide = useCallback(() => {
    if (currentSlide > 1) {
      previousSlide();
    } else {
      toast({
        title: "最初のスライドです",
        description: "これ以上前のスライドはありません。",
        variant: "default"
      });
    }
  }, [currentSlide, previousSlide, toast]);

  const handleNextSlide = useCallback(() => {
    if (currentSlide < totalSlides) {
      nextSlide();
    } else {
      toast({
        title: "最後のスライドです",
        description: "これ以上次のスライドはありません。",
        variant: "default"
      });
    }
  }, [currentSlide, totalSlides, nextSlide, toast]);

  const goToSlide = useCallback((slideNumber: number) => {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
      setCurrentSlide(slideNumber);
    }
  }, [setCurrentSlide, totalSlides]);

  return {
    currentSlide,
    handlePreviousSlide,
    handleNextSlide,
    goToSlide,
    isFirstSlide: currentSlide === 1,
    isLastSlide: currentSlide === totalSlides
  };
};

export default useSlideNavigation;
