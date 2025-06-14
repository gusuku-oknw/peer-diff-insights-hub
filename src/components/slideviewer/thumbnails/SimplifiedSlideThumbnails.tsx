
import React, { useRef, useEffect } from "react";
import { useSlideStore } from "@/stores/slide-store";
import { useSmoothScroll } from "@/hooks/slideviewer/useSmoothScroll";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import SimplifiedSlideThumbnailsHeader from "./SimplifiedSlideThumbnailsHeader";
import SimplifiedSlideThumbnailsContent from "./SimplifiedSlideThumbnailsContent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface SimplifiedSlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  containerWidth: number;
  userType?: "student" | "enterprise";
  isOpen: boolean;
  onClose: () => void;
}

const SimplifiedSlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  containerWidth,
  userType = "enterprise",
  isOpen,
  onClose
}: SimplifiedSlideThumbnailsProps) => {
  const { slides } = useSlideStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    thumbnailWidth, 
    gap, 
    isMobile,
    isTablet 
  } = useResponsiveThumbnails({
    containerWidth,
    isPopupMode: true
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

  const handleSlideClick = (slideIndex: number) => {
    onSlideClick(slideIndex);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      scrollToItem(currentSlide);
    }
  }, [currentSlide, scrollToItem, isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && containerRef.current?.contains(event.target as Node)) {
        handleKeyboardNavigation(event, currentSlide, slides.length, handleSlideClick);
        
        if (event.key === 'Escape') {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, handleSlideClick, handleKeyboardNavigation, isOpen, onClose]);

  const getOptimalHeight = () => {
    if (isMobile) return 'h-[95vh]';
    if (isTablet) return 'h-[90vh]';
    return 'h-[85vh]';
  };

  const thumbnailsContent = (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-white"
      tabIndex={0}
      role="region"
      aria-label="スライド一覧"
    >
      <SimplifiedSlideThumbnailsHeader
        slidesCount={slides.length}
        currentSlide={currentSlide}
        onClose={onClose}
      />
      
      <SimplifiedSlideThumbnailsContent
        slideData={slideData}
        currentSlide={currentSlide}
        thumbnailWidth={thumbnailWidth}
        gap={gap}
        showAddSlide={showAddSlide}
        userType={userType}
        onSlideClick={handleSlideClick}
        onOpenOverallReview={onOpenOverallReview}
        onScrollLeft={() => scrollByDirection('left')}
        onScrollRight={() => scrollByDirection('right')}
        scrollContainerRef={scrollContainerRef}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className={`${getOptimalHeight()} max-h-[95vh]`}>
          <DrawerHeader className="sr-only">
            <DrawerTitle>スライド一覧</DrawerTitle>
          </DrawerHeader>
          {thumbnailsContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-7xl ${getOptimalHeight()} max-h-[85vh] p-0`}>
        <DialogHeader className="sr-only">
          <DialogTitle>スライド一覧</DialogTitle>
        </DialogHeader>
        {thumbnailsContent}
      </DialogContent>
    </Dialog>
  );
};

export default SimplifiedSlideThumbnails;
