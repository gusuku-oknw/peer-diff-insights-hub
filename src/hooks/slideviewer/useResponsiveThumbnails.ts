
import { useMemo } from 'react';
import { useResponsiveLayout } from './useResponsiveLayout';

interface UseResponsiveThumbnailsProps {
  containerWidth: number;
  isPopupMode?: boolean;
}

export const useResponsiveThumbnails = ({ 
  containerWidth, 
  isPopupMode = false 
}: UseResponsiveThumbnailsProps) => {
  const { mobile, tablet, desktop, large, contentAreaDimensions } = useResponsiveLayout();

  // Enhanced thumbnail size calculation with better constraints
  const calculateThumbnailSize = useMemo(() => {
    // Use actual available width from layout calculation
    const effectiveWidth = containerWidth || contentAreaDimensions.availableWidth;
    
    if (isPopupMode) {
      if (mobile) {
        return Math.max(140, Math.min(180, effectiveWidth * 0.8));
      } else if (tablet) {
        return Math.max(160, Math.min(220, effectiveWidth * 0.6));
      } else {
        return Math.max(180, Math.min(280, effectiveWidth * 0.4));
      }
    } else {
      if (mobile) {
        // Mobile: Smaller thumbnails for better fit
        return Math.max(120, Math.min(160, effectiveWidth * 0.35));
      } else if (tablet) {
        // Tablet: Medium-sized thumbnails
        return Math.max(140, Math.min(200, effectiveWidth * 0.25));
      } else if (desktop) {
        // Desktop: Standard size
        return Math.max(160, Math.min(240, effectiveWidth * 0.2));
      } else {
        // Large screens: Can use bigger thumbnails
        return Math.max(180, Math.min(280, effectiveWidth * 0.18));
      }
    }
  }, [containerWidth, contentAreaDimensions.availableWidth, isPopupMode, mobile, tablet, desktop, large]);

  // Dynamic gap calculation
  const gap = useMemo(() => {
    if (mobile) return 8;
    if (tablet) return 12;
    return 16;
  }, [mobile, tablet]);

  // Improved popup mode detection
  const shouldUsePopup = useMemo(() => {
    const minWidthForFixedView = mobile ? 320 : tablet ? 600 : 800;
    return mobile || (containerWidth > 0 && containerWidth < minWidthForFixedView);
  }, [mobile, tablet, containerWidth]);

  // Optimal height based on screen size
  const optimalHeight = useMemo(() => {
    if (mobile) return 120;
    if (tablet) return 160;
    if (desktop) return 200;
    return 220; // large screens
  }, [mobile, tablet, desktop]);

  const result = {
    thumbnailWidth: calculateThumbnailSize,
    gap,
    shouldUsePopup,
    optimalHeight,
    // Device flags for backward compatibility
    isMobile: mobile,
    isTablet: tablet,
    isDesktop: desktop || large,
    // Enhanced breakpoint info
    deviceType: mobile ? 'mobile' : tablet ? 'tablet' : desktop ? 'desktop' : 'large',
    effectiveWidth: containerWidth || contentAreaDimensions.availableWidth
  };

  // Debug logging
  console.log('Responsive thumbnails calculation:', {
    containerWidth,
    isPopupMode,
    deviceType: result.deviceType,
    shouldUsePopup,
    thumbnailWidth: result.thumbnailWidth,
    gap,
    optimalHeight
  });

  return result;
};
