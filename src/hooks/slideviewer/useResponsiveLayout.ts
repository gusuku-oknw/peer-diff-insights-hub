
import { useState, useEffect } from 'react';
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

  const rightPanelWidth = getRightSidebarWidth();
  const isRightPanelOpen = isRightPanelVisible();

  return {
    windowDimensions,
    rightPanelWidth,
    isRightPanelOpen,
    isMobile: windowDimensions.width < 768,
    isTablet: windowDimensions.width >= 768 && windowDimensions.width < 1024,
    isDesktop: windowDimensions.width >= 1024,
  };
};
