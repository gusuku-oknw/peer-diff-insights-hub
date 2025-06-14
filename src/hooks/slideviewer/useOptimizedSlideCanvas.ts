
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas } from 'fabric';
import { useSlideStore } from '@/stores/slide.store';
import { useStandardSlideSize } from './useStandardSlideSize';
import { detectDisplayCapabilities } from '@/utils/slideCanvas/standardSlideSizes';

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
  const initializationRef = useRef<boolean>(false);
  
  const { slides } = useSlideStore();
  
  // Get current slide data - memoized to prevent unnecessary re-renders
  const currentSlideData = useMemo(() => 
    slides[currentSlide - 1], 
    [slides, currentSlide]
  );
  const elements = currentSlideData?.elements || [];
  
  // Get high-resolution slide size with display capabilities
  const { slideSize, deviceType } = useStandardSlideSize({
    containerWidth,
    containerHeight,
    preferredAspectRatio: 16 / 9
  });

  // Ultra-high resolution canvas configuration
  const canvasConfig = useMemo(() => {
    const displayCapabilities = detectDisplayCapabilities();
    
    // Super High-DPI scaling (up to 6x for 8K displays)
    const maxRatio = displayCapabilities.is8KCapable ? 6 : 
                    displayCapabilities.is4KCapable ? 4 : 
                    displayCapabilities.isUltraHighDPI ? 3 : 2;
    const pixelRatio = Math.min(displayCapabilities.pixelRatio || 1, maxRatio);
    
    // Ultra-high resolution dimensions
    const ultraWidth = slideSize.width * pixelRatio;
    const ultraHeight = slideSize.height * pixelRatio;
    
    console.log('High-resolution canvas config:', {
      baseSize: `${slideSize.width}x${slideSize.height}`,
      ultraSize: `${ultraWidth}x${ultraHeight}`,
      pixelRatio,
      displayCapabilities: {
        is8K: displayCapabilities.is8KCapable,
        is4K: displayCapabilities.is4KCapable,
        ultraHighDPI: displayCapabilities.isUltraHighDPI
      }
    });
    
    return {
      width: ultraWidth,
      height: ultraHeight,
      displayWidth: slideSize.width,
      displayHeight: slideSize.height,
      pixelRatio,
      scale: pixelRatio,
      displayCapabilities
    };
  }, [slideSize]);

  // Performance monitoring - simplified to prevent re-renders
  const performance = useMemo(() => ({
    metrics: { fps: 60, renderTime: 16 },
    isPerformanceGood: true
  }), []);

  // Canvas initialization with high-resolution support
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || initializationRef.current) return;
    
    try {
      // Clean up existing canvas
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
      
      console.log('Initializing ultra-high resolution canvas:', canvasConfig);
      
      const canvas = new Canvas(canvasRef.current, {
        width: canvasConfig.width,
        height: canvasConfig.height,
        backgroundColor: '#ffffff',
        selection: editable,
        preserveObjectStacking: true,
        selectionBorderColor: '#2563eb',
        selectionLineWidth: 2,
        controlsAboveOverlay: true,
        allowTouchScrolling: false,
        renderOnAddRemove: false,
        skipTargetFind: false,
        imageSmoothingEnabled: true,
        enableRetinaScaling: true
      });
      
      // Set up ultra-high resolution rendering
      const canvasElement = canvasRef.current;
      canvasElement.width = canvasConfig.width;
      canvasElement.height = canvasConfig.height;
      canvasElement.style.width = `${canvasConfig.displayWidth}px`;
      canvasElement.style.height = `${canvasConfig.displayHeight}px`;
      
      // Configure context for maximum quality
      const ctx = canvasElement.getContext('2d');
      if (ctx && canvasConfig.pixelRatio > 1) {
        ctx.scale(canvasConfig.pixelRatio, canvasConfig.pixelRatio);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
      
      // Set Fabric.js zoom to compensate for high-DPI scaling
      canvas.setZoom(canvasConfig.pixelRatio);
      
      fabricCanvasRef.current = canvas;
      initializationRef.current = true;
      setIsReady(true);
      setError(null);
      
      console.log(`Ultra-high DPI canvas ready: ${canvasConfig.width}x${canvasConfig.height} (${canvasConfig.pixelRatio}x scale)`);
      
    } catch (err) {
      console.error('High-resolution canvas initialization failed:', err);
      setError('キャンバスの初期化に失敗しました');
      setIsReady(false);
      initializationRef.current = false;
    }
  }, [canvasConfig, editable]);
  
  // Initialize canvas when container dimensions are available
  useEffect(() => {
    if (containerWidth > 0 && containerHeight > 0) {
      initializeCanvas();
    }
  }, [containerWidth, containerHeight, initializeCanvas]);
  
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
    canvasConfig,
    performance
  };
};
