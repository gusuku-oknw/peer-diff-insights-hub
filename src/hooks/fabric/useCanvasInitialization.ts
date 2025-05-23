
import { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';

interface UseCanvasInitializationProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editable?: boolean;
  onSelectElement?: (element: any | null) => void;
}

interface UseCanvasInitializationResult {
  canvas: Canvas | null;
  initialized: boolean;
  containerRef: React.MutableRefObject<HTMLElement | null>;
}

export const useCanvasInitialization = ({
  canvasRef,
  editable = false,
  onSelectElement
}: UseCanvasInitializationProps): UseCanvasInitializationResult => {
  const canvasInstance = useRef<Canvas | null>(null);
  const [initialized, setInitialized] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 既存のキャンバスインスタンスがあれば破棄
    if (canvasInstance.current) {
      try {
        canvasInstance.current.dispose();
      } catch (e) {
        console.error("Error disposing canvas:", e);
      }
      canvasInstance.current = null;
    }

    // キャンバス要素が使用可能か確認
    if (!canvasRef.current) {
      setInitialized(false);
      return;
    }

    // 親コンテナを保存
    containerRef.current = canvasRef.current.parentElement;

    // DOMが準備できるまで少し待機
    const initTimer = setTimeout(() => {
      try {
        // 要素がまだDOM内に存在するか確認
        if (!canvasRef.current || !document.body.contains(canvasRef.current)) {
          console.log("Canvas element is no longer in the DOM");
          return;
        }

        const canvas = new Canvas(canvasRef.current, {
          backgroundColor: '#ffffff',
          width: 1600,
          height: 900,
          selection: editable,
          preserveObjectStacking: true,
          selectionBorderColor: '#2563eb',
          selectionLineWidth: 2,
        });

        // 親コンテナに基づいて適切なサイズを設定
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;
          
          canvas.setWidth(1600);
          canvas.setHeight(900);
        }
        
        // 編集モードの場合、選択イベントをセットアップ
        if (editable && onSelectElement) {
          canvas.on('selection:created', (e) => {
            if (e.selected && e.selected.length > 0) {
              const obj = e.selected[0] as any;
              if (onSelectElement) onSelectElement(obj);
            }
          });
          
          canvas.on('selection:updated', (e) => {
            if (e.selected && e.selected.length > 0) {
              const obj = e.selected[0] as any;
              if (onSelectElement) onSelectElement(obj);
            }
          });
          
          canvas.on('selection:cleared', () => {
            if (onSelectElement) onSelectElement(null);
          });
        }

        canvasInstance.current = canvas;
        setInitialized(true);
        console.log("Canvas initialized successfully");
      } catch (error) {
        console.error("Error initializing canvas:", error);
      }
    }, 150);

    return () => {
      clearTimeout(initTimer);
      if (canvasInstance.current) {
        try {
          canvasInstance.current.dispose();
        } catch (e) {
          console.error("Error disposing canvas:", e);
        }
        canvasInstance.current = null;
        setInitialized(false);
      }
    };
  }, [canvasRef, editable, onSelectElement]);

  return {
    canvas: canvasInstance.current,
    initialized,
    containerRef
  };
};
