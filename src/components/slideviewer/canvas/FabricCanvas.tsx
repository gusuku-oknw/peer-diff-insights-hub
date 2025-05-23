
import { useRef, useState } from 'react';
import { useSlideStore } from '@/stores/slideStore';
import { useCanvas } from '@/hooks/fabric/useCanvas';
import { CustomFabricObject } from '@/utils/types/canvas.types';

interface FabricCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
}

const FabricCanvas = ({
  currentSlide,
  zoomLevel = 100,
  editable = false
}: FabricCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slides = useSlideStore(state => state.slides);
  const updateElement = useSlideStore(state => state.updateElement);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // 現在のスライドの要素を取得
  const currentSlideData = slides.find(slide => slide.id === currentSlide);
  const elements = currentSlideData?.elements || [];
  
  // キャンバスフックを使用
  const { canvasReady, loadingError } = useCanvas({
    canvasRef,
    currentSlide,
    zoomLevel,
    editable,
    elements,
    onUpdateElement: (elementId, updates) => {
      updateElement(currentSlide, elementId, updates);
    },
    onSelectElement: (element: CustomFabricObject | null) => {
      setSelectedElementId(element?.customData?.id || null);
    }
  });

  // コンテナスタイル - CSSスケーリングを使用
  const containerStyle = {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '1200px',
    aspectRatio: '16 / 9',
    display: 'flex',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    overflow: 'hidden' as const,
  };

  // キャンバスラッパースタイル - CSSトランスフォームでズーム
  const canvasWrapperStyle = {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    transformOrigin: 'center center',
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="relative w-full aspect-video bg-gray-100 overflow-hidden flex justify-center items-center p-2"
      >
        <div style={containerStyle} className="drop-shadow-xl">
          <div style={canvasWrapperStyle}>
            <canvas ref={canvasRef} />
            
            {/* ローディングインジケータ */}
            {!canvasReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-blue-500 font-medium">スライドを読み込み中...</p>
                </div>
              </div>
            )}
            
            {/* エラー表示 */}
            {loadingError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-75">
                <div className="flex flex-col items-center text-center p-4">
                  <span className="text-red-500 text-xl mb-2">⚠️</span>
                  <p className="text-red-600 font-medium">{loadingError}</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    再読み込み
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricCanvas;
