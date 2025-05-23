
import React, { useRef, useCallback, useMemo, memo, useEffect, useState } from "react";
import { useSlideStore } from "@/stores/slideStore";
import { useCanvas } from "@/hooks/fabric/useCanvas";
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
  const [renderKey, setRenderKey] = useState(0);
  
  // 現在のスライドの要素を取得
  const currentSlideData = useMemo(() => {
    return slides.find(slide => slide.id === currentSlide);
  }, [slides, currentSlide]);
  
  const elements = useMemo(() => {
    return currentSlideData?.elements || [];
  }, [currentSlideData]);

  // モードが変更された場合は強制的に再レンダリング
  useEffect(() => {
    setRenderKey(prevKey => prevKey + 1);
    console.log(`FabricSlideCanvas mode changed, forcing re-render. Editable: ${editable}`);
  }, [editable]);

  // 要素更新ハンドラ
  const handleUpdateElement = useCallback((elementId: string, updates: any) => {
    updateElement(currentSlide, elementId, updates);
  }, [updateElement, currentSlide]);
  
  // 要素選択ハンドラ
  const handleSelectElement = useCallback((element: CustomFabricObject | null) => {
    if (element) {
      console.log("Selected element:", element.customData?.id);
    }
  }, []);
  
  // useCanvas フックを使用したキャンバス管理 (renderKeyを依存関係に追加)
  const { canvasReady, loadingError } = useCanvas({
    canvasRef,
    currentSlide,
    zoomLevel,
    editable,
    elements,
    onUpdateElement: handleUpdateElement,
    onSelectElement: handleSelectElement
  });
  
  // キャンバスコンテナのスタイル
  const containerStyle = useMemo(() => ({
    position: 'relative' as const,
    transformStyle: 'preserve-3d' as const,
    backfaceVisibility: 'hidden' as const,
    perspective: '1000px' as const,
    imageRendering: 'auto' as const
  }), []);
  
  return (
    <div className="canvas-container flex items-center justify-center w-full h-full overflow-hidden">
      <div 
        ref={canvasContainerRef} 
        className="will-change-transform"
        style={containerStyle}
        key={`container-${renderKey}`}
      >
        <canvas 
          ref={canvasRef} 
          className="fabric-canvas" 
          data-testid="fabric-canvas"
          data-editable={editable ? "true" : "false"}
          data-slide={currentSlide}
          key={`canvas-${renderKey}`}
        />
        
        {!canvasReady && <CanvasLoadingIndicator />}
        {loadingError && <CanvasErrorDisplay error={loadingError} />}
      </div>
    </div>
  );
};

// キャンバスローディングインジケーター
const CanvasLoadingIndicator = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-blue-600 font-medium">キャンバスを読み込み中...</p>
    </div>
  </div>
);

// キャンバスエラー表示
const CanvasErrorDisplay = ({ error }: { error: string }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-75 z-10">
    <div className="flex flex-col items-center">
      <p className="mt-4 text-red-600 font-medium">{error}</p>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => window.location.reload()}
      >
        再読み込み
      </button>
    </div>
  </div>
);

// メモ化条件を修正
export default memo(FabricSlideCanvas, (prevProps, nextProps) => {
  // 一貫性のために変数に格納
  const slideUnchanged = prevProps.currentSlide === nextProps.currentSlide;
  const zoomUnchanged = prevProps.zoomLevel === nextProps.zoomLevel;
  const editableUnchanged = prevProps.editable === nextProps.editable;
  const userTypeUnchanged = prevProps.userType === nextProps.userType;
  
  // すべてのプロパティが変更されていない場合のみtrueを返す
  const allUnchanged = slideUnchanged && zoomUnchanged && editableUnchanged && userTypeUnchanged;
  
  // 変更があった場合は再レンダリング
  if (!allUnchanged) {
    console.log('FabricSlideCanvas props changed, re-rendering', {
      slideChanged: !slideUnchanged,
      zoomChanged: !zoomUnchanged,
      editableChanged: !editableUnchanged,
      userTypeChanged: !userTypeUnchanged
    });
  }
  
  return allUnchanged;
});
