
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, IText, Rect, Circle, Image } from 'fabric';
import { useSlideStore } from "@/stores/slide-store";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1600, height: 900 });
  
  const slides = useSlideStore(state => state.slides);
  const updateSlideElement = useSlideStore(state => state.updateSlideElement);
  
  console.log(`SlideCanvas rendering - Slide: ${currentSlide}, Zoom: ${zoomLevel}%, Editable: ${editable}`);
  
  // 現在のスライドデータを取得
  const currentSlideData = slides.find(slide => slide.id === currentSlide);
  const elements = currentSlideData?.elements || [];
  
  // レスポンシブキャンバスサイズ計算
  const calculateCanvasSize = useCallback(() => {
    if (!containerRef.current) return { width: 1600, height: 900 };
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // アスペクト比16:9を維持
    const aspectRatio = 16 / 9;
    let canvasWidth = containerWidth * 0.9; // コンテナの90%を使用
    let canvasHeight = canvasWidth / aspectRatio;
    
    // 高さがコンテナを超える場合は高さベースで計算
    if (canvasHeight > containerHeight * 0.9) {
      canvasHeight = containerHeight * 0.9;
      canvasWidth = canvasHeight * aspectRatio;
    }
    
    // 最小サイズと最大サイズを設定
    canvasWidth = Math.max(800, Math.min(1600, canvasWidth));
    canvasHeight = Math.max(450, Math.min(900, canvasHeight));
    
    return { width: canvasWidth, height: canvasHeight };
  }, []);
  
  // ResizeObserverでコンテナサイズ変更を監視
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      const newSize = calculateCanvasSize();
      setCanvasSize(newSize);
    });
    
    resizeObserver.observe(containerRef.current);
    
    // 初期サイズ設定
    const initialSize = calculateCanvasSize();
    setCanvasSize(initialSize);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateCanvasSize]);
  
  // キャンバス初期化
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // 既存のキャンバスを破棄
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
      
      // 新しいキャンバスを作成
      const canvas = new Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: '#ffffff',
        selection: editable,
        preserveObjectStacking: true,
        selectionBorderColor: '#2563eb',
        selectionLineWidth: 2,
      });
      
      fabricCanvasRef.current = canvas;
      setIsReady(true);
      setError(null);
      
      console.log('Canvas initialized successfully with size:', canvasSize);
      
      // オブジェクト選択イベント（編集モードのみ）
      if (editable) {
        canvas.on('selection:created', (e) => {
          console.log('Object selected:', e.selected?.[0]);
        });
        
        canvas.on('object:modified', (e) => {
          const obj = e.target as any;
          if (obj?.customData?.id) {
            const updates = {
              position: { x: obj.left || 0, y: obj.top || 0 },
              size: { 
                width: (obj.width || 0) * (obj.scaleX || 1),
                height: (obj.height || 0) * (obj.scaleY || 1)
              },
              angle: obj.angle || 0
            };
            updateSlideElement(currentSlide, obj.customData.id, updates);
          }
        });
      }
      
    } catch (err) {
      console.error('Canvas initialization failed:', err);
      setError('キャンバスの初期化に失敗しました');
      setIsReady(false);
    }
    
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [editable, currentSlide, canvasSize]);
  
  // キャンバスサイズ変更時の処理
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    canvas.setDimensions({
      width: canvasSize.width,
      height: canvasSize.height
    });
    canvas.renderAll();
    
    console.log('Canvas resized to:', canvasSize);
  }, [canvasSize, isReady]);
  
  // 要素をキャンバスにレンダリング
  const renderElements = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    try {
      // キャンバスをクリア
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      
      if (elements.length === 0) {
        // プレースホルダー表示
        const placeholder = new IText(`スライド ${currentSlide}`, {
          left: canvasSize.width / 2,
          top: canvasSize.height / 2,
          fontSize: Math.min(36, canvasSize.width / 25),
          fill: '#64748b',
          fontFamily: 'Arial',
          originX: 'center',
          originY: 'center',
          selectable: false,
          editable: false,
        });
        canvas.add(placeholder);
        canvas.renderAll();
        return;
      }
      
      // 要素をzIndexでソート
      const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      
      // 各要素をキャンバスに追加
      sortedElements.forEach(element => {
        const { type, position, size, props, id, angle } = element;
        
        // スケール調整（キャンバスサイズに応じて）
        const scaleX = canvasSize.width / 1600;
        const scaleY = canvasSize.height / 900;
        
        switch (type) {
          case 'text':
            const text = new IText(props.text || 'New Text', {
              left: position.x * scaleX,
              top: position.y * scaleY,
              fontSize: (props.fontSize || 24) * Math.min(scaleX, scaleY),
              fill: props.color || '#000000',
              fontFamily: props.fontFamily || 'Arial',
              originX: 'center',
              originY: 'center',
              selectable: editable,
              editable: editable,
              angle: angle || 0,
            });
            (text as any).customData = { id };
            canvas.add(text);
            break;
            
          case 'shape':
            if (props.shape === 'rect') {
              const rect = new Rect({
                left: position.x * scaleX,
                top: position.y * scaleY,
                width: size.width * scaleX,
                height: size.height * scaleY,
                fill: props.fill || '#000000',
                stroke: props.stroke || '',
                strokeWidth: (props.strokeWidth || 0) * Math.min(scaleX, scaleY),
                originX: 'center',
                originY: 'center',
                selectable: editable,
                angle: angle || 0,
              });
              (rect as any).customData = { id };
              canvas.add(rect);
            } else if (props.shape === 'circle') {
              const circle = new Circle({
                left: position.x * scaleX,
                top: position.y * scaleY,
                radius: (size.width / 2) * Math.min(scaleX, scaleY),
                fill: props.fill || '#000000',
                stroke: props.stroke || '',
                strokeWidth: (props.strokeWidth || 0) * Math.min(scaleX, scaleY),
                originX: 'center',
                originY: 'center',
                selectable: editable,
                angle: angle || 0,
              });
              (circle as any).customData = { id };
              canvas.add(circle);
            }
            break;
            
          case 'image':
            Image.fromURL(props.src, {
              crossOrigin: 'anonymous',
            }).then((img) => {
              img.set({
                left: position.x * scaleX,
                top: position.y * scaleY,
                scaleX: (size.width / (img.width || 1)) * scaleX,
                scaleY: (size.height / (img.height || 1)) * scaleY,
                originX: 'center',
                originY: 'center',
                selectable: editable,
                angle: angle || 0,
              });
              (img as any).customData = { id };
              canvas.add(img);
              canvas.renderAll();
            }).catch(err => {
              console.error('Image loading failed:', err);
            });
            break;
        }
      });
      
      // レンダリング実行
      canvas.renderAll();
      console.log(`Rendered ${elements.length} elements for slide ${currentSlide}`);
      
    } catch (err) {
      console.error('Element rendering failed:', err);
      setError('要素の描画に失敗しました');
    }
  }, [elements, currentSlide, editable, isReady, canvasSize]);
  
  // スライドまたは要素が変更された時にレンダリング
  useEffect(() => {
    if (isReady) {
      renderElements();
    }
  }, [renderElements, isReady]);
  
  // ズーム適用（CSSトランスフォーム）
  const zoomStyle = {
    transform: `scale(${zoomLevel / 100})`,
    transformOrigin: 'center center',
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
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-gray-50 overflow-hidden"
    >
      <div className="relative" style={zoomStyle}>
        <div className="bg-white rounded-lg shadow-lg border">
          <canvas 
            ref={canvasRef}
            className="block rounded-lg"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
          
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
