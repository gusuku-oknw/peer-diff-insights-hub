
import { useState, useCallback } from 'react';
import { Canvas, FabricObject } from 'fabric';

interface UseCanvasClipboardProps {
  canvas: Canvas | null;
}

export const useCanvasClipboard = ({ canvas }: UseCanvasClipboardProps) => {
  const [clipboard, setClipboard] = useState<any>(null);

  const copySelected = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.clone((cloned: any) => {
      setClipboard(cloned);
    });
  }, [canvas]);

  const paste = useCallback(() => {
    if (!canvas || !clipboard) return;

    clipboard.clone((cloned: FabricObject) => {
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
    });
  }, [canvas, clipboard]);

  const duplicate = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.clone((cloned: FabricObject) => {
      canvas.discardActiveObject();
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
        evented: true,
      });

      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  }, [canvas]);

  return {
    copySelected,
    paste,
    duplicate,
    hasClipboard: !!clipboard
  };
};
