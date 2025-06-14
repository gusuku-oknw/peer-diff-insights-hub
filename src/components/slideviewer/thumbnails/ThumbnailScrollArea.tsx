
import MinimalThumbnailCard from "./MinimalThumbnailCard";
import AddSlideCard from "./AddSlideCard";
import EvaluationCard from "./EvaluationCard";

interface SlideData {
  id: number;
  title: string;
  thumbnail?: string;
  elements: any[];
  hasComments: boolean;
  isReviewed: boolean;
}

interface ThumbnailScrollAreaProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  slideData: SlideData[];
  currentSlide: number;
  thumbnailWidth: number;
  gap: number;
  onSlideClick: (slideIndex: number) => void;
  userType: "student" | "enterprise";
  showAddSlide: boolean;
  onOpenOverallReview: () => void;
}

const ThumbnailScrollArea = ({
  scrollContainerRef,
  slideData,
  currentSlide,
  thumbnailWidth,
  gap,
  onSlideClick,
  userType,
  showAddSlide,
  onOpenOverallReview
}: ThumbnailScrollAreaProps) => {
  return (
    <div
      ref={scrollContainerRef}
      className="flex items-center h-full px-6 py-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-all duration-300 ease-in-out scroll-smooth"
      style={{ gap: `${gap}px` }}
      role="tablist"
      aria-label="スライドサムネイル"
    >
      {slideData.map((slide, index) => (
        <div 
          key={slide.id} 
          data-slide={index + 1}
          className="flex-shrink-0 transition-all duration-300 ease-in-out"
          role="tab"
          aria-selected={currentSlide === index + 1}
        >
          <MinimalThumbnailCard
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
        <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
          <AddSlideCard thumbnailWidth={thumbnailWidth} />
        </div>
      )}
      
      <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
        <EvaluationCard 
          thumbnailWidth={thumbnailWidth}
          onOpenOverallReview={onOpenOverallReview}
        />
      </div>
    </div>
  );
};

export default ThumbnailScrollArea;
