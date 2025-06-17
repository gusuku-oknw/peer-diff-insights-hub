import { useMemo } from 'react';
// Fix the import path
import { STANDARD_SLIDE_SIZES, type StandardSlideSize } from '@/utils/slideviewer/canvas/standardSlideSizes';

/**
 * Calculate the optimal slide size based on container dimensions
 * @param containerWidth Width of the container
 * @param containerHeight Height of the container
 * @param padding Optional padding to apply
 * @returns Calculated slide dimensions and scale
 */
export const useStandardSlideSize = (
  containerWidth: number,
  containerHeight: number,
  padding: number = 20
) => {
  return useMemo(() => {
    // Default to 16:9 aspect ratio if container dimensions are invalid
    if (!containerWidth || !containerHeight) {
      return {
        width: 1600,
        height: 900,
        scale: 1,
        aspectRatio: '16:9',
        displayWidth: 1600,
        displayHeight: 900
      };
    }

    // Find the best standard size that fits the container
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;
    const containerRatio = availableWidth / availableHeight;

    // Find the closest standard size by aspect ratio
    let bestMatch: StandardSlideSize = STANDARD_SLIDE_SIZES.find(
      size => Math.abs(size.ratio - containerRatio) < 0.1
    ) || STANDARD_SLIDE_SIZES[0]; // Default to first size if no match

    // Calculate scale to fit the container
    const scaleX = availableWidth / bestMatch.width;
    const scaleY = availableHeight / bestMatch.height;
    const scale = Math.min(scaleX, scaleY);

    // Calculate display dimensions
    const displayWidth = bestMatch.width * scale;
    const displayHeight = bestMatch.height * scale;

    return {
      width: bestMatch.width,
      height: bestMatch.height,
      scale,
      aspectRatio: bestMatch.name,
      displayWidth,
      displayHeight
    };
  }, [containerWidth, containerHeight, padding]);
};
