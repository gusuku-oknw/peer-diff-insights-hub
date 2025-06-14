
import { useEffect } from 'react';
import { Canvas } from 'fabric';
import { canvasOptimizer } from '@/utils/slideCanvas/canvasOptimizer';

interface UsePerformanceOptimizationProps {
  canvas: Canvas | null;
  enablePerformanceMode: boolean;
  isPerformanceGood: boolean;
}

export const usePerformanceOptimization = ({
  canvas,
  enablePerformanceMode,
  isPerformanceGood
}: UsePerformanceOptimizationProps) => {
  
  useEffect(() => {
    if (!canvas || !enablePerformanceMode) return;
    
    if (!isPerformanceGood) {
      canvasOptimizer.enableHighPerformanceMode();
      console.log('High performance mode enabled due to low performance');
    } else {
      canvasOptimizer.disableHighPerformanceMode();
    }
  }, [canvas, isPerformanceGood, enablePerformanceMode]);
};
