
import React, { useRef, useEffect, useCallback } from "react";
import { useSlideCanvas } from "@/hooks/slideviewer/useSlideCanvas";
import { useResponsiveCanvas } from "@/hooks/slideviewer/useResponsiveCanvas";
import { renderElements } from "@/utils/slideCanvas/elementRenderer";

interface SlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
  containerWidth?: number;
  containerHeight?: number;
}

const SlideCanvas = ({ 
  currentSlide, 
  zoomLevel = 100, 
  editable = false,
  userType = "enterprise",
  containerWidth = 0,
  containerHeight = 0
}: SlideCanvasProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  console.log(`SlideCanvas rendering - Slide: ${currentSlide}, Container: ${containerWidth}x${containerHeight}, Zoom: ${zoomLevel}%`);
  
  // レスポンシブキャンバスサイズの計算
  const {
    canvasSize,
    actualDisplaySize,
    getScaleFactors,
    isResponsive
  } = useResponsiveCanvas({
    containerWidth,
    containerHeight,
    zoom: zoomLevel
  });
  
  const {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error,
    elements,
    slides
  } = useSlideCanvas({
    currentSlide,
    editable,
    containerWidth: canvasSize.width,
    containerHeight: canvasSize.height
  });
  
  // 要素をキャンバスにレンダリング（改善版）
  const handleRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    try {
      renderElements(canvas, elements, canvasSize, editable, currentSlide);
    } catch (err) {
      console.error('Rendering failed:', err);
    }
  }, [elements, currentSlide, editable, isReady, canvasSize]);
  
  useEffect(() => {
    if (isReady) {
      handleRenderElements();
    }
  }, [handleRenderElements, isReady]);
  
  // ズームとレスポンシブサイズを組み合わせたスタイル
  const containerStyle = {
    width: actualDisplaySize.width || 'auto',
    height: actualDisplaySize.height || 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
  };
  
  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow border">
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
    <div 
      ref={canvasContainerRef}
      className="w-full h-full flex items-center justify-center bg-gray-50 overflow-hidden"
    >
      <div 
        className="relative transition-all duration-300 ease-in-out"
        style={containerStyle}
      >
        <div className="bg-white rounded-lg shadow-lg border relative">
          <canvas 
            ref={canvasRef}
            className="block rounded-lg transition-all duration-300 ease-in-out"
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
          
          {/* ズームレベル表示 */}
          {zoomLevel !== 100 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {zoomLevel}%
            </div>
          )}
          
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-2 text-blue-600 text-sm">読み込み中...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-95 rounded-lg">
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow border-red-200">
                <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
                <button 
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
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
  );
};

export default React.memo(SlideCanvas);
