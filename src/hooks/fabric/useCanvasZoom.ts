
import { useEffect } from 'react';
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
  useEffect(() => {
    if (!canvas || !initialized || !containerRef.current) return;
    
    try {
      const scaleFactor = zoomLevel / 100;
      
      // 一貫したサイズを維持する
      const originalWidth = 1600;
      const originalHeight = 900;
      
      // キャンバス自体のCSSトランスフォームは行わず、外部のコンテナでスケーリングするアプローチに統一
      if (containerRef.current) {
        // キャンバスそのものは固定サイズを維持する
        canvas.setWidth(originalWidth);
        canvas.setHeight(originalHeight);
        
        // キャンバスラッパー要素が持つトランスフォームをクリア
        if (canvas.wrapperEl) {
          canvas.wrapperEl.style.transform = '';
          canvas.wrapperEl.style.width = `${originalWidth}px`;
          canvas.wrapperEl.style.height = `${originalHeight}px`;
        }
        
        // 親コンテナでスケーリング
        containerRef.current.style.transform = `scale(${scaleFactor})`;
        containerRef.current.style.transformOrigin = 'center center';
        containerRef.current.style.width = `${originalWidth}px`;
        containerRef.current.style.height = `${originalHeight}px`;
      }
      
      canvas.renderAll();
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, [zoomLevel, initialized, canvas, containerRef]);
};
