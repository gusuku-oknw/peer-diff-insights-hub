
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
  // 状態管理
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const selectedObjectRef = useRef<CustomFabricObject | null>(null);
  const renderAttemptRef = useRef(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const previousElementsRef = useRef<SlideElement[]>(elements);
  const previousSlideRef = useRef<number>(currentSlide);
  const prevEditableRef = useRef<boolean>(editable);
  const [forceRender, setForceRender] = useState(0);

  // モード変更を検出して強制的に再レンダリング
  useEffect(() => {
    if (prevEditableRef.current !== editable) {
      console.log(`Mode changed in useCanvas: ${prevEditableRef.current} -> ${editable}`);
      prevEditableRef.current = editable;
      setForceRender(prev => prev + 1);
    }
  }, [editable]);

  // メモ化したonSelectElement関数
  const handleSelectElement = useCallback((obj: CustomFabricObject | null) => {
    selectedObjectRef.current = obj;
    if (obj && obj.customData?.id) {
      setSelectedElementId(obj.customData.id);
      if (onSelectElement) onSelectElement(obj);
    } else {
      setSelectedElementId(null);
      if (onSelectElement) onSelectElement(null);
    }
  }, [onSelectElement]);

  // キャンバス初期化フック - editable と forceRender をモード変更検出のために依存関係に追加
  const { canvas, initialized, containerRef } = useCanvasInitialization({
    canvasRef,
    editable,
    onSelectElement: handleSelectElement
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
      console.log(`Canvas is now ready - editable: ${editable}, slide: ${currentSlide}`);
      setCanvasReady(true);
      setLoadingError(null);
    } else {
      setCanvasReady(false);
    }
  }, [initialized, canvas, editable, currentSlide]);

  // スライドが変更されたときや、モードが変更されたときに要素をレンダリング
  useEffect(() => {
    if (!canvas || !initialized) {
      console.log("Canvas not ready for rendering elements");
      return;
    }

    // スライド変更の検出
    const slideChanged = previousSlideRef.current !== currentSlide;
    previousSlideRef.current = currentSlide;

    // 要素の変更検出
    const elementsChanged = JSON.stringify(previousElementsRef.current) !== JSON.stringify(elements);
    previousElementsRef.current = [...elements];
    
    // モード変更、スライド変更、要素変更があった場合のみレンダリング
    if (slideChanged || elementsChanged || forceRender > 0) {
      renderAttemptRef.current += 1;
      
      console.log(`Rendering slide ${currentSlide} content - editable: ${editable}, forceRender: ${forceRender}, attempt: ${renderAttemptRef.current}`);
      
      try {
        // キャンバスをクリア
        canvas.clear();
        
        // 現在のスライドの要素をレンダリング
        renderElements(elements);
        
        // 強制的に再描画
        canvas.renderAll();
        console.log(`Slide ${currentSlide} rendered successfully with ${elements.length} elements`);
        
        // 成功したらレンダリング試行カウンタをリセット
        renderAttemptRef.current = 0;
        setLoadingError(null);
      } catch (error) {
        console.error("Error rendering slide:", error);
        
        // 3回試行してもエラーの場合はエラー状態に設定
        if (renderAttemptRef.current >= 3) {
          setLoadingError("スライドの読み込み中にエラーが発生しました");
        }
      }
    }
  }, [currentSlide, initialized, canvas, renderElements, elements, forceRender, editable]);

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
