
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
  
  const currentSlideData = useMemo(() => 
    slides[currentSlide - 1], 
    [slides, currentSlide]
  );
  const elements = currentSlideData?.elements || [];
  
  // Get high-resolution slide size with forced high quality
  const { slideSize, deviceType } = useStandardSlideSize({
    containerWidth,
    containerHeight,
    preferredAspectRatio: 16 / 9
  });

  // --- 改善：常に高DPIを適用するためのcanvasConfig ---
  const canvasConfig = useMemo(() => {
    // 通常のdisplayCapabilitiesだと1xになるが、今回はforceに最低2xとする
    const displayCapabilities = detectDisplayCapabilities();
    // 強制的に2xまたは3x（実DPIが2x超の場合のみその値を使う）
    const ENFORCED_MIN_PIXELRATIO = 2;
    const ENFORCED_IDEAL_PIXELRATIO = 3;
    const pixelRatio =
      displayCapabilities.pixelRatio < ENFORCED_MIN_PIXELRATIO
        ? ENFORCED_MIN_PIXELRATIO
        : displayCapabilities.pixelRatio < ENFORCED_IDEAL_PIXELRATIO
          ? ENFORCED_IDEAL_PIXELRATIO
          : displayCapabilities.pixelRatio;

    const ultraWidth = slideSize.width * pixelRatio;
    const ultraHeight = slideSize.height * pixelRatio;

    // ログ明示
    console.log('最終canvas解像度', {
      baseSize: `${slideSize.width}x${slideSize.height}`,
      ultraSize: `${ultraWidth}x${ultraHeight}`,
      pixelRatio,
      forcedHighQuality: true
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

  const performance = useMemo(() => ({
    metrics: { fps: 60, renderTime: 16 },
    isPerformanceGood: true
  }), []);

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || initializationRef.current) return;

    try {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }

      console.log('Initializing canvas for high quality:', canvasConfig);

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

      // Enhance: force HTML Canvas and context to high quality always
      const canvasElement = canvasRef.current;
      canvasElement.width = canvasConfig.width;
      canvasElement.height = canvasConfig.height;
      canvasElement.style.width = `${canvasConfig.displayWidth}px`;
      canvasElement.style.height = `${canvasConfig.displayHeight}px`;

      // 強制的にスムージングを最優先
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        ctx.scale(canvasConfig.pixelRatio, canvasConfig.pixelRatio);
        ctx.imageSmoothingEnabled = true;
        try {
          (ctx as any).imageSmoothingQuality = 'high';
        } catch (e) {
          // not all browsers support
        }
      }

      canvas.setZoom(canvasConfig.pixelRatio);

      fabricCanvasRef.current = canvas;
      initializationRef.current = true;
      setIsReady(true);
      setError(null);

      console.log(
        `HIGH-QUALITY canvas ready: ${canvasConfig.width}x${canvasConfig.height} (${canvasConfig.pixelRatio}x enforced)`
      );
    } catch (err) {
      console.error('Canvas initialization failed:', err);
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
