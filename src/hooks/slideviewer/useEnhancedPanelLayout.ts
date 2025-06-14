
import { useState, useEffect, useMemo } from 'react';
import { panelTokens, getOptimalPanelWidth, getPanelSizeClass } from '@/design-system/tokens/panel';

export interface PanelLayoutState {
  screenWidth: number;
  screenHeight: number;
  panelWidth: number;
  sizeClass: 'xs' | 'sm' | 'md' | 'lg';
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'large';
  isNarrow: boolean;
  isVeryNarrow: boolean;
  isMobile: boolean;
}

export const useEnhancedPanelLayout = (initialWidth?: number): PanelLayoutState => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const layoutState = useMemo((): PanelLayoutState => {
    const screenWidth = dimensions.width;
    const screenHeight = dimensions.height;
    const panelWidth = initialWidth || getOptimalPanelWidth(screenWidth);
    const sizeClass = getPanelSizeClass(panelWidth);
    
    const { breakpoints } = panelTokens;
    let breakpoint: 'mobile' | 'tablet' | 'desktop' | 'large' = 'desktop';
    
    if (screenWidth < breakpoints.tablet) {
      breakpoint = 'mobile';
    } else if (screenWidth < breakpoints.desktop) {
      breakpoint = 'tablet';
    } else if (screenWidth < breakpoints.large) {
      breakpoint = 'desktop';
    } else {
      breakpoint = 'large';
    }

    return {
      screenWidth,
      screenHeight,
      panelWidth,
      sizeClass,
      breakpoint,
      isNarrow: panelWidth < 400,
      isVeryNarrow: panelWidth < 320,
      isMobile: breakpoint === 'mobile',
    };
  }, [dimensions.width, dimensions.height, initialWidth]);

  return layoutState;
};
