
import { useState, useEffect, useCallback } from 'react';

interface UseEnhancedThumbnailUIProps {
  initialCollapsed?: boolean;
  autoCollapseDelay?: number;
}

export const useEnhancedThumbnailUI = ({
  initialCollapsed = false,
  autoCollapseDelay = 3000
}: UseEnhancedThumbnailUIProps = {}) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [isHovered, setIsHovered] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Enhanced toggle with smooth state management
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
    setLastInteraction(Date.now());
  }, []);

  // Auto-collapse after inactivity (optional feature)
  useEffect(() => {
    if (!autoCollapseDelay || isCollapsed || isHovered) return;

    const timer = setTimeout(() => {
      const timeSinceLastInteraction = Date.now() - lastInteraction;
      if (timeSinceLastInteraction >= autoCollapseDelay) {
        setIsCollapsed(true);
      }
    }, autoCollapseDelay);

    return () => clearTimeout(timer);
  }, [lastInteraction, autoCollapseDelay, isCollapsed, isHovered]);

  // Update interaction timestamp on any user activity
  const updateLastInteraction = useCallback(() => {
    setLastInteraction(Date.now());
  }, []);

  // Hover state management
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    updateLastInteraction();
  }, [updateLastInteraction]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return {
    isCollapsed,
    isHovered,
    toggleCollapse,
    updateLastInteraction,
    handleMouseEnter,
    handleMouseLeave,
    setIsCollapsed
  };
};
