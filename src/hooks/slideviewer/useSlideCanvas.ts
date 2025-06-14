import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Canvas } from 'fabric';
import { useSlideStore } from "@/stores/slide.store";

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
  
  // 改善されたキャンバスサイズ計算
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
    
    // デバイス別の最適化
    const isMobile = containerWidth < 768;
    const multiplier = isMobile ? 0.9 : 1.0;
    
    const finalWidth = Math.max(320, Math.min(1920, Math.round(canvasWidth * multiplier)));
    const finalHeight = Math.max(180, Math.min(1080, Math.round(canvasHeight * multiplier)));
    
    return { 
      width: finalWidth, 
      height: finalHeight,
      scale: finalWidth / 1600 // 基準サイズとの比率
    };
  }, [containerWidth, containerHeight]);
  
  // 最適化されたキャンバスイベントハンドラー
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

    // パフォーマンス最適化のためのイベント
    const handleRenderComplete = () => {
      // レンダリング完了時の処理
      console.log('Canvas render completed');
    };
    
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('after:render', handleRenderComplete);
    
    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('after:render', handleRenderComplete);
    };
  }, [editable, currentSlide, updateSlideElement]);
  
  // 改善されたキャンバス初期化
  useEffect(() => {
    if (!canvasRef.current || initializationRef.current) return;
    
    try {
      // 既存のキャンバスを適切に破棄
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
        // パフォーマンス最適化
        renderOnAddRemove: true,
        skipTargetFind: false,
        imageSmoothingEnabled: true,
      });
      
      fabricCanvasRef.current = canvas;
      initializationRef.current = true;
      setIsReady(true);
      setError(null);
      
      console.log('Enhanced canvas initialized:', {
        size: canvasSize,
        scale: canvasSize.scale,
        editable
      });
      
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
  
  // 改善されたキャンバスサイズ更新
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    const timeoutId = setTimeout(() => {
      try {
        canvas.setDimensions({
          width: canvasSize.width,
          height: canvasSize.height
        });
        
        // ズーム関連の処理を削除（上位コンポーネントで管理）
        canvas.renderAll();
        
        console.log('Canvas resized:', canvasSize);
      } catch (err) {
        console.error('Canvas resize error:', err);
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [canvasSize, isReady]);

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
    // 追加の有用な情報
    scale: canvasSize.scale,
    isResponsive: containerWidth > 0 && containerHeight > 0
  };
};
