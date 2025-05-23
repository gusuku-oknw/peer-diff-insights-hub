import { useEffect, useRef } from 'react';
import { Canvas } from 'fabric';
import { debounce } from 'lodash';

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
  // Keep track of the previous zoom level to avoid unnecessary renders
  const prevZoomRef = useRef<number>(zoomLevel);
  
  // Create a debounced version of the canvas renderAll function
  const debouncedRender = useRef(
    debounce((canvas: Canvas) => {
      canvas.renderAll();
    }, 50)
  ).current;
  
  useEffect(() => {
    if (!canvas || !initialized || !containerRef.current) return;
    
    // Skip the effect if the zoom level hasn't actually changed
    if (prevZoomRef.current === zoomLevel) return;
    
    try {
      const scaleFactor = zoomLevel / 100;
      prevZoomRef.current = zoomLevel;
      
      // 一貫したサイズを維持
      const originalWidth = 1600;
      const originalHeight = 900;
      
      // キャンバスサイズは固定（fabric.jsの内部サイズ）
      canvas.setWidth(originalWidth);
      canvas.setHeight(originalHeight);
      
      // キャンバス要素のスタイルをリセット
      if (canvas.wrapperEl) {
        canvas.wrapperEl.style.transform = '';
        canvas.wrapperEl.style.width = `${originalWidth}px`;
        canvas.wrapperEl.style.height = `${originalHeight}px`;
      }
      
      // コンテナに適切なトランスフォームとトランジションを適用
      if (containerRef.current) {
        // スムーズなトランジションを適用
        containerRef.current.style.transition = 'transform 0.2s ease-out';
        containerRef.current.style.transformOrigin = 'center center';
        containerRef.current.style.willChange = 'transform';
        
        // 固定サイズを設定
        containerRef.current.style.width = `${originalWidth}px`;
        containerRef.current.style.height = `${originalHeight}px`;
        
        // アニメーションがスムーズに行われるようにRequestAnimationFrameを使用
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.style.transform = `scale(${scaleFactor})`;
          }
        });
        
        // 親要素に設定を追加してより安定したレンダリングにする
        const parentElement = containerRef.current.parentElement;
        if (parentElement) {
          parentElement.style.display = 'flex';
          parentElement.style.justifyContent = 'center';
          parentElement.style.alignItems = 'center';
          parentElement.style.overflow = 'hidden';
          parentElement.style.height = '100%';
          parentElement.style.width = '100%';
        }
      }
      
      // デバウンスしたレンダリング呼び出し
      debouncedRender(canvas);
      
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, [zoomLevel, initialized, canvas, containerRef, debouncedRender]);
  
  // コンポーネントのアンマウント時にデバウンスキャンセル
  useEffect(() => {
    return () => {
      debouncedRender.cancel();
    };
  }, [debouncedRender]);
};
