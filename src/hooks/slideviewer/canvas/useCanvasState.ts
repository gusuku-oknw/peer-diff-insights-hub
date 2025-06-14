
import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseCanvasStateProps {
  currentSlide: number;
  containerWidth: number;
  editable: boolean;
  isReady: boolean;
  isEmpty: boolean;
  enablePerformanceMode: boolean;
}

export const useCanvasState = ({
  currentSlide,
  containerWidth,
  editable,
  isReady,
  isEmpty,
  enablePerformanceMode
}: UseCanvasStateProps) => {
  const [showGuide, setShowGuide] = useState(false);
  const [selectedObject, setSelectedObject] = useState<any>(null);

  // Device type detection for mobile optimization
  const deviceType = useMemo(() => {
    if (containerWidth < 768) return 'mobile';
    if (containerWidth < 1024) return 'tablet';
    return 'desktop';
  }, [containerWidth]);

  // Show guide for first-time users
  useEffect(() => {
    if (isReady && editable && isEmpty && enablePerformanceMode) {
      const hasSeenGuide = localStorage.getItem('unified-slide-guide-seen');
      if (!hasSeenGuide) {
        setShowGuide(true);
        localStorage.setItem('unified-slide-guide-seen', 'true');
      }
    }
  }, [isReady, editable, isEmpty, enablePerformanceMode]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleCloseGuide = useCallback(() => {
    setShowGuide(false);
  }, []);

  return {
    showGuide,
    selectedObject,
    deviceType,
    setSelectedObject,
    handleRetry,
    handleCloseGuide
  };
};
