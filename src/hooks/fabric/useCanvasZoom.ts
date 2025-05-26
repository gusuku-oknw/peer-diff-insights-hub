
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
  const prevZoomRef = useRef<number>(100);
  const animationFrameRef = useRef<number | null>(null);
  
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

  const applyZoom = useCallback((canvas: Canvas, scaleFactor: number) => {
    if (!containerRef.current) return;

    try {
      const originalWidth = 1600;
      const originalHeight = 900;
      
      canvas.setWidth(originalWidth);
      canvas.setHeight(originalHeight);
      
      const container = containerRef.current;
      if (container) {
        const validScaleFactor = Math.max(0.25, Math.min(2, scaleFactor));
        const scaledWidth = originalWidth * validScaleFactor;
        const scaledHeight = originalHeight * validScaleFactor;
        
        // シンプルなサイズ調整のみ適用
        container.style.width = `${scaledWidth}px`;
        container.style.height = `${scaledHeight}px`;
        container.style.transform = 'none';
        container.style.transition = 'all 0.2s ease-in-out';
      }

      debouncedRender(canvas);
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, [debouncedRender]);
  
  useEffect(() => {
    if (!canvas || !initialized || !containerRef.current) return;
    
    const validZoomLevel = Math.max(25, Math.min(200, zoomLevel || 100));
    
    if (prevZoomRef.current === validZoomLevel) return;
    
    console.log(`Applying zoom: ${validZoomLevel}% (previous: ${prevZoomRef.current}%)`);
    
    const scaleFactor = validZoomLevel / 100;
    prevZoomRef.current = validZoomLevel;
    
    applyZoom(canvas, scaleFactor);
  }, [zoomLevel, initialized, canvas, containerRef, applyZoom]);
  
  useEffect(() => {
    if (!canvas || !initialized || !containerRef.current) return;
    
    const initialZoom = zoomLevel || 100;
    if (prevZoomRef.current === 100 && initialZoom === 100) {
      const scaleFactor = 1;
      applyZoom(canvas, scaleFactor);
    }
  }, [canvas, initialized, containerRef, zoomLevel, applyZoom]);
  
  useEffect(() => {
    return () => {
      debouncedRender.cancel();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [debouncedRender]);
};
