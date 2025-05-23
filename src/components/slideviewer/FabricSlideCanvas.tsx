
import React, { useRef, useCallback, useMemo, memo, useEffect } from "react";
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
  console.log(`Rendering FabricSlideCanvas - Slide: ${currentSlide}, Zoom: ${zoomLevel}%, Editable: ${editable}`);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const slides = useSlideStore(state => state.slides);
  const updateElement = useSlideStore(state => state.updateElement);
  const prevEditableRef = useRef(editable);
  const prevSlideRef = useRef(currentSlide);
  
  // 現在のスライドの要素を取得 - useMemoでパフォーマンスを最適化
  const currentSlideData = useMemo(() => {
    return slides.find(slide => slide.id === currentSlide);
  }, [slides, currentSlide]);
  
  const elements = useMemo(() => {
    return currentSlideData?.elements || [];
  }, [currentSlideData]);

  // 要素更新ハンドラ - メモ化して再レンダリングを防止
  const handleUpdateElement = useCallback((elementId: string, updates: any) => {
    updateElement(currentSlide, elementId, updates);
  }, [updateElement, currentSlide]);
  
  // 要素選択ハンドラもメモ化
  const handleSelectElement = useCallback((element: CustomFabricObject | null) => {
    // コンソールに選択情報を記録（必要に応じて）
    if (element) {
      console.log("Selected element:", element.customData?.id);
    }
  }, []);

  // editableの変更を検出して強制的にキャンバスを再レンダリング
  useEffect(() => {
    if (prevEditableRef.current !== editable || prevSlideRef.current !== currentSlide) {
      console.log(`Canvas state changed: editable=${prevEditableRef.current}->${editable}, slide=${prevSlideRef.current}->${currentSlide}`);
      prevEditableRef.current = editable;
      prevSlideRef.current = currentSlide;
    }
  }, [editable, currentSlide]);
  
  // useFabricCanvasフックを使ったキャンバス管理
  const { canvasReady, loadingError } = useFabricCanvas({
    canvasRef,
    currentSlide,
    zoomLevel,
    editable,
    elements,
    onUpdateElement: handleUpdateElement,
    onSelectElement: handleSelectElement
  });
  
  // キャンバスコンテナのスタイル - useMemoで再計算を防止
  const containerStyle = useMemo(() => ({
    position: 'relative' as const,
    transformStyle: 'preserve-3d' as const,
    backfaceVisibility: 'hidden' as const,
    perspective: '1000px' as const,
    // TypeScriptの型エラー修正
    imageRendering: 'auto' as const  // optimizeQualityから修正
  }), []);
  
  // より効率的な構造でレンダリング
  return (
    <div className="canvas-container flex items-center justify-center w-full h-full overflow-hidden">
      <div 
        ref={canvasContainerRef} 
        className="will-change-transform"
        style={containerStyle}
      >
        <canvas 
          ref={canvasRef} 
          className="fabric-canvas" 
          data-testid="fabric-canvas"
          data-editable={editable ? "true" : "false"}
          data-slide={currentSlide}
        />
        
        {/* ローディングとエラー表示 */}
        {!canvasReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-blue-600 font-medium">キャンバスを読み込み中...</p>
            </div>
          </div>
        )}
        
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

// より厳密なメモ化条件
export default memo(FabricSlideCanvas, (prevProps, nextProps) => {
  // editable状態の変更を必ず検知するように修正
  const unchanged = 
    prevProps.currentSlide === nextProps.currentSlide &&
    prevProps.zoomLevel === nextProps.zoomLevel &&
    prevProps.editable === nextProps.editable &&
    prevProps.userType === nextProps.userType;
    
  // 変更があった場合は再レンダリング
  if (!unchanged) {
    console.log('FabricSlideCanvas props changed, re-rendering', {
      prevProps,
      nextProps
    });
  }
  
  return unchanged;
});
