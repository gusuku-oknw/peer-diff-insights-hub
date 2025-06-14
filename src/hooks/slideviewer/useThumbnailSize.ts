
import { useMemo } from 'react';
import type { ThumbnailDisplaySettings } from '@/types/slide-viewer/thumbnail.types';

interface UseThumbnailSizeProps {
  containerWidth: number;
  displaySettings: ThumbnailDisplaySettings;
}

export const useThumbnailSize = ({ containerWidth, displaySettings }: UseThumbnailSizeProps) => {
  const thumbnailWidth = useMemo(() => {
    const { viewMode, thumbnailSize } = displaySettings;
    
    if (viewMode === 'list' || viewMode === 'compact') return containerWidth - 40;
    
    const sizeMultipliers = {
      compact: 0.12,
      normal: 0.15,
      large: 0.18
    };
    
    const multiplier = sizeMultipliers[thumbnailSize] || 0.15;
    return Math.max(120, Math.min(220, containerWidth * multiplier));
  }, [containerWidth, displaySettings]);

  const gap = useMemo(() => {
    return Math.max(8, Math.min(16, containerWidth * 0.01));
  }, [containerWidth]);

  return { thumbnailWidth, gap };
};
