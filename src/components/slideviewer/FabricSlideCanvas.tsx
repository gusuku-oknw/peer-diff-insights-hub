
import { useRef, useCallback, memo } from "react";
import { useSlideStore } from "@/stores/slideStore";
import useFabricCanvas from "@/hooks/useFabricCanvas";
import { CustomFabricObject } from '@/utils/types/canvas.types';

interface FabricSlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
}

const FabricSlideCanvas = ({ 
  currentSlide, 
  zoomLevel = 100, 
  editable = false,
  userType = "enterprise" 
}: FabricSlideCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const slides = useSlideStore(state => state.slides);
  const updateElement = useSlideStore(state => state.updateElement);
  
  // 現在のスライドの要素を取得
  const currentSlideData = slides.find(slide => slide.id === currentSlide);
  const elements = currentSlideData?.elements || [];

  // 要素更新ハンドラ - 最適化のためにuseCallbackで包む
  const handleUpdateElement = useCallback((elementId: string, updates: any) => {
    updateElement(currentSlide, elementId, updates);
  }, [updateElement, currentSlide]);
  
  // キャンバスフックを使用
  const { canvasReady, loadingError } = useFabricCanvas({
    canvasRef,
    currentSlide,
    zoomLevel,
    editable,
    elements,
    onUpdateElement: handleUpdateElement,
    onSelectElement: useCallback((element: CustomFabricObject | null) => {
      // 必要に応じて選択ハンドラを実装
    }, [])
  });
  
  // シンプルな構造でレンダリング
  return (
    <div className="canvas-container flex items-center justify-center w-full h-full overflow-hidden">
      <div 
        ref={canvasContainerRef} 
        className="relative" 
        style={{
          // スタイルは最小限に保ち、useCanvasZoom内で操作
          position: 'relative',
          // GPUアクセラレーションを活用
          backfaceVisibility: 'hidden',
          // スムーズな表示のためにレイヤー作成を促す
          perspective: 1000,
        }}
      >
        <canvas ref={canvasRef} className="fabric-canvas" />
        
        {/* ローディングインジケータ */}
        {!canvasReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-blue-600 font-medium">キャンバスを読み込み中...</p>
            </div>
          </div>
        )}
        
        {/* エラー表示 */}
        {loadingError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-75 z-10">
            <div className="flex flex-col items-center">
              <p className="mt-4 text-red-600 font-medium">{loadingError}</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => window.location.reload()}
              >
                再読み込み
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// メモ化してコンポーネントの不必要な再レンダリングを防止
export default memo(FabricSlideCanvas);
