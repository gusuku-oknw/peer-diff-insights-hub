
import { useEffect, useRef, useCallback } from 'react';
import { Canvas } from 'fabric';

interface UseCanvasZoomProps {
  canvas: Canvas | null;
  initialized: boolean;
  containerRef: React.MutableRefObject<HTMLElement | null>;
  zoomLevel: number;
}

export const useCanvasZoom = ({ 
  canvas, 
  initialized, 
  containerRef, 
  zoomLevel 
}: UseCanvasZoomProps) => {
  const prevZoomRef = useRef<number>(100);
  
  const applyZoom = useCallback((canvas: Canvas, scaleFactor: number) => {
    if (!canvas || canvas.disposed) return;

    try {
      const baseWidth = 1600;
      const baseHeight = 900;
      
      // キャンバスの実際のサイズを設定
      canvas.setWidth(baseWidth);
      canvas.setHeight(baseHeight);
      
      // CSS でのスケーリングはコンテナで処理されるため、ここでは何もしない
      // Fabric.js キャンバス自体は常に 1600x900 を維持
      
      console.log(`Canvas zoom applied: ${scaleFactor * 100}%`);
      
      // レンダリングを一度だけ実行
      canvas.renderAll();
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, []);
  
  useEffect(() => {
    if (!canvas || !initialized) return;
    
    const validZoomLevel = Math.max(25, Math.min(200, zoomLevel || 100));
    
    // 同じズームレベルの場合はスキップ
    if (prevZoomRef.current === validZoomLevel) return;
    
    console.log(`Applying zoom: ${validZoomLevel}% (previous: ${prevZoomRef.current}%)`);
    
    const scaleFactor = validZoomLevel / 100;
    prevZoomRef.current = validZoomLevel;
    
    applyZoom(canvas, scaleFactor);
  }, [zoomLevel, initialized, canvas, applyZoom]);
  
  // 初期化時のズーム適用
  useEffect(() => {
    if (!canvas || !initialized) return;
    
    const initialZoom = zoomLevel || 100;
    if (prevZoomRef.current === 100 && initialZoom === 100) {
      applyZoom(canvas, 1);
    }
  }, [canvas, initialized, zoomLevel, applyZoom]);
};
