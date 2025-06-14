
import { useCallback } from 'react';
import { Canvas } from 'fabric';

interface UseCanvasLayeringProps {
  canvas: Canvas | null;
}

export const useCanvasLayering = ({ canvas }: UseCanvasLayeringProps) => {

  const bringToFront = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    canvas.bringToFront(activeObject);
    canvas.renderAll();
  }, [canvas]);

  const sendToBack = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    canvas.sendToBack(activeObject);
    canvas.renderAll();
  }, [canvas]);

  const bringForward = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    canvas.bringForward(activeObject);
    canvas.renderAll();
  }, [canvas]);

  const sendBackwards = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    canvas.sendBackwards(activeObject);
    canvas.renderAll();
  }, [canvas]);

  const rotateObject = useCallback((degrees: number = 90) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const currentAngle = activeObject.angle || 0;
    activeObject.set('angle', currentAngle + degrees);
    canvas.renderAll();
  }, [canvas]);

  return {
    bringToFront,
    sendToBack,
    bringForward,
    sendBackwards,
    rotateObject
  };
};
