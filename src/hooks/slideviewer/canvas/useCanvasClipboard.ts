
import { useState, useCallback } from 'react';
import { Canvas, FabricObject } from 'fabric';

interface UseCanvasClipboardProps {
  canvas: Canvas | null;
}

export const useCanvasClipboard = ({ canvas }: UseCanvasClipboardProps) => {
  const [clipboard, setClipboard] = useState<FabricObject | null>(null);

  const copySelected = useCallback(async () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    try {
      // Use Fabric.js v6 clone method - it returns a Promise
      const cloned = await activeObject.clone();
      setClipboard(cloned);
    } catch (error) {
      console.error('Error copying object:', error);
    }
  }, [canvas]);

  const paste = useCallback(async () => {
    if (!canvas || !clipboard) return;

    try {
      const cloned = await clipboard.clone();
      canvas.discardActiveObject();
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
        evented: true,
      });

      if (cloned.type === 'activeSelection') {
        // Handle multiple selection
        (cloned as any).canvas = canvas;
        (cloned as any).forEachObject((obj: FabricObject) => {
          canvas.add(obj);
        });
        cloned.setCoords();
      } else {
        canvas.add(cloned);
      }

      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    } catch (error) {
      console.error('Error pasting object:', error);
    }
  }, [canvas, clipboard]);

  const duplicate = useCallback(async () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    try {
      const cloned = await activeObject.clone();
      canvas.discardActiveObject();
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
        evented: true,
      });

      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    } catch (error) {
      console.error('Error duplicating object:', error);
    }
  }, [canvas]);

  return {
    copySelected,
    paste,
    duplicate,
    hasClipboard: !!clipboard
  };
};
