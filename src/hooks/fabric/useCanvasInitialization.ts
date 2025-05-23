
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
  const prevEditableRef = useRef<boolean>(editable);

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
    console.log(`useCanvasInitialization effect triggered, editable: ${editable}, initialized: ${initialized}`);
    
    // モードが変更された場合は再初期化フラグを設定
    const modeChanged = prevEditableRef.current !== editable;
    prevEditableRef.current = editable;
    
    if (modeChanged) {
      console.log(`Mode changed from ${prevEditableRef.current} to ${editable}, forcing re-initialization`);
    }
    
    // DOMがマウントされていることを確認
    if (!canvasRef.current || !document.body.contains(canvasRef.current)) {
      console.log("Canvas element is not in DOM yet or not available, waiting...");
      return;
    }

    // 親コンテナを保存
    containerRef.current = canvasRef.current.parentElement;

    // 既存のキャンバスがある場合は明示的に破棄
    if (canvasInstance.current) {
      try {
        console.log(`Disposing existing canvas: editable=${editable}, modeChanged=${modeChanged}`);
        canvasInstance.current.dispose();
        canvasInstance.current = null;
        setInitialized(false);
      } catch (e) {
        console.error("Error disposing canvas on mode change:", e);
      }
    }

    // 初期化カウントを追跡して診断に使用
    canvasInitializationCount.current += 1;
    console.log(`Canvas initialization attempt #${canvasInitializationCount.current}, editable: ${editable}`);

    // キャンバス初期化を少し遅らせてDOMが完全に準備されるようにする
    const initTimer = setTimeout(() => {
      try {
        // 要素がまだDOM内に存在するか再確認
        if (!canvasRef.current || !document.body.contains(canvasRef.current)) {
          console.log("Canvas element is no longer in the DOM during initialization");
          return;
        }

        // 新しいキャンバスを作成
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

        // 参照を設定し、初期化完了をマーク
        canvasInstance.current = canvas;
        console.log(`Canvas successfully initialized, editable: ${editable}, id: ${canvasRef.current.id}`);
        setInitialized(true);
        
        // 初期化後に強制的に再描画
        setTimeout(() => {
          if (canvas && !canvas.disposed) {
            canvas.renderAll();
            console.log("Forced canvas render after initialization");
          }
        }, 50);
      } catch (error) {
        console.error("Error initializing canvas:", error);
      }
    }, 10); // 短い遅延を入れる

    // クリーンアップ関数
    return () => {
      clearTimeout(initTimer);
      
      if (canvasInstance.current) {
        try {
          // unmount時の再初期化を防ぐためにフラグを設定
          setInitialized(false);
          canvasInstance.current.dispose();
          canvasInstance.current = null;
          console.log("Canvas disposed during cleanup");
        } catch (e) {
          console.error("Error disposing canvas:", e);
        }
      }
    };
  }, [canvasRef, editable, onSelectElement, canvasConfig]);

  return {
    canvas: canvasInstance.current,
    initialized,
    containerRef
  };
};
