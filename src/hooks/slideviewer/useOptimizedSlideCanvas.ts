
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Canvas } from 'fabric';
import { useSlideStore } from "@/stores/slide-store";
import { usePerformanceMonitor } from "./usePerformanceMonitor";
import { canvasOptimizer } from "@/utils/slideCanvas/canvasOptimizer";

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
  
  const slides = useSlideStore(state => state.slides);
  const updateSlideElement = useSlideStore(state => state.updateSlideElement);
  
  // パフォーマンス監視
  const {
    metrics,
    startRenderMeasure,
    endRenderMeasure,
    incrementCanvasOps,
    isPerformanceGood
  } = usePerformanceMonitor({ enabled: enablePerformanceMode });
  
  const currentSlideData = slides.find(slide => slide.id === currentSlide);
  const elements = currentSlideData?.elements || [];
  
  // 最適化されたキャンバスサイズ計算
  const canvasSize = useMemo(() => {
    const padding = 40;
    const availableWidth = Math.max(320, containerWidth - padding);
    const availableHeight = Math.max(240, containerHeight - padding);
    
    const aspectRatio = 16 / 9;
    let canvasWidth = availableWidth * 0.92;
    let canvasHeight = canvasWidth / aspectRatio;
    
    if (canvasHeight > availableHeight * 0.92) {
      canvasHeight = availableHeight * 0.92;
      canvasWidth = canvasHeight * aspectRatio;
    }
    
    const isMobile = containerWidth < 768;
    const multiplier = isMobile ? 0.9 : 1.0;
    
    const finalWidth = Math.max(320, Math.min(1920, Math.round(canvasWidth * multiplier)));
    const finalHeight = Math.max(180, Math.min(1080, Math.round(canvasHeight * multiplier)));
    
    return { 
      width: finalWidth, 
      height: finalHeight,
      scale: finalWidth / 1600
    };
  }, [containerWidth, containerHeight]);
  
  // パフォーマンス最適化されたイベントハンドラー
  const setupOptimizedCanvasEvents = useCallback((canvas: Canvas) => {
    if (!editable) return;
    
    // デバウンスされたイベントハンドラー
    let modificationTimeout: NodeJS.Timeout;
    
    const handleObjectModified = (e: any) => {
      incrementCanvasOps();
      
      clearTimeout(modificationTimeout);
      modificationTimeout = setTimeout(() => {
        const obj = e.target as any;
        if (obj?.customData?.id) {
          const updates = {
            position: { x: obj.left || 0, y: obj.top || 0 },
            size: { 
              width: (obj.width || 0) * (obj.scaleX || 1),
              height: (obj.height || 0) * (obj.scaleY || 1)
            },
            angle: obj.angle || 0
          };
          updateSlideElement(currentSlide, obj.customData.id, updates);
        }
      }, 100); // 100msのデバウンス
    };
    
    const handleSelectionCreated = (e: any) => {
      incrementCanvasOps();
      console.log('Object selected:', e.selected?.[0]);
    };
    
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleSelectionCreated);
    
    return () => {
      clearTimeout(modificationTimeout);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:created', handleSelectionCreated);
    };
  }, [editable, currentSlide, updateSlideElement, incrementCanvasOps]);
  
  // 最適化されたキャンバス初期化
  useEffect(() => {
    if (!canvasRef.current || initializationRef.current) return;
    
    try {
      startRenderMeasure();
      
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
      
      const canvas = new Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: '#ffffff',
        selection: editable,
        preserveObjectStacking: true,
        selectionBorderColor: '#2563eb',
        selectionLineWidth: 2,
        controlsAboveOverlay: true,
        allowTouchScrolling: false,
        renderOnAddRemove: false, // パフォーマンス向上のため無効化
        skipTargetFind: false,
        imageSmoothingEnabled: true,
      });
      
      // オプティマイザーにキャンバスを設定
      canvasOptimizer.setCanvas(canvas);
      
      // パフォーマンスモードの適用
      if (enablePerformanceMode && !isPerformanceGood) {
        canvasOptimizer.enableHighPerformanceMode();
      }
      
      fabricCanvasRef.current = canvas;
      initializationRef.current = true;
      setIsReady(true);
      setError(null);
      
      endRenderMeasure();
      
      console.log('Optimized canvas initialized:', {
        size: canvasSize,
        scale: canvasSize.scale,
        editable,
        performanceMode: enablePerformanceMode
      });
      
      const cleanup = setupOptimizedCanvasEvents(canvas);
      return cleanup;
      
    } catch (err) {
      console.error('Optimized canvas initialization failed:', err);
      setError('キャンバスの初期化に失敗しました');
      setIsReady(false);
      initializationRef.current = false;
      endRenderMeasure();
    }
  }, [canvasSize, editable, setupOptimizedCanvasEvents, startRenderMeasure, endRenderMeasure, enablePerformanceMode, isPerformanceGood]);
  
  // 最適化されたキャンバスサイズ更新
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    const timeoutId = setTimeout(() => {
      try {
        startRenderMeasure();
        
        canvasOptimizer.queueRender(() => {
          canvas.setDimensions({
            width: canvasSize.width,
            height: canvasSize.height
          });
        });
        
        endRenderMeasure();
        console.log('Canvas resized with optimization:', canvasSize);
      } catch (err) {
        console.error('Optimized canvas resize error:', err);
        endRenderMeasure();
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [canvasSize, isReady, startRenderMeasure, endRenderMeasure]);
  
  // パフォーマンス監視による動的最適化
  useEffect(() => {
    if (!fabricCanvasRef.current || !enablePerformanceMode) return;
    
    if (!isPerformanceGood) {
      canvasOptimizer.enableHighPerformanceMode();
      console.log('High performance mode enabled due to low performance');
    } else {
      canvasOptimizer.disableHighPerformanceMode();
    }
  }, [isPerformanceGood, enablePerformanceMode]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (err) {
          console.error('Canvas disposal error:', err);
        }
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
    canvasSize,
    elements,
    slides,
    scale: canvasSize.scale,
    isResponsive: containerWidth > 0 && containerHeight > 0,
    // パフォーマンス情報
    performance: {
      metrics,
      isPerformanceGood,
      optimizerReport: canvasOptimizer.getPerformanceReport()
    }
  };
};
