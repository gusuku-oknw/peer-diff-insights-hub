
import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, IText, Rect, Circle, Image, Object as FabricObject } from 'fabric';
import { CustomFabricObject } from '@/utils/types/canvas.types';
import { SlideElement } from '@/utils/types/slide.types';
import { useCanvasInitialization } from './fabric/useCanvasInitialization';
import { useCanvasZoom } from './fabric/useCanvasZoom';
import { useObjectEvents } from './fabric/useObjectEvents';
import { useElementsRenderer } from './fabric/useElementsRenderer';

interface UseCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  elements?: SlideElement[];
  onUpdateElement?: (elementId: string, updates: Partial<SlideElement>) => void;
  onSelectElement?: (element: CustomFabricObject | null) => void;
}

export const useCanvas = ({
  canvasRef,
  currentSlide,
  zoomLevel = 100,
  editable = false,
  elements = [],
  onUpdateElement,
  onSelectElement
}: UseCanvasProps) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const selectedObjectRef = useRef<CustomFabricObject | null>(null);
  const renderAttemptRef = useRef(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // キャンバス初期化フック
  const { canvas, initialized, containerRef } = useCanvasInitialization({
    canvasRef,
    editable,
    onSelectElement: (obj) => {
      selectedObjectRef.current = obj;
      if (obj && obj.customData?.id) {
        setSelectedElementId(obj.customData.id);
        if (onSelectElement) onSelectElement(obj);
      } else {
        setSelectedElementId(null);
        if (onSelectElement) onSelectElement(null);
      }
    }
  });

  // ズームフック
  useCanvasZoom({
    canvas,
    initialized,
    containerRef,
    zoomLevel
  });

  // オブジェクトイベントフック
  useObjectEvents({
    canvas,
    initialized,
    editable,
    onUpdateElement
  });

  // 要素レンダリングフック
  const { renderElements, reset } = useElementsRenderer({
    canvas,
    initialized,
    editable,
    currentSlide
  });

  // キャンバスが初期化されたらready状態にする
  useEffect(() => {
    if (initialized && canvas) {
      setCanvasReady(true);
      setLoadingError(null);
    }
  }, [initialized, canvas]);

  // スライドが変更されたときに要素をレンダリング
  useEffect(() => {
    if (!canvas || !initialized || !canvasReady) return;

    const maxRenderAttempts = 3;
    renderAttemptRef.current += 1;

    console.log("Loading slide content for slide", currentSlide);
    
    try {
      // 現在のスライドの要素をレンダリング
      renderElements(elements);
      
      // 成功したらレンダリング試行カウンタをリセット
      renderAttemptRef.current = 0;
      setLoadingError(null);
    } catch (error) {
      console.error("Error rendering slide:", error);
      
      // 最大試行回数を超えた場合はエラー状態に設定
      if (renderAttemptRef.current >= maxRenderAttempts) {
        setLoadingError("スライドの読み込み中にエラーが発生しました");
      }
    }
  }, [currentSlide, initialized, canvasReady, canvas, renderElements, elements]);

  return {
    canvas,
    initialized,
    renderElements,
    reset,
    selectedObject: selectedObjectRef.current,
    loadingError,
    canvasReady
  };
};

export default useCanvas;
