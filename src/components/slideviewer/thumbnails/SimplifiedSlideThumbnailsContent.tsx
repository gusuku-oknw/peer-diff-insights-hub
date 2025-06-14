
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MinimalThumbnailCard from './MinimalThumbnailCard';
import AddSlideCard from './AddSlideCard';
import EvaluationCard from './EvaluationCard';

interface SlideData {
  id: number;
  title: string;
  thumbnail?: string;
  elements?: any[];
  hasComments: boolean;
  isReviewed: boolean;
}

interface SimplifiedSlideThumbnailsContentProps {
  slideData: SlideData[];
  currentSlide: number;
  thumbnailWidth: number;
  gap: number;
  showAddSlide: boolean;
  userType: "student" | "enterprise";
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const SimplifiedSlideThumbnailsContent = ({
  slideData,
  currentSlide,
  thumbnailWidth,
  gap,
  showAddSlide,
  userType,
  onSlideClick,
  onOpenOverallReview,
  onScrollLeft,
  onScrollRight,
  scrollContainerRef
}: SimplifiedSlideThumbnailsContentProps) => {
  return (
    <div className="flex-1 relative overflow-hidden">
      <Button
        variant="outline"
        size="lg"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 h-12 w-12 p-0 bg-white/95 shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-200 border-gray-300 rounded-full"
        onClick={onScrollLeft}
        aria-label="前のスライドへスクロール"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 h-12 w-12 p-0 bg-white/95 shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-200 border-gray-300 rounded-full"
        onClick={onScrollRight}
        aria-label="次のスライドへスクロール"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      <div
        ref={scrollContainerRef}
        className="flex items-center h-full px-8 py-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-all duration-300 ease-in-out scroll-smooth"
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
    </div>
  );
};

export default SimplifiedSlideThumbnailsContent;
