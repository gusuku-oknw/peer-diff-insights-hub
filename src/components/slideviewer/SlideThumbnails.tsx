
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/stores/slide-store";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import UnifiedSlideThumbnails from "./thumbnails/UnifiedSlideThumbnails";
import SimplifiedSlideThumbnails from "./thumbnails/SimplifiedSlideThumbnails";

interface SlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
  enhanced?: boolean;
  showAsPopup?: boolean;
  useImprovedUI?: boolean;
}

const SlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise",
  enhanced = false,
  showAsPopup = false,
  useImprovedUI = true
}: SlideThumbnailsProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { slides } = useSlideStore();
  const { contentAreaDimensions, mobile } = useResponsiveLayout();

  // Use the optimized width calculation
  const effectiveContainerWidth = containerWidth || contentAreaDimensions.thumbnailsWidth;
  
  // Enhanced responsive logic with better thresholds
  const { shouldUsePopup, optimalHeight } = useResponsiveThumbnails({
    containerWidth: effectiveContainerWidth,
    isPopupMode: false
  });

  // More intelligent popup mode detection
  const usePopupMode = showAsPopup || shouldUsePopup || (mobile && effectiveContainerWidth < 400);

  console.log('SlideThumbnails decision:', {
    containerWidth,
    effectiveContainerWidth,
    shouldUsePopup,
    usePopupMode,
    mobile,
    height,
    optimalHeight
  });

  // Popup mode implementation
  if (usePopupMode) {
    return (
      <>
        <div className="flex items-center justify-center p-3 border-t border-gray-200 bg-white">
          <Button
            onClick={() => setIsPopupOpen(true)}
            variant="outline"
            className="w-full max-w-sm text-sm"
          >
            スライド一覧を表示 ({currentSlide}/{slides.length})
          </Button>
        </div>
        
        <SimplifiedSlideThumbnails
          currentSlide={currentSlide}
          onSlideClick={onSlideClick}
          onOpenOverallReview={onOpenOverallReview}
          containerWidth={effectiveContainerWidth}
          userType={userType}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </>
    );
  }

  // Fixed mode implementation with enhanced height calculation
  const enhancedHeight = Math.max(height, optimalHeight, mobile ? 120 : 160);

  return (
    <UnifiedSlideThumbnails
      currentSlide={currentSlide}
      onSlideClick={onSlideClick}
      onOpenOverallReview={onOpenOverallReview}
      height={enhancedHeight}
      containerWidth={effectiveContainerWidth}
      userType={userType}
    />
  );
};

export default SlideThumbnails;
