
import { useEffect, useRef, useCallback } from 'react';
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
  const animationFrameRef = useRef<number | null>(null);
  
  // Create a debounced version of the canvas renderAll function with memory cleanup
  const debouncedRender = useRef(
    debounce((canvas: Canvas) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        canvas.renderAll();
        animationFrameRef.current = null;
      });
    }, 50, { leading: false, trailing: true })
  ).current;

  // キャンバススケーリングを処理する関数をメモ化
  const applyZoom = useCallback((canvas: Canvas, scaleFactor: number) => {
    if (!containerRef.current) return;

    try {
      // 1600x900の固定サイズを維持
      const originalWidth = 1600;
      const originalHeight = 900;
      
      // キャンバスサイズは内部的に固定
      canvas.setWidth(originalWidth);
      canvas.setHeight(originalHeight);
      
      // キャンバス要素のスタイルを一度だけリセット
      if (canvas.wrapperEl) {
        canvas.wrapperEl.style.transform = '';
        canvas.wrapperEl.style.width = `${originalWidth}px`;
        canvas.wrapperEl.style.height = `${originalHeight}px`;
      }
      
      // コンテナに最適化されたスタイルを適用
      const container = containerRef.current;
      if (container) {
        // スムーズなズームのためのスタイル
        Object.assign(container.style, {
          width: `${originalWidth}px`,
          height: `${originalHeight}px`,
          transformOrigin: 'center center',
          willChange: 'transform',
          transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `scale(${scaleFactor})`,
          backfaceVisibility: 'hidden'
        });

        // 親要素にも最適化スタイルを設定
        const parentElement = container.parentElement;
        if (parentElement) {
          Object.assign(parentElement.style, {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            height: '100%',
            width: '100%',
            perspective: '1000px'
          });
        }
      }

      // デバウンスしたレンダリングで描画を最適化
      debouncedRender(canvas);
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, [debouncedRender]);
  
  useEffect(() => {
    if (!canvas || !initialized || !containerRef.current) return;
    
    // 実際にズームレベルが変更された場合のみ適用
    if (prevZoomRef.current === zoomLevel) return;
    
    console.log(`Applying zoom: ${zoomLevel}% (previous: ${prevZoomRef.current}%)`);
    
    const scaleFactor = zoomLevel / 100;
    prevZoomRef.current = zoomLevel;
    
    applyZoom(canvas, scaleFactor);
  }, [zoomLevel, initialized, canvas, containerRef, applyZoom]);
  
  // アンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      debouncedRender.cancel();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [debouncedRender]);
};
