
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas } from 'fabric';
import { useSlideStore } from '@/stores/slide.store';

interface UseOptimizedSlideCanvasProps {
  currentSlide: number;
  editable: boolean;
  canvasConfig: {
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
    pixelRatio: number;
  };
  enablePerformanceMode?: boolean;
}

export const useOptimizedSlideCanvas = ({
  currentSlide,
  editable,
  canvasConfig,
  enablePerformanceMode = true
}: UseOptimizedSlideCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializationRef = useRef<boolean>(false);
  
  const { slides } = useSlideStore();
  
  const currentSlideData = useMemo(() => 
    slides[currentSlide - 1], 
    [slides, currentSlide]
  );
  const elements = currentSlideData?.elements || [];

  const performance = useMemo(() => ({
    metrics: { fps: 60, renderTime: 16 },
    isPerformanceGood: true
  }), []);

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || initializationRef.current || !canvasConfig) return;

    try {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }

      console.log('Initializing canvas with dynamic config:', {
        canvasSize: `${canvasConfig.width}x${canvasConfig.height}`,
        displaySize: `${canvasConfig.displayWidth}x${canvasConfig.displayHeight}`,
        useActualSizing: canvasConfig.useActualSizing
      });

      const canvas = new Canvas(canvasRef.current, {
        width: canvasConfig.width,
        height: canvasConfig.height,
        backgroundColor: '#ffffff',
        selection: editable,
        preserveObjectStacking: true,
        selectionBorderColor: '#2563eb',
        selectionLineWidth: 1,
        controlsAboveOverlay: true,
        allowTouchScrolling: false,
        renderOnAddRemove: false,
        skipTargetFind: false,
        imageSmoothingEnabled: true,
        enableRetinaScaling: false
      });

      // Set fixed control sizes that won't scale with zoom
      if (editable) {
        canvas.selectionLineWidth = 1;
        canvas.selectionBorderColor = '#2563eb';
        
        // Set fixed control corner size
        (canvas as any).controlSize = 8;
        (canvas as any).borderOpacityWhenMoving = 0.4;
      }

      // Set canvas element attributes for dynamic sizing
      const canvasElement = canvasRef.current;
      canvasElement.width = canvasConfig.width;
      canvasElement.height = canvasConfig.height;
      canvasElement.style.width = `${canvasConfig.displayWidth}px`;
      canvasElement.style.height = `${canvasConfig.displayHeight}px`;

      fabricCanvasRef.current = canvas;
      initializationRef.current = true;
      setIsReady(true);
      setError(null);

      console.log(`Canvas initialized - Size: ${canvasConfig.width}x${canvasConfig.height}, Display: ${canvasConfig.displayWidth}x${canvasConfig.displayHeight}`);
    } catch (err) {
      console.error('Canvas initialization failed:', err);
      setError('キャンバスの初期化に失敗しました');
      setIsReady(false);
      initializationRef.current = false;
    }
  }, [canvasConfig, editable]);
  
  // Reinitialize canvas when config changes significantly
  useEffect(() => {
    if (canvasConfig) {
      // Force reinitialization for size changes
      initializationRef.current = false;
      initializeCanvas();
    }
  }, [canvasConfig, initializeCanvas]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
        initializationRef.current = false;
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
