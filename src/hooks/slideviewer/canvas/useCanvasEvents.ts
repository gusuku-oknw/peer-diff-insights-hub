
import { useCallback } from 'react';
import { Canvas } from 'fabric';

interface UseCanvasEventsProps {
  editable: boolean;
  currentSlide: number;
  updateSlideElement: (slideId: number, elementId: string, updates: any) => void;
  incrementCanvasOps: () => void;
}

export const useCanvasEvents = ({
  editable,
  currentSlide,
  updateSlideElement,
  incrementCanvasOps
}: UseCanvasEventsProps) => {
  
  const setupCanvasEvents = useCallback((canvas: Canvas) => {
    if (!editable) return;
    
    // デバウンスされたイベントハンドラー
    let modificationTimeout: NodeJS.Timeout;
    
    const handleObjectModified = (e: any) => {
      incrementCanvasOps();
      
      clearTimeout(modificationTimeout);
      modificationTimeout = setTimeout(() => {
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
      }, 100);
    };
    
    const handleSelectionCreated = (e: any) => {
      incrementCanvasOps();
      console.log('Object selected:', e.selected?.[0]);
    };
    
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleSelectionCreated);
    
    return () => {
      clearTimeout(modificationTimeout);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:created', handleSelectionCreated);
    };
  }, [editable, currentSlide, updateSlideElement, incrementCanvasOps]);

  return { setupCanvasEvents };
};
