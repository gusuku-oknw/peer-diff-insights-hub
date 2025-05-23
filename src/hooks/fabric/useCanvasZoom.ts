
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
      
      // 座標の一貫性を保つために内部キャンバスサイズを一定に保つ
      const originalWidth = 1600;
      const originalHeight = 900;
      
      // 視覚的なスケーリングのためにキャンバスラッパーにCSS変換を適用
      if (canvas.wrapperEl) {
        canvas.wrapperEl.style.transform = `scale(${scaleFactor})`;
        canvas.wrapperEl.style.transformOrigin = 'top left';
        canvas.wrapperEl.style.width = `${originalWidth}px`;
        canvas.wrapperEl.style.height = `${originalHeight}px`;
        
        // スケーリングされたキャンバスに合わせてコンテナサイズを更新
        containerRef.current.style.width = `${originalWidth * scaleFactor}px`;
        containerRef.current.style.height = `${originalHeight * scaleFactor}px`;
      }
      
      canvas.renderAll();
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, [zoomLevel, initialized, canvas, containerRef]);
};
