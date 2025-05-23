
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
      
      // 一貫したサイズを維持
      const originalWidth = 1600;
      const originalHeight = 900;
      
      // キャンバスサイズは固定
      canvas.setWidth(originalWidth);
      canvas.setHeight(originalHeight);
      
      // キャンバス要素のトランスフォームとサイズを直接設定
      if (canvas.wrapperEl) {
        canvas.wrapperEl.style.transform = '';
        canvas.wrapperEl.style.width = `${originalWidth}px`;
        canvas.wrapperEl.style.height = `${originalHeight}px`;
      }
      
      // コンテナサイズは固定し、スケールのみ適用
      if (containerRef.current) {
        containerRef.current.style.width = `${originalWidth}px`;
        containerRef.current.style.height = `${originalHeight}px`;
        containerRef.current.style.transformOrigin = 'center center';
        containerRef.current.style.willChange = 'transform';
        
        // 直接transformを適用して要素の再計算を減らす
        containerRef.current.style.transform = `scale(${scaleFactor})`;
        
        // 親要素に設定を追加してより安定したレンダリングにする
        const parentElement = containerRef.current.parentElement;
        if (parentElement) {
          parentElement.style.display = 'flex';
          parentElement.style.justifyContent = 'center';
          parentElement.style.alignItems = 'center';
          parentElement.style.overflow = 'hidden';
          parentElement.style.height = '100%';
        }
      }
      
      // レンダリングを一度だけ呼び出し
      canvas.renderAll();
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, [zoomLevel, initialized, canvas, containerRef]);
};
