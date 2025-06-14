
import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from 'fabric';
import { useSlideStore } from '@/stores/slide-store';
import { useCanvasInitialization } from './canvas/useCanvasInitialization';
import { useCanvasResize } from './canvas/useCanvasResize';
import { usePerformanceMonitor } from './usePerformanceMonitor';
import { usePerformanceOptimization } from './canvas/usePerformanceOptimization';

interface UseOptimizedSlideCanvasProps {
  currentSlide: number;
  editable: boolean;
  containerWidth: number;
  containerHeight: number;
  enablePerformanceMode?: boolean;
}

export const useOptimizedSlideCanvas = ({
  currentSlide,
  editable,
  containerWidth,
  containerHeight,
  enablePerformanceMode = true
}: UseOptimizedSlideCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { slides } = useSlideStore();
  
  // Get current slide data
  const currentSlideData = slides[currentSlide - 1];
  const elements = currentSlideData?.elements || [];
  
  // Performance monitoring
  const { performance, isPerformanceGood } = usePerformanceMonitor({
    canvas: fabricCanvasRef.current,
    enabled: enablePerformanceMode
  });
  
  // Canvas initialization
  const { initializeCanvas } = useCanvasInitialization({
    canvasRef,
    fabricCanvasRef,
    editable,
    onReady: () => setIsReady(true),
    onError: setError
  });
  
  // Canvas resizing
  useCanvasResize({
    canvas: fabricCanvasRef.current,
    containerWidth,
    containerHeight
  });
  
  // Performance optimization
  usePerformanceOptimization({
    canvas: fabricCanvasRef.current,
    enablePerformanceMode,
    isPerformanceGood
  });
  
  // Initialize canvas when container dimensions are available
  useEffect(() => {
    if (containerWidth > 0 && containerHeight > 0 && canvasRef.current && !fabricCanvasRef.current) {
      initializeCanvas();
    }
  }, [containerWidth, containerHeight, initializeCanvas]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);
  
  return {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error,
    elements,
    slides,
    performance
  };
};
