
import React, { useRef, useEffect, useState } from "react";
import { useSlideStore } from "@/stores/slide-store";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import UnifiedSlideThumbnailsContainer from "./UnifiedSlideThumbnailsContainer";
import SimplifiedSlideThumbnailsContent from "./SimplifiedSlideThumbnailsContent";
import SimplifiedThumbnailHeader from "./SimplifiedThumbnailHeader";

interface UnifiedSlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
}

const UnifiedSlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise"
}: UnifiedSlideThumbnailsProps) => {
  const { slides } = useSlideStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    thumbnailWidth, 
    gap 
  } = useResponsiveThumbnails({
    containerWidth,
    isPopupMode: false
  });

  const showAddSlide = userType === "enterprise";
  
  const {
    scrollContainerRef,
    scrollToItem,
    scrollByDirection,
    handleKeyboardNavigation,
  } = useSmoothScroll({ itemWidth: thumbnailWidth, gap });
  
  const slideData = slides.map((slide, index) => ({
    id: slide.id,
    title: slide.title || `スライド ${index + 1}`,
    thumbnail: slide.thumbnail,
    elements: slide.elements || [],
    hasComments: (slide as any).comments?.length > 0 || false,
    isReviewed: (slide as any).isReviewed || false
  }));

  const collapsedHeight = 80;
  const currentHeight = isCollapsed ? collapsedHeight : height;

  useEffect(() => {
    scrollToItem(currentSlide);
  }, [currentSlide, scrollToItem]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        handleKeyboardNavigation(event, currentSlide, slides.length, onSlideClick);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, onSlideClick, handleKeyboardNavigation]);

  return (
    <UnifiedSlideThumbnailsContainer
      currentHeight={currentHeight}
      isCollapsed={isCollapsed}
      onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
    >
      {!isCollapsed && (
        <>
          <SimplifiedThumbnailHeader
            slideCount={slides.length}
            userType={userType}
          />
          
          <SimplifiedSlideThumbnailsContent
            slideData={slideData}
            currentSlide={currentSlide}
            thumbnailWidth={thumbnailWidth}
            gap={gap}
            showAddSlide={showAddSlide}
            userType={userType}
            onSlideClick={onSlideClick}
            onOpenOverallReview={onOpenOverallReview}
            onScrollLeft={() => scrollByDirection('left')}
            onScrollRight={() => scrollByDirection('right')}
            scrollContainerRef={scrollContainerRef}
          />
        </>
      )}
    </UnifiedSlideThumbnailsContainer>
  );
};

export default UnifiedSlideThumbnails;
