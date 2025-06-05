
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Canvas } from 'fabric';
import { useSlideStore } from "@/stores/slide-store";

interface UseSlideCanvasProps {
  currentSlide: number;
  editable: boolean;
  containerWidth: number;
  containerHeight: number;
}

export const useSlideCanvas = ({ 
  currentSlide, 
  editable, 
  containerWidth, 
  containerHeight 
}: UseSlideCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializationRef = useRef<boolean>(false);
  
  const slides = useSlideStore(state => state.slides);
  const updateSlideElement = useSlideStore(state => state.updateSlideElement);
  
  const currentSlideData = slides.find(slide => slide.id === currentSlide);
  const elements = currentSlideData?.elements || [];
  
  // メモ化されたキャンバスサイズ計算
  const canvasSize = useMemo(() => {
    const fallbackWidth = 1600;
    const fallbackHeight = 900;
    
    const availableWidth = containerWidth > 0 ? containerWidth - 32 : fallbackWidth * 0.8;
    const availableHeight = containerHeight > 0 ? containerHeight - 32 : fallbackHeight * 0.8;
    
    const aspectRatio = 16 / 9;
    let canvasWidth = availableWidth * 0.9;
    let canvasHeight = canvasWidth / aspectRatio;
    
    if (canvasHeight > availableHeight * 0.9) {
      canvasHeight = availableHeight * 0.9;
      canvasWidth = canvasHeight * aspectRatio;
    }
    
    canvasWidth = Math.max(400, Math.min(1920, canvasWidth));
    canvasHeight = Math.max(225, Math.min(1080, canvasHeight));
    
    return { width: Math.round(canvasWidth), height: Math.round(canvasHeight) };
  }, [containerWidth, containerHeight]);
  
  // キャンバスイベントハンドラー（メモ化）
  const setupCanvasEvents = useCallback((canvas: Canvas) => {
    if (!editable) return;
    
    const handleSelectionCreated = (e: any) => {
      console.log('Object selected:', e.selected?.[0]);
    };
    
    const handleObjectModified = (e: any) => {
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
    };
    
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('object:modified', handleObjectModified);
    
    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('object:modified', handleObjectModified);
    };
  }, [editable, currentSlide, updateSlideElement]);
  
  // キャンバス初期化（最適化版）
  useEffect(() => {
    if (!canvasRef.current || initializationRef.current) return;
    
    try {
      // 既存のキャンバスを破棄
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
      });
      
      fabricCanvasRef.current = canvas;
      initializationRef.current = true;
      setIsReady(true);
      setError(null);
      
      console.log('Canvas initialized with size:', canvasSize);
      
      // イベントハンドラーのセットアップ
      const cleanup = setupCanvasEvents(canvas);
      
      return cleanup;
      
    } catch (err) {
      console.error('Canvas initialization failed:', err);
      setError('キャンバスの初期化に失敗しました');
      setIsReady(false);
      initializationRef.current = false;
    }
  }, [canvasSize, editable, setupCanvasEvents]);
  
  // キャンバスサイズ更新（デバウンス処理）
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    const timeoutId = setTimeout(() => {
      canvas.setDimensions({
        width: canvasSize.width,
        height: canvasSize.height
      });
      canvas.renderAll();
      console.log('Canvas resized to:', canvasSize);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [canvasSize, isReady]);

  // クリーンアップ
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
    canvasSize,
    elements,
    slides
  };
};
