import { useSlideStore } from "@/stores/slide.store";
import { usePerformanceMonitor } from "./usePerformanceMonitor";
import { useCanvasConfig } from "./canvas/useCanvasConfig";
import { useCanvasEvents } from "./canvas/useCanvasEvents";
import { useCanvasInitialization } from "./canvas/useCanvasInitialization";
import { useCanvasResize } from "./canvas/useCanvasResize";

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
  
  // キャンバス設定
  const { canvasSize } = useCanvasConfig({ containerWidth, containerHeight });
  
  // イベントハンドラー設定
  const { setupCanvasEvents } = useCanvasEvents({
    editable,
    currentSlide,
    updateSlideElement,
    incrementCanvasOps
  });
  
  // キャンバス初期化
  const {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error
  } = useCanvasInitialization({
    canvasSize,
    editable,
    enablePerformanceMode,
    isPerformanceGood,
    setupCanvasEvents,
    startRenderMeasure,
    endRenderMeasure
  });
  
  // キャンバスリサイズ
  useCanvasResize({
    canvas: fabricCanvasRef.current,
    isReady,
    canvasSize,
    startRenderMeasure,
    endRenderMeasure
  });
  
  const currentSlideData = slides.find(slide => slide.id === currentSlide);
  const elements = currentSlideData?.elements || [];

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
      optimizerReport: () => {
        try {
          const { canvasOptimizer } = require('@/utils/slideCanvas/canvasOptimizer');
          return canvasOptimizer.getPerformanceReport();
        } catch {
          return { queueLength: 0, isRendering: false, observedElements: 0, config: {} };
        }
      }
    }
  };
};
