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
  const prevZoomRef = useRef<number>(100); // Default to 100%
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
      
      // キャンバス要素のスタイルをリセット
      if (canvas.wrapperEl) {
        canvas.wrapperEl.style.transform = '';
        canvas.wrapperEl.style.width = `${originalWidth}px`;
        canvas.wrapperEl.style.height = `${originalHeight}px`;
      }
      
      // コンテナに最適化されたスタイルを適用
      const container = containerRef.current;
      if (container) {
        // Ensure the scale factor is valid
        const validScaleFactor = Math.max(0.25, Math.min(2, scaleFactor));
        
        // Calculate scaled dimensions
        const scaledWidth = originalWidth * validScaleFactor;
        const scaledHeight = originalHeight * validScaleFactor;
        
        // Apply styles for smooth zoom with proper centering
        Object.assign(container.style, {
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          transformOrigin: 'center center',
          willChange: 'transform',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'scale(1)', // Let CSS handle the sizing instead of transform scale
          backfaceVisibility: 'hidden',
          imageRendering: validScaleFactor < 1 ? 'auto' : 'crisp-edges'
        });

        // Parent element styling for proper centering
        const parentElement = container.parentElement;
        if (parentElement) {
          Object.assign(parentElement.style, {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto', // Allow scrolling for large zoom levels
            height: '100%',
            width: '100%',
            perspective: '1000px'
          });
        }
      }

      // Render with debouncing for performance
      debouncedRender(canvas);
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, [debouncedRender]);
  
  useEffect(() => {
    if (!canvas || !initialized || !containerRef.current) return;
    
    // Ensure zoom level is valid
    const validZoomLevel = Math.max(25, Math.min(200, zoomLevel || 100));
    
    // Only apply if zoom actually changed
    if (prevZoomRef.current === validZoomLevel) return;
    
    console.log(`Applying zoom: ${validZoomLevel}% (previous: ${prevZoomRef.current}%)`);
    
    const scaleFactor = validZoomLevel / 100;
    prevZoomRef.current = validZoomLevel;
    
    applyZoom(canvas, scaleFactor);
  }, [zoomLevel, initialized, canvas, containerRef, applyZoom]);
  
  // Initialize with default zoom on first mount
  useEffect(() => {
    if (!canvas || !initialized || !containerRef.current) return;
    
    // Set initial zoom to 100% if not already set
    const initialZoom = zoomLevel || 100;
    if (prevZoomRef.current === 100 && initialZoom === 100) {
      const scaleFactor = 1;
      applyZoom(canvas, scaleFactor);
    }
  }, [canvas, initialized, containerRef, zoomLevel, applyZoom]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedRender.cancel();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [debouncedRender]);
};
