
import { useState, useCallback, useRef } from 'react';

interface UseEnhancedThumbnailUIProps {
  initialCollapsed?: boolean;
  autoCollapseDelay?: number;
}

export const useEnhancedThumbnailUI = ({
  initialCollapsed = false,
  autoCollapseDelay = 3000
}: UseEnhancedThumbnailUIProps) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const lastInteractionRef = useRef<number>(Date.now());

  const updateLastInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
    updateLastInteraction();
  }, [updateLastInteraction]);

  const handleMouseEnter = useCallback(() => {
    updateLastInteraction();
  }, [updateLastInteraction]);

  const handleMouseLeave = useCallback(() => {
    updateLastInteraction();
  }, [updateLastInteraction]);

  return {
    isCollapsed,
    toggleCollapse,
    handleMouseEnter,
    handleMouseLeave,
    updateLastInteraction
  };
};
