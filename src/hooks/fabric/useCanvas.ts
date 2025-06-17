
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { CustomFabricObject } from '@/utils/types/canvas.types';
import { SlideElement } from '@/utils/types/slide.types';
import { useCanvasInitialization } from './useCanvasInitialization';
import { useCanvasZoom } from './useCanvasZoom';
import { useObjectEvents } from './useObjectEvents';
import { useElementsRenderer } from './useElementsRenderer';

interface UseCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  elements?: SlideElement[];
  onUpdateElement?: (elementId: string, updates: Partial<SlideElement>) => void;
  onSelectElement?: (element: CustomFabricObject | null) => void;
  instanceId?: string;
}

export const useCanvas = ({
  canvasRef,
  currentSlide,
  zoomLevel = 100,
  editable = false,
  elements = [],
  onUpdateElement,
  onSelectElement,
  instanceId = 'default'
}: UseCanvasProps) => {
  // 状態管理
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const selectedObjectRef = useRef<CustomFabricObject | null>(null);
  const renderAttemptRef = useRef(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const previousElementsRef = useRef<SlideElement[]>(elements);
  const previousSlideRef = useRef<number>(currentSlide);
  const mountedRef = useRef<boolean>(true);
  const renderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRenderTimeRef = useRef<number>(0);

  // メモ化したonSelectElement関数
  const handleSelectElement = useCallback((obj: CustomFabricObject | null) => {
    if (!mountedRef.current) return;
    
    selectedObjectRef.current = obj;
    if (obj && obj.customData?.id) {
      setSelectedElementId(obj.customData.id);
      if (onSelectElement) onSelectElement(obj);
    } else {
      setSelectedElementId(null);
      if (onSelectElement) onSelectElement(null);
    }
  }, [onSelectElement]);

  // マウントおよびアンマウント時の処理
  useEffect(() => {
    console.log(`[Instance ${instanceId}] useCanvas mounted - slide: ${currentSlide}, editable: ${editable}`);
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (renderTimerRef.current) {
        clearTimeout(renderTimerRef.current);
        renderTimerRef.current = null;
      }
      console.log(`[Instance ${instanceId}] useCanvas unmounted - slide: ${currentSlide}, editable: ${editable}`);
    };
  }, [editable, instanceId, currentSlide]);

  // キャンバス初期化フック
  const { canvas, initialized, containerRef } = useCanvasInitialization({
    canvasRef,
    editable,
    onSelectElement: handleSelectElement,
    instanceId
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
    onUpdateElement,
    instanceId
  });

  // 要素レンダリングフック
  const { renderElements, reset } = useElementsRenderer({
    canvas,
    initialized,
    editable,
    currentSlide,
    instanceId
  });

  // キャンバスが初期化されたらready状態にする
  useEffect(() => {
    if (!mountedRef.current) return;
    
    if (initialized && canvas && !canvas.disposed) {
      console.log(`[Instance ${instanceId}] Canvas is now ready - slide: ${currentSlide}, editable: ${editable}`);
      setCanvasReady(true);
      setLoadingError(null);
    } else {
      setCanvasReady(false);
    }
  }, [initialized, canvas, editable, currentSlide, instanceId]);

  // スライドの内容をレンダリング
  const renderSlideContent = useCallback(() => {
    if (!canvas || !initialized || !mountedRef.current || canvas.disposed) {
      console.log(`[Instance ${instanceId}] Canvas not ready for rendering - initialized: ${initialized}, disposed: ${canvas?.disposed || 'no canvas'}`);
      return;
    }

    // Prevent too frequent renders
    const now = Date.now();
    if (now - lastRenderTimeRef.current < 50) {
      console.log(`[Instance ${instanceId}] Skipping render due to throttling`);
      return;
    }
    lastRenderTimeRef.current = now;

    renderAttemptRef.current += 1;
    console.log(`[Instance ${instanceId}] Rendering slide ${currentSlide} content - editable: ${editable}, attempt: ${renderAttemptRef.current}, elements: ${elements.length}`);
    
    try {
      // 現在のスライドの要素をレンダリング
      renderElements(elements);
      
      console.log(`[Instance ${instanceId}] Slide ${currentSlide} rendered successfully with ${elements.length} elements`);
      
      // 成功したらレンダリング試行カウンタをリセット
      renderAttemptRef.current = 0;
      setLoadingError(null);
    } catch (error) {
      console.error(`[Instance ${instanceId}] Error rendering slide:`, error);
      
      // 3回試行してもエラーの場合はエラー状態に設定
      if (renderAttemptRef.current >= 3) {
        setLoadingError("スライドの読み込み中にエラーが発生しました");
      }
    }
  }, [canvas, initialized, currentSlide, editable, elements, renderElements, instanceId]);

  // 要素やスライドの変更を監視して再レンダリング
  useEffect(() => {
    if (!mountedRef.current) return;
    
    // スライド変更の検出
    const slideChanged = previousSlideRef.current !== currentSlide;
    previousSlideRef.current = currentSlide;

    // 要素の変更検出
    const elementsChanged = JSON.stringify(previousElementsRef.current) !== JSON.stringify(elements);
    previousElementsRef.current = [...elements];
    
    // キャンバスが準備されていない場合はスキップ
    if (!canvas || !initialized || canvas.disposed) {
      console.log(`[Instance ${instanceId}] Skipping render - canvas not ready`);
      return;
    }
    
    if (slideChanged || elementsChanged) {
      console.log(`[Instance ${instanceId}] Slide or elements changed, scheduling render - slideChanged: ${slideChanged}, elementsChanged: ${elementsChanged}`);
      
      // 短い遅延を入れて連続更新を防止
      if (renderTimerRef.current) {
        clearTimeout(renderTimerRef.current);
      }
      
      renderTimerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          renderSlideContent();
        }
        renderTimerRef.current = null;
      }, 100); // Slightly increased delay for stability
    }
  }, [canvas, initialized, currentSlide, elements, renderSlideContent, instanceId]);

  // キャンバスが初期化されたときにすぐに内容をレンダリング
  useEffect(() => {
    if (initialized && canvas && !canvas.disposed && mountedRef.current) {
      console.log(`[Instance ${instanceId}] Canvas initialized, rendering initial content for slide ${currentSlide}`);
      // 初期化直後はやや長めの遅延
      setTimeout(() => {
        if (mountedRef.current) {
          renderSlideContent();
        }
      }, 200);
    }
  }, [initialized, canvas, renderSlideContent, instanceId, currentSlide]);

  // 戻り値をメモ化して安定させる
  return useMemo(() => ({
    canvas,
    initialized,
    renderElements,
    reset,
    selectedObject: selectedObjectRef.current,
    loadingError,
    canvasReady
  }), [canvas, initialized, renderElements, reset, loadingError, canvasReady]);
};

export default useCanvas;
