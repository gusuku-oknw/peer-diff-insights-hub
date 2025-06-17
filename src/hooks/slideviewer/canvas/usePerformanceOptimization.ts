
import { useCallback, useMemo, useRef } from 'react';
import { Canvas } from 'fabric';

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

// Basic canvas optimization function
const optimizeCanvasPerformance = (canvas: Canvas) => {
  if (!canvas) return;
  
  // Basic optimization: Set rendering modes
  canvas.renderOnAddRemove = false;
  canvas.skipTargetFind = true;
  
  // Enable caching for better performance
  canvas.getObjects().forEach(obj => {
    obj.set('objectCaching', true);
  });
  
  // Re-enable rendering
  canvas.renderOnAddRemove = true;
  canvas.skipTargetFind = false;
  canvas.requestRenderAll();
};

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

  const performanceMetrics = useMemo(() => performanceDataRef.current, [performanceDataRef.current.lastUpdate]);

  return { optimize, performance: performanceMetrics };
};
