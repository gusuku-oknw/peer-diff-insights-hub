
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

  // More intelligent popup mode detection with relaxed constraints
  const usePopupMode = showAsPopup || shouldUsePopup || (mobile && effectiveContainerWidth < 480);

  console.log('SlideThumbnails decision:', {
    containerWidth,
    effectiveContainerWidth,
    shouldUsePopup,
    usePopupMode,
    mobile,
    height,
    optimalHeight
  });

  // Popup mode implementation with improved button
  if (usePopupMode) {
    return (
      <>
        <div className="flex items-center justify-center p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <Button
            onClick={() => setIsPopupOpen(true)}
            variant="outline"
            className="w-full max-w-md h-12 text-base font-semibold bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              📊 スライド一覧を表示
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-bold">
                {currentSlide}/{slides.length}
              </span>
            </span>
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
  const enhancedHeight = Math.max(height, optimalHeight, mobile ? 160 : 200);

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
