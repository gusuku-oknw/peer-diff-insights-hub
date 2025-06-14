
import { useState, useEffect, useMemo } from 'react';
import { useSlideStore } from '@/stores/slide-store';

export const useResponsiveLayout = () => {
  const { getRightSidebarWidth, isRightPanelVisible } = useSlideStore();
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced responsive breakpoints with more realistic thresholds
  const breakpoints = useMemo(() => ({
    mobile: windowDimensions.width < 640,     // Mobile phones
    tablet: windowDimensions.width >= 640 && windowDimensions.width < 1024,  // Tablets
    desktop: windowDimensions.width >= 1024 && windowDimensions.width < 1440, // Small desktops
    large: windowDimensions.width >= 1440,   // Large screens
  }), [windowDimensions.width]);

  // Optimized panel width calculation with proper constraints
  const optimizedRightPanelWidth = useMemo(() => {
    const { width } = windowDimensions;
    
    if (breakpoints.mobile) {
      // Mobile: Use most of the screen but leave some space for content
      return Math.min(width * 0.85, 320);
    } else if (breakpoints.tablet) {
      // Tablet: More conservative approach
      return Math.min(width * 0.6, 400);
    } else if (breakpoints.desktop) {
      // Desktop: Balanced approach
      return Math.min(width * 0.35, 450);
    } else {
      // Large screens: Can use more space
      return Math.min(width * 0.25, 500);
    }
  }, [windowDimensions.width, breakpoints]);

  // Unified content area calculation with debug logging
  const contentAreaDimensions = useMemo(() => {
    const state = useSlideStore.getState();
    let usedWidth = 0;
    
    if (state.leftSidebarOpen) {
      usedWidth += state.leftSidebarWidth;
    }
    
    if (isRightPanelVisible()) {
      usedWidth += optimizedRightPanelWidth;
    }
    
    if (state.viewerMode === 'edit') {
      usedWidth += state.editSidebarWidth;
    }
    
    // Ensure minimum content width
    const minContentWidth = breakpoints.mobile ? 280 : 400;
    const availableWidth = Math.max(minContentWidth, windowDimensions.width - usedWidth - 20);
    
    const result = {
      width: windowDimensions.width,
      availableWidth,
      thumbnailsWidth: availableWidth,
      usedWidth,
      rightPanelWidth: optimizedRightPanelWidth
    };
    
    // Debug logging for troubleshooting
    console.log('Layout calculation:', {
      screenSize: `${windowDimensions.width}x${windowDimensions.height}`,
      breakpoint: Object.entries(breakpoints).find(([, active]) => active)?.[0] || 'unknown',
      ...result
    });
    
    return result;
  }, [windowDimensions, optimizedRightPanelWidth, breakpoints, isRightPanelVisible]);

  return {
    windowDimensions,
    rightPanelWidth: optimizedRightPanelWidth,
    isRightPanelOpen: isRightPanelVisible(),
    contentAreaDimensions,
    ...breakpoints,
    // Legacy compatibility
    isMobile: breakpoints.mobile,
    isTablet: breakpoints.tablet,
    isDesktop: breakpoints.desktop || breakpoints.large,
  };
};
