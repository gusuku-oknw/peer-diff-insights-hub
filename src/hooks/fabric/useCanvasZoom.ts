
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
  
  const applyZoom = useCallback((scaleFactor: number) => {
    if (!canvas || canvas.disposed || !containerRef.current) return;

    try {
      // キャンバスサイズは常に固定（1600x900）
      canvas.setWidth(1600);
      canvas.setHeight(900);
      
      // CSS transform でズーム処理（コンテナに適用）
      const container = containerRef.current;
      container.style.transform = `scale(${scaleFactor})`;
      container.style.transformOrigin = 'center center';
      
      console.log(`Canvas zoom applied: ${scaleFactor * 100}% via CSS transform`);
      
      // 軽量な再描画
      canvas.renderAll();
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, [canvas, containerRef]);
  
  useEffect(() => {
    if (!canvas || !initialized) return;
    
    const validZoomLevel = Math.max(25, Math.min(200, zoomLevel || 100));
    
    // 同じズームレベルの場合はスキップ
    if (prevZoomRef.current === validZoomLevel) return;
    
    console.log(`Applying zoom: ${validZoomLevel}% (previous: ${prevZoomRef.current}%)`);
    
    const scaleFactor = validZoomLevel / 100;
    prevZoomRef.current = validZoomLevel;
    
    applyZoom(scaleFactor);
  }, [zoomLevel, initialized, canvas, applyZoom]);
  
  // 初期化時のズーム適用
  useEffect(() => {
    if (!canvas || !initialized) return;
    
    const initialZoom = zoomLevel || 100;
    if (prevZoomRef.current === 100 && initialZoom === 100) {
      applyZoom(1);
    }
  }, [canvas, initialized, zoomLevel, applyZoom]);
};
