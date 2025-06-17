import { useCallback, useMemo, useRef } from 'react';
import { Canvas } from 'fabric';
// Temporary fix - use the correct path
import { optimizeCanvasPerformance } from '@/utils/slideviewer/canvas/canvasOptimizer';

export interface PerformanceMetrics {
  renderTime: number;
  objectCount: number;
  memoryUsage: number;
  frameRate: number;
  lastUpdate: number;
}

interface UsePerformanceOptimizationProps {
  canvas: Canvas | null;
  enabled: boolean;
}

export const usePerformanceOptimization = ({ canvas, enabled }: UsePerformanceOptimizationProps) => {
  const performanceDataRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    objectCount: 0,
    memoryUsage: 0,
    frameRate: 0,
    lastUpdate: 0,
  });
  
  const isEnabledRef = useRef(enabled);
  isEnabledRef.current = enabled;

  const optimize = useCallback(() => {
    if (!canvas || !isEnabledRef.current) return;
    
    const start = performance.now();
    optimizeCanvasPerformance(canvas);
    const end = performance.now();

    const renderTime = end - start;
    const objectCount = canvas.getObjects().length;
    // Basic memory usage approximation (very rough)
    const memoryUsage = objectCount * 100; // Assumes each object takes ~100 bytes
    const frameRate = renderTime > 0 ? 1000 / renderTime : 60;

    performanceDataRef.current = {
      renderTime,
      objectCount,
      memoryUsage,
      frameRate,
      lastUpdate: Date.now(),
    };
  }, [canvas]);

  const performance = useMemo(() => performanceDataRef.current, [performanceDataRef.current.lastUpdate]);

  return { optimize, performance };
};
