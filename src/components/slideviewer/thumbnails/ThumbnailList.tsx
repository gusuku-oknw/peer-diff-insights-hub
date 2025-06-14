
import React from 'react';
import EnhancedThumbnailCard from './EnhancedThumbnailCard';
import AddSlideCard from './AddSlideCard';
import EvaluationCard from './EvaluationCard';
import type { EnhancedSlideData, ThumbnailDisplaySettings } from '@/types/slide.types';

interface ThumbnailListProps {
  filteredSlides: EnhancedSlideData[];
  enhancedSlideData: EnhancedSlideData[];
  currentSlide: number;
  displaySettings: ThumbnailDisplaySettings;
  thumbnailWidth: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  userType: "student" | "enterprise";
  showAddSlide: boolean;
}

const ThumbnailList = ({
  filteredSlides,
  enhancedSlideData,
  currentSlide,
  displaySettings,
  thumbnailWidth,
  onSlideClick,
  onOpenOverallReview,
  userType,
  showAddSlide
}: ThumbnailListProps) => {
  return (
    <>
      {filteredSlides.map((slide, index) => {
        const slideIndex = enhancedSlideData.findIndex(s => s.id === slide.id) + 1;
        const isActive = currentSlide === slideIndex;
        
        return (
          <div 
            key={slide.id} 
            data-slide={slideIndex}
            className={displaySettings.viewMode === 'horizontal' ? "flex-shrink-0 transition-all duration-300 ease-in-out" : ""}
            role="tab"
            aria-selected={isActive}
          >
            <EnhancedThumbnailCard
              slide={slide}
              slideIndex={slideIndex}
              isActive={isActive}
              thumbnailSize={displaySettings.thumbnailSize}
              showDetails={displaySettings.showDetails}
              onClick={onSlideClick}
              userType={userType}
            />
          </div>
        );
      })}
      
      {showAddSlide && displaySettings.viewMode === 'horizontal' && (
        <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
          <AddSlideCard thumbnailWidth={thumbnailWidth} />
        </div>
      )}
      
      {displaySettings.viewMode === 'horizontal' && (
        <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
          <EvaluationCard 
            thumbnailWidth={thumbnailWidth}
            onOpenOverallReview={onOpenOverallReview}
          />
        </div>
      )}
    </>
  );
};

export default ThumbnailList;
