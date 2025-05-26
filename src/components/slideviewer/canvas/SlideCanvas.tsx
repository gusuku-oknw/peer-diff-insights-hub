
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
  console.log(`Rendering SlideCanvas - Slide: ${currentSlide}, Zoom: ${zoomLevel}%, Editable: ${editable}`);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slides = useSlideStore(state => state.slides);
  const updateElement = useSlideStore(state => state.updateElement);
  const [instanceId] = useState(() => Math.random().toString(36).substring(2, 9));
  
  useEffect(() => {
    console.log(`SlideCanvas instance ${instanceId} mounted - Editable: ${editable}`);
    return () => {
      console.log(`SlideCanvas instance ${instanceId} will unmount - Editable: ${editable}`);
    };
  }, [instanceId, editable]);
  
  // 現在のスライドの要素を取得
  const currentSlideData = useMemo(() => {
    if (!slides || slides.length === 0) {
      console.warn(`No slides available in store`);
      return null;
    }
    
    const slide = slides.find(slide => slide.id === currentSlide);
    if (!slide) {
      console.warn(`Slide with ID ${currentSlide} not found`);
      return null;
    }
    
    console.log(`Found slide data for ID ${currentSlide}:`, { 
      id: slide.id, 
      elementsCount: slide.elements?.length || 0
    });
    return slide;
  }, [slides, currentSlide]);
  
  const elements = useMemo(() => {
    if (!currentSlideData) return [];
    return currentSlideData.elements || [];
  }, [currentSlideData]);

  // 要素更新ハンドラ
  const handleUpdateElement = useCallback((elementId: string, updates: any) => {
    console.log(`Updating element ${elementId} on slide ${currentSlide}:`, updates);
    updateElement(currentSlide, elementId, updates);
  }, [updateElement, currentSlide]);
  
  // 要素選択ハンドラ
  const handleSelectElement = useCallback((element: CustomFabricObject | null) => {
    if (element) {
      console.log("Selected element:", element.customData?.id);
    } else {
      console.log("Deselected element");
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
  
  // スライドデータが存在しない場合の表示
  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow border">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-4">スライドが読み込まれていません</p>
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 p-4">
      <div 
        className="relative bg-white rounded-lg shadow border"
        style={{
          width: `${1600 * (zoomLevel / 100)}px`,
          height: `${900 * (zoomLevel / 100)}px`,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        data-testid="canvas-container"
        data-zoom={zoomLevel}
        data-slide={currentSlide}
      >
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full rounded-lg"
          style={{
            width: '100%',
            height: '100%',
          }}
          data-testid="fabric-canvas"
          data-editable={editable ? "true" : "false"}
          data-slide={currentSlide}
        />
        
        {!canvasReady && <CanvasLoadingIndicator />}
        {loadingError && <CanvasErrorDisplay error={loadingError} />}
      </div>
    </div>
  );
};

// ローディングインジケーター
const CanvasLoadingIndicator = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10 rounded-lg">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-2 text-blue-600 text-sm">読み込み中...</p>
    </div>
  </div>
);

// エラー表示
const CanvasErrorDisplay = ({ error }: { error: string }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-95 z-10 rounded-lg">
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow border-red-200">
      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-2">
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
      <button 
        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
        onClick={() => window.location.reload()}
      >
        再読み込み
      </button>
    </div>
  </div>
);

export default React.memo(SlideCanvas, (prevProps, nextProps) => {
  return (
    prevProps.currentSlide === nextProps.currentSlide &&
    prevProps.zoomLevel === nextProps.zoomLevel &&
    prevProps.editable === nextProps.editable &&
    prevProps.userType === nextProps.userType
  );
});
