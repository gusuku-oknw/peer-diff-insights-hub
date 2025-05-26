
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
  const slides = useSlideStore(state => state.slides);
  const updateElement = useSlideStore(state => state.updateElement);
  const [instanceId] = useState(() => Math.random().toString(36).substring(2, 9));
  
  useEffect(() => {
    console.log(`SlideCanvas instance ${instanceId} mounted - Editable: ${editable}`);
    console.log(`Total slides available:`, slides.length);
    console.log(`Looking for slide with ID:`, currentSlide);
    console.log(`Available slide IDs:`, slides.map(s => s.id));
    return () => {
      console.log(`SlideCanvas instance ${instanceId} will unmount - Editable: ${editable}`);
    };
  }, [instanceId, editable, slides.length, currentSlide]);
  
  // 現在のスライドの要素を取得 - スライドの存在チェックを強化
  const currentSlideData = useMemo(() => {
    if (!slides || slides.length === 0) {
      console.warn(`No slides available in store`);
      return null;
    }
    
    const slide = slides.find(slide => slide.id === currentSlide);
    if (!slide) {
      console.warn(`Slide with ID ${currentSlide} not found. Available IDs: ${slides.map(s => s.id).join(', ')}`);
      return null;
    }
    
    console.log(`Found slide data for ID ${currentSlide}:`, { 
      id: slide.id, 
      elementsCount: slide.elements?.length || 0,
      elements: slide.elements?.map(e => ({ id: e.id, type: e.type })) || []
    });
    return slide;
  }, [slides, currentSlide]);
  
  const elements = useMemo(() => {
    if (!currentSlideData) {
      console.log(`No slide data available for slide ${currentSlide}, returning empty elements array`);
      return [];
    }
    
    const slideElements = currentSlideData.elements || [];
    console.log(`Elements for slide ${currentSlide}:`, slideElements.length, slideElements);
    return slideElements;
  }, [currentSlideData, currentSlide]);

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
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-4">スライドが読み込まれていません</p>
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="slide-canvas-container w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div 
        className="canvas-wrapper bg-white rounded-xl shadow-lg border border-gray-200"
        data-mode={editable ? "edit" : "view"}
        data-instance={instanceId}
        data-slide={currentSlide}
      >
        <canvas 
          ref={canvasRef} 
          className="fabric-canvas block rounded-xl"
          data-testid="fabric-canvas"
          data-editable={editable ? "true" : "false"}
          data-slide={currentSlide}
          data-instance={instanceId}
        />
        
        {!canvasReady && <CanvasLoadingIndicator />}
        {loadingError && <CanvasErrorDisplay error={loadingError} />}
        
        {/* Grid overlay for edit mode */}
        {editable && (
          <div className="absolute inset-0 pointer-events-none opacity-10 rounded-xl overflow-hidden">
            <div className="grid-pattern w-full h-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

// 改良されたローディングインジケーター
const CanvasLoadingIndicator = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10 backdrop-blur-sm rounded-xl">
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-300 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="mt-4 text-blue-600 font-medium">キャンバスを読み込み中...</p>
    </div>
  </div>
);

// 改良されたエラー表示
const CanvasErrorDisplay = ({ error }: { error: string }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-95 z-10 backdrop-blur-sm rounded-xl">
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-red-200">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-red-600 font-medium mb-4 text-center">{error}</p>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
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
