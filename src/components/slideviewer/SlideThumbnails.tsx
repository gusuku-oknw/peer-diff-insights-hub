
import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/stores/slide-store";
import ThumbnailHeader from "./thumbnails/ThumbnailHeader";
import ThumbnailCard from "./thumbnails/ThumbnailCard";
import AddSlideCard from "./thumbnails/AddSlideCard";
import EvaluationCard from "./thumbnails/EvaluationCard";

interface SlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
}

const SlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise"
}: SlideThumbnailsProps) => {
  const { slides } = useSlideStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const thumbnailWidth = Math.max(120, Math.min(180, containerWidth * 0.15));
  const showAddSlide = userType === "enterprise";
  
  const mockSlideData = slides.map((slide, index) => ({
    id: slide.id,
    title: slide.title || `スライド ${index + 1}`,
    thumbnail: slide.thumbnail,
    elements: slide.elements || [],
    hasComments: Math.random() > 0.7,
    commentCount: Math.floor(Math.random() * 5),
    isReviewed: Math.random() > 0.5
  }));
  
  const reviewedCount = mockSlideData.filter(slide => slide.isReviewed).length;
  const totalComments = mockSlideData.reduce((sum, slide) => sum + slide.commentCount, 0);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = container.querySelector(`[data-slide="${currentSlide}"]`) as HTMLElement;
      
      if (activeElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        
        const isVisible = 
          elementRect.left >= containerRect.left && 
          elementRect.right <= containerRect.right;
        
        if (!isVisible) {
          const scrollLeft = activeElement.offsetLeft - container.offsetWidth / 2 + activeElement.offsetWidth / 2;
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      }
    }
  }, [currentSlide]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = thumbnailWidth * 3;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'right' ? scrollAmount : -scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-t border-gray-200">
      <ThumbnailHeader 
        slideCount={slides.length}
        userType={userType}
        reviewedCount={reviewedCount}
        totalComments={totalComments}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 bg-white shadow-md hover:bg-gray-50"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 bg-white shadow-md hover:bg-gray-50"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div
          ref={scrollContainerRef}
          className="flex items-center h-full px-4 lg:px-6 py-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 gap-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          {mockSlideData.map((slide, index) => (
            <div key={slide.id} data-slide={index + 1}>
              <ThumbnailCard
                slide={slide}
                slideIndex={index + 1}
                isActive={currentSlide === index + 1}
                thumbnailWidth={thumbnailWidth}
                onClick={onSlideClick}
                userType={userType}
              />
            </div>
          ))}
          
          {showAddSlide && (
            <AddSlideCard thumbnailWidth={thumbnailWidth} />
          )}
          
          <EvaluationCard 
            thumbnailWidth={thumbnailWidth}
            onOpenOverallReview={onOpenOverallReview}
          />
        </div>
      </div>
    </div>
  );
};

export default SlideThumbnails;
