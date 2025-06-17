
import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fps: number;
  canvasOperations: number;
}

interface UsePerformanceMonitorProps {
  enabled?: boolean;
  sampleInterval?: number;
}

export const usePerformanceMonitor = ({
  enabled = true,
  sampleInterval = 1000
}: UsePerformanceMonitorProps = {}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
    canvasOperations: 0
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderStartTime = useRef<number>(0);
  const canvasOpsCount = useRef(0);
  
  // FPS計測
  const measureFPS = useCallback(() => {
    const now = performance.now();
    frameCount.current++;
    
    if (now - lastTime.current >= sampleInterval) {
      const fps = (frameCount.current * 1000) / (now - lastTime.current);
      setMetrics(prev => ({ ...prev, fps: Math.round(fps) }));
      frameCount.current = 0;
      lastTime.current = now;
    }
    
    if (enabled) {
      requestAnimationFrame(measureFPS);
    }
  }, [enabled, sampleInterval]);
  
  // レンダリング時間計測
  const startRenderMeasure = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);
  
  const endRenderMeasure = useCallback(() => {
    if (renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({ ...prev, renderTime: Math.round(renderTime) }));
      renderStartTime.current = 0;
    }
  }, []);
  
  // キャンバス操作カウント
  const incrementCanvasOps = useCallback(() => {
    canvasOpsCount.current++;
    setMetrics(prev => ({ ...prev, canvasOperations: canvasOpsCount.current }));
  }, []);
  
  // メモリ使用量計測
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      setMetrics(prev => ({ ...prev, memoryUsage: usedMB }));
    }
  }, []);
  
  useEffect(() => {
    if (!enabled) return;
    
    measureFPS();
    
    const memoryInterval = setInterval(measureMemory, sampleInterval);
    
    return () => {
      clearInterval(memoryInterval);
    };
  }, [enabled, measureFPS, measureMemory, sampleInterval]);
  
  const resetMetrics = useCallback(() => {
    frameCount.current = 0;
    canvasOpsCount.current = 0;
    lastTime.current = performance.now();
    setMetrics({ renderTime: 0, memoryUsage: 0, fps: 0, canvasOperations: 0 });
  }, []);
  
  return {
    metrics,
    startRenderMeasure,
    endRenderMeasure,
    incrementCanvasOps,
    resetMetrics,
    isPerformanceGood: metrics.fps >= 30 && metrics.renderTime < 16
  };
};
