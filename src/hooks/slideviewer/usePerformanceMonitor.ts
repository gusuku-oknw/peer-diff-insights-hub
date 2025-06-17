
import { useState, useEffect, useRef } from 'react';
import { Canvas } from 'fabric';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage?: number;
}

interface UsePerformanceMonitorProps {
  canvas: Canvas | null;
  enabled: boolean;
}

export const usePerformanceMonitor = ({
  canvas,
  enabled
}: UsePerformanceMonitorProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isPerformanceGood, setIsPerformanceGood] = useState(true);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!enabled || !canvas) return;

    let animationId: number;
    
    const measurePerformance = () => {
      const now = performance.now();
      frameCountRef.current++;
      
      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        const renderTime = canvas.getContext().canvas ? 16.67 : 0; // Approximate
        
        const newMetrics: PerformanceMetrics = {
          fps,
          renderTime,
          memoryUsage: (performance as any).memory?.usedJSHeapSize
        };
        
        setMetrics(newMetrics);
        setIsPerformanceGood(fps >= 30); // Consider 30fps as good performance
        
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [canvas, enabled]);

  return {
    performance: { metrics },
    isPerformanceGood
  };
};
