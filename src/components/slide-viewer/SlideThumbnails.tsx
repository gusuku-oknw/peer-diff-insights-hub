
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSlideStore } from "@/stores/slide-store";
import { useEffect } from "react";
import ThumbnailHeader from "./thumbnails/ThumbnailHeader";
import ThumbnailCard from "./thumbnails/ThumbnailCard";
import AddSlideCard from "./thumbnails/AddSlideCard";
import EvaluationCard from "./thumbnails/EvaluationCard";

interface SlideThumbnailsProps {
  slides?: any[];
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview?: () => void;
  height?: number;
  containerWidth?: number;
}

const SlideThumbnails = ({
  slides: propSlides,
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height = 128,
  containerWidth
}: SlideThumbnailsProps) => {
  const storeSlides = useSlideStore(state => state.slides);
  const generateThumbnails = useSlideStore(state => state.generateThumbnails);
  
  const slides = propSlides || storeSlides;
  
  useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails]);

  // Calculate dynamic width based on container
  const getContainerWidth = () => {
    if (containerWidth) return containerWidth;
    return typeof window !== 'undefined' ? window.innerWidth - 100 : 1200;
  };

  const thumbnailWidth = height > 150 ? 160 : 120;
  const gap = height > 150 ? 24 : 16;
  const totalItemsWidth = (slides.length + 2) * (thumbnailWidth + gap);
  const dynamicWidth = Math.max(getContainerWidth(), totalItemsWidth);
  
  return (
    <div className="modern-thumbnails bg-white flex flex-col w-full h-full">
      <ThumbnailHeader slideCount={slides.length} />
      
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full w-full" orientation="horizontal">
          <div 
            className="flex gap-4 lg:gap-6 p-4 lg:p-6 pb-4" 
            style={{ width: `${dynamicWidth}px`, minWidth: '100%' }}
          >
            {slides.map((slide, index) => (
              <ThumbnailCard
                key={index}
                slide={slide}
                slideIndex={slide.id}
                isActive={currentSlide === slide.id}
                thumbnailWidth={thumbnailWidth}
                onClick={onSlideClick}
              />
            ))}
            
            <AddSlideCard thumbnailWidth={thumbnailWidth} />
            
            <EvaluationCard 
              thumbnailWidth={thumbnailWidth}
              onOpenOverallReview={onOpenOverallReview}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SlideThumbnails;
