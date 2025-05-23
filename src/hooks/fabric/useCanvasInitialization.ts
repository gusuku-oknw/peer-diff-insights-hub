
import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas } from 'fabric';

interface UseCanvasInitializationProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editable?: boolean;
  onSelectElement?: (element: any | null) => void;
  instanceId?: string;
}

interface UseCanvasInitializationResult {
  canvas: Canvas | null;
  initialized: boolean;
  containerRef: React.MutableRefObject<HTMLElement | null>;
}

export const useCanvasInitialization = ({
  canvasRef,
  editable = false,
  onSelectElement,
  instanceId = 'default'
}: UseCanvasInitializationProps): UseCanvasInitializationResult => {
  const canvasInstance = useRef<Canvas | null>(null);
  const [initialized, setInitialized] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasInitializationCount = useRef(0);
  const prevEditableRef = useRef<boolean>(editable);
  const mountedRef = useRef<boolean>(false);

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

  // キャンバスを明示的に破棄するヘルパー関数
  const disposeCanvas = () => {
    if (canvasInstance.current) {
      try {
        console.log(`[Instance ${instanceId}] Explicitly disposing canvas`);
        canvasInstance.current.dispose();
        canvasInstance.current = null;
        setInitialized(false);
      } catch (e) {
        console.error(`[Instance ${instanceId}] Error disposing canvas:`, e);
      }
    }
  };

  useEffect(() => {
    console.log(`[Instance ${instanceId}] Canvas initialization effect triggered, editable: ${editable}, initialized: ${initialized}`);
    mountedRef.current = true;
    
    // モードが変更された場合は再初期化
    const modeChanged = prevEditableRef.current !== editable;
    if (modeChanged) {
      console.log(`[Instance ${instanceId}] Mode changed from ${prevEditableRef.current} to ${editable}, clearing existing canvas`);
      disposeCanvas();
    }
    prevEditableRef.current = editable;
    
    // DOMがマウントされていることを確認
    if (!canvasRef.current) {
      console.log(`[Instance ${instanceId}] Canvas element not available yet`);
      return;
    }

    if (!document.body.contains(canvasRef.current)) {
      console.log(`[Instance ${instanceId}] Canvas element is not in DOM yet`);
      return;
    }

    // 親コンテナを保存
    containerRef.current = canvasRef.current.parentElement;

    // 既に初期化済みの場合はスキップ
    if (canvasInstance.current && initialized) {
      console.log(`[Instance ${instanceId}] Canvas already initialized, skipping`);
      return;
    }

    // 初期化カウントを追跡して診断に使用
    canvasInitializationCount.current += 1;
    console.log(`[Instance ${instanceId}] Canvas initialization attempt #${canvasInitializationCount.current}, editable: ${editable}`);

    // キャンバス初期化
    const initTimer = setTimeout(() => {
      // コンポーネントがまだマウントされているか確認
      if (!mountedRef.current) {
        console.log(`[Instance ${instanceId}] Component unmounted before canvas initialization`);
        return;
      }
      
      // 要素がまだDOM内に存在するか再確認
      if (!canvasRef.current || !document.body.contains(canvasRef.current)) {
        console.log(`[Instance ${instanceId}] Canvas element is no longer in the DOM during initialization`);
        return;
      }

      try {
        // 既存のキャンバスがあれば破棄
        disposeCanvas();
        
        // 新しいキャンバスを作成
        const canvas = new Canvas(canvasRef.current, canvasConfig);
        console.log(`[Instance ${instanceId}] New canvas created with config:`, canvasConfig);

        // 親コンテナに基づいて適切なサイズを設定
        canvas.setWidth(1600);
        canvas.setHeight(900);
        
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
        console.log(`[Instance ${instanceId}] Canvas successfully initialized, editable: ${editable}`);
        setInitialized(true);
        
        // 初期化後に強制的に再描画
        setTimeout(() => {
          if (canvas && !canvas.disposed && mountedRef.current) {
            canvas.renderAll();
            console.log(`[Instance ${instanceId}] Forced canvas render after initialization`);
          }
        }, 50);
      } catch (error) {
        console.error(`[Instance ${instanceId}] Error initializing canvas:`, error);
      }
    }, 50); // 少し長めの遅延を入れて確実にDOMが準備されるようにする

    // クリーンアップ関数
    return () => {
      mountedRef.current = false;
      clearTimeout(initTimer);
      disposeCanvas();
      console.log(`[Instance ${instanceId}] Canvas initialization effect cleanup`);
    };
  }, [canvasRef, editable, onSelectElement, canvasConfig, instanceId]);

  return {
    canvas: canvasInstance.current,
    initialized,
    containerRef
  };
};
