
import { useEffect, useRef, useState, useMemo } from 'react';
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
  const canvasInitializationCount = useRef(0);

  // キャンバス設定をメモ化して再レンダリングを防ぐ
  const canvasConfig = useMemo(() => ({
    backgroundColor: '#ffffff',
    width: 1600,
    height: 900,
    selection: editable,
    preserveObjectStacking: true,
    selectionBorderColor: '#2563eb',
    selectionLineWidth: 2,
  }), [editable]);

  useEffect(() => {
    // 既に初期化されている場合はスキップ
    if (initialized && canvasInstance.current) {
      return;
    }

    // 初期化カウントを追跡
    canvasInitializationCount.current += 1;
    if (canvasInitializationCount.current > 1) {
      console.log(`Canvas re-initialization attempt #${canvasInitializationCount.current}`);
    }

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

    try {
      // 要素がまだDOM内に存在するか確認
      if (!canvasRef.current || !document.body.contains(canvasRef.current)) {
        console.log("Canvas element is no longer in the DOM");
        return;
      }

      const canvas = new Canvas(canvasRef.current, canvasConfig);

      // 親コンテナに基づいて適切なサイズを設定
      if (containerRef.current) {
        canvas.setWidth(1600);
        canvas.setHeight(900);
      }
      
      // 編集モードの場合、選択イベントをセットアップ
      if (editable && onSelectElement) {
        canvas.on('selection:created', (e) => {
          if (e.selected && e.selected.length > 0) {
            const obj = e.selected[0] as any;
            onSelectElement(obj);
          }
        });
        
        canvas.on('selection:updated', (e) => {
          if (e.selected && e.selected.length > 0) {
            const obj = e.selected[0] as any;
            onSelectElement(obj);
          }
        });
        
        canvas.on('selection:cleared', () => {
          onSelectElement(null);
        });
      }

      canvasInstance.current = canvas;
      setInitialized(true);
      console.log("Canvas initialized successfully");
    } catch (error) {
      console.error("Error initializing canvas:", error);
    }

    // クリーンアップ関数
    return () => {
      if (canvasInstance.current) {
        try {
          // unmount時の再初期化を防ぐためにフラグを設定
          setInitialized(false);
          canvasInstance.current.dispose();
        } catch (e) {
          console.error("Error disposing canvas:", e);
        }
        canvasInstance.current = null;
      }
    };
  }, [canvasRef, editable, onSelectElement, canvasConfig]);

  return {
    canvas: canvasInstance.current,
    initialized,
    containerRef
  };
};
