
import React, { useRef, useCallback, useMemo, useState, useEffect } from "react";
import { useSlideStore } from "@/stores/slideStore";
import { useCanvas } from "@/hooks/fabric/useCanvas";
import { CustomFabricObject } from '@/utils/types/canvas.types';

interface SlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
}

const SlideCanvas = ({ 
  currentSlide, 
  zoomLevel = 100, 
  editable = false,
  userType = "enterprise" 
}: SlideCanvasProps) => {
  console.log(`Rendering SlideCanvas - Slide: ${currentSlide}, Zoom: ${zoomLevel}%, Editable: ${editable}, Type: ${userType}`);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const slides = useSlideStore(state => state.slides);
  const updateElement = useSlideStore(state => state.updateElement);
  const [instanceId] = useState(() => Math.random().toString(36).substring(2, 9));
  
  useEffect(() => {
    console.log(`SlideCanvas instance ${instanceId} mounted - Editable: ${editable}`);
    console.log(`Total slides available:`, slides.length);
    console.log(`Looking for slide with ID:`, currentSlide);
    return () => {
      console.log(`SlideCanvas instance ${instanceId} will unmount - Editable: ${editable}`);
    };
  }, [instanceId, editable, slides.length, currentSlide]);
  
  // 現在のスライドの要素を取得 - より詳細なデバッグ情報を追加
  const currentSlideData = useMemo(() => {
    console.log(`Available slides:`, slides.map(s => ({ id: s.id, elementsCount: s.elements?.length || 0 })));
    const slide = slides.find(slide => slide.id === currentSlide);
    console.log(`Found slide data for ID ${currentSlide}:`, slide ? { 
      id: slide.id, 
      elementsCount: slide.elements?.length || 0,
      elements: slide.elements?.map(e => ({ id: e.id, type: e.type })) || []
    } : 'No slide found');
    return slide;
  }, [slides, currentSlide]);
  
  const elements = useMemo(() => {
    const slideElements = currentSlideData?.elements || [];
    console.log(`Elements for slide ${currentSlide}:`, slideElements.length, slideElements);
    return slideElements;
  }, [currentSlideData, currentSlide]);

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
  
  // useCanvas フックを使用したキャンバス管理
  const { canvasReady, loadingError } = useCanvas({
    canvasRef,
    currentSlide,
    zoomLevel,
    editable,
    elements,
    onUpdateElement: handleUpdateElement,
    onSelectElement: handleSelectElement,
    instanceId
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
        data-mode={editable ? "edit" : "view"}
        data-instance={instanceId}
      >
        <canvas 
          ref={canvasRef} 
          className="fabric-canvas"
          data-testid="fabric-canvas"
          data-editable={editable ? "true" : "false"}
          data-slide={currentSlide}
          data-instance={instanceId}
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

export default React.memo(SlideCanvas, (prevProps, nextProps) => {
  const slideUnchanged = prevProps.currentSlide === nextProps.currentSlide;
  const zoomUnchanged = prevProps.zoomLevel === nextProps.zoomLevel;
  const editableUnchanged = prevProps.editable === nextProps.editable;
  const userTypeUnchanged = prevProps.userType === nextProps.userType;
  
  const allUnchanged = slideUnchanged && zoomUnchanged && editableUnchanged && userTypeUnchanged;
  
  if (!allUnchanged) {
    console.log('SlideCanvas props changed, re-rendering', {
      slideChanged: !slideUnchanged,
      zoomChanged: !zoomUnchanged,
      editableChanged: !editableUnchanged,
      userTypeChanged: !userTypeUnchanged
    });
  }
  
  return allUnchanged;
});
