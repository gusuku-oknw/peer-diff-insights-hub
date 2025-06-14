
import { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas } from 'fabric';
import { canvasOptimizer } from '@/utils/slideCanvas/canvasOptimizer';

interface UseCanvasInitializationProps {
  canvasSize: { width: number; height: number; scale: number };
  editable: boolean;
  enablePerformanceMode: boolean;
  isPerformanceGood: boolean;
  setupCanvasEvents: (canvas: Canvas) => (() => void) | undefined;
  startRenderMeasure: () => void;
  endRenderMeasure: () => void;
}

export const useCanvasInitialization = ({
  canvasSize,
  editable,
  enablePerformanceMode,
  isPerformanceGood,
  setupCanvasEvents,
  startRenderMeasure,
  endRenderMeasure
}: UseCanvasInitializationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializationRef = useRef<boolean>(false);

  // キャンバス初期化
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
        renderOnAddRemove: false,
        skipTargetFind: false,
        imageSmoothingEnabled: true,
      });
      
      canvasOptimizer.setCanvas(canvas);
      
      if (enablePerformanceMode && !isPerformanceGood) {
        canvasOptimizer.enableHighPerformanceMode();
      }
      
      fabricCanvasRef.current = canvas;
      initializationRef.current = true;
      setIsReady(true);
      setError(null);
      
      endRenderMeasure();
      
      console.log('Canvas initialized:', {
        size: canvasSize,
        scale: canvasSize.scale,
        editable,
        performanceMode: enablePerformanceMode
      });
      
      const cleanup = setupCanvasEvents(canvas);
      return cleanup;
      
    } catch (err) {
      console.error('Canvas initialization failed:', err);
      setError('キャンバスの初期化に失敗しました');
      setIsReady(false);
      initializationRef.current = false;
      endRenderMeasure();
    }
  }, [canvasSize, editable, setupCanvasEvents, startRenderMeasure, endRenderMeasure, enablePerformanceMode, isPerformanceGood]);

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
    error
  };
};
