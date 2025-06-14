
import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useOptimizedSlideCanvas } from "@/hooks/slideviewer/useOptimizedSlideCanvas";
import { useCanvasActions } from "@/hooks/slideviewer/canvas/useCanvasActions";
import { renderElementsWithEmptyState } from "@/utils/slideCanvas/enhancedElementRenderer";
import TouchOptimizedCanvas from "@/features/slideviewer/components/canvas/TouchOptimizedCanvas";
import EmptyCanvasState from "@/features/slideviewer/components/canvas/states/EmptyCanvasState";
import CanvasLoadingState from "@/features/slideviewer/components/canvas/states/CanvasLoadingState";
import CanvasErrorState from "@/features/slideviewer/components/canvas/states/CanvasErrorState";
import CanvasGuideOverlay from "@/features/slideviewer/components/canvas/states/CanvasGuideOverlay";

interface OptimizedSlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
  containerWidth?: number;
  containerHeight?: number;
  enablePerformanceMode?: boolean;
}

// 標準スライドサイズ定義（16:9アスペクト比）
const STANDARD_SLIDE_SIZES = {
  large: { width: 1600, height: 900 },    // フルHD基準
  medium: { width: 1280, height: 720 },   // HD基準
  small: { width: 960, height: 540 }      // モバイル対応
} as const;

const OptimizedSlideCanvas = React.memo(({ 
  currentSlide, 
  zoomLevel = 100, 
  editable = false,
  userType = "enterprise",
  containerWidth = 0,
  containerHeight = 0,
  enablePerformanceMode = true
}: OptimizedSlideCanvasProps) => {
  console.log(`OptimizedSlideCanvas rendering - Slide: ${currentSlide}, Zoom: ${zoomLevel}%, Performance Mode: ${enablePerformanceMode}`);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // デバイス判定とスライドサイズ決定（固定サイズ）
  const { slideSize, deviceInfo } = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    // 固定サイズの選択（コンテナサイズに依存しない）
    let selectedSize;
    if (isMobile) {
      selectedSize = STANDARD_SLIDE_SIZES.small;
    } else if (isTablet) {
      selectedSize = STANDARD_SLIDE_SIZES.medium;
    } else {
      selectedSize = STANDARD_SLIDE_SIZES.large;
    }

    return {
      slideSize: selectedSize,
      deviceInfo: {
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        devicePixelRatio: window.devicePixelRatio || 1,
        touchSupported: 'ontouchstart' in window
      }
    };
  }, []); // 依存配列を空にして固定サイズを保証

  // 固定サイズでキャンバス設定
  const canvasConfig = useMemo(() => ({
    currentSlide,
    editable,
    containerWidth: slideSize.width,
    containerHeight: slideSize.height,
    enablePerformanceMode
  }), [currentSlide, editable, slideSize.width, slideSize.height, enablePerformanceMode]);

  const {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error,
    elements,
    slides,
    performance
  } = useOptimizedSlideCanvas(canvasConfig);

  const { addText, addShape, addImage } = useCanvasActions({
    currentSlide,
    canvas: fabricCanvasRef.current
  });

  // 要素レンダリング関数
  const handleOptimizedRenderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    try {
      const result = renderElementsWithEmptyState(
        canvas, 
        elements, 
        slideSize, // 固定サイズを使用
        editable, 
        currentSlide,
        addText,
        addShape,
        addImage
      );
      setIsEmpty(result.isEmpty);
    } catch (err) {
      console.error('Optimized rendering failed:', err);
    }
  }, [elements, currentSlide, editable, isReady, slideSize, addText, addShape, addImage]);
  
  useEffect(() => {
    if (isReady) {
      handleOptimizedRenderElements();
    }
  }, [handleOptimizedRenderElements, isReady]);

  // ガイド表示
  useEffect(() => {
    if (isReady && editable && isEmpty && enablePerformanceMode) {
      const hasSeenGuide = localStorage.getItem('standard-slide-guide-seen');
      if (!hasSeenGuide) {
        setShowGuide(true);
        localStorage.setItem('standard-slide-guide-seen', 'true');
      }
    }
  }, [isReady, editable, isEmpty, enablePerformanceMode]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleReset = useCallback(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#ffffff';
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  // モバイルデバイスは専用コンポーネント
  if (deviceInfo.isMobile) {
    return (
      <TouchOptimizedCanvas
        currentSlide={currentSlide}
        zoomLevel={zoomLevel}
        editable={editable}
        userType={userType}
        containerWidth={slideSize.width}
        containerHeight={slideSize.height}
      />
    );
  }
  
  // スライドデータチェック
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
      className="w-full h-full flex items-center justify-center bg-gray-50 overflow-auto relative"
    >
      {/* ガイドオーバーレイ */}
      {showGuide && (
        <CanvasGuideOverlay
          deviceType={deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop'}
          onClose={() => setShowGuide(false)}
        />
      )}

      <div className="relative">
        {/* 固定サイズのスライドコンテナ */}
        <div 
          className="bg-white rounded-lg shadow-lg border relative"
          style={{
            width: slideSize.width,
            height: slideSize.height,
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          {/* Fabric.js キャンバス */}
          <canvas 
            ref={canvasRef}
            className="block rounded-lg"
            style={{
              width: '100%',
              height: '100%',
            }}
          />

          {/* 空のスライド状態 */}
          {isEmpty && isReady && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
              <EmptyCanvasState
                onAddText={addText}
                onAddShape={addShape}
                onAddImage={addImage}
                slideNumber={currentSlide}
                editable={editable}
              />
            </div>
          )}
          
          {/* ローディング状態 */}
          {!isReady && !error && (
            <CanvasLoadingState 
              progress={performance.metrics?.fps || 0}
              message="標準スライドを初期化中..."
            />
          )}
          
          {/* エラー状態 */}
          {error && (
            <CanvasErrorState
              error={error}
              onRetry={handleRetry}
              onReset={handleReset}
            />
          )}
        </div>

        {/* パフォーマンス情報 */}
        {enablePerformanceMode && performance.metrics && (
          <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded">
            FPS: {performance.metrics.fps} | Render: {performance.metrics.renderTime}ms
            {!performance.isPerformanceGood && (
              <span className="text-yellow-300 ml-2">⚡ 高速モード</span>
            )}
          </div>
        )}

        {/* 高解像度表示情報 */}
        {deviceInfo.devicePixelRatio > 2 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
            高解像度最適化済み
          </div>
        )}

        {/* スライドサイズ情報 */}
        <div className="absolute top-2 right-2 text-xs bg-blue-500 text-white px-2 py-1 rounded opacity-75">
          {slideSize.width}×{slideSize.height} (16:9)
        </div>
      </div>
    </div>
  );
});

OptimizedSlideCanvas.displayName = 'OptimizedSlideCanvas';

export default OptimizedSlideCanvas;
