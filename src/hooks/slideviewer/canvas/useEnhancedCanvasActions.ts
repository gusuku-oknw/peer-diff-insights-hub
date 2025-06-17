
import { useCallback } from 'react';
import { Canvas, FabricText, Rect, Circle } from 'fabric';
import { useSlideStore } from '@/stores/slide.store';
import { useCanvasAnimations } from './useCanvasAnimations';
import { useCanvasClipboard } from './useCanvasClipboard';
import { useCanvasLayering } from './useCanvasLayering';
import type { SlideElement } from '@/types/slide.types';

interface UseEnhancedCanvasActionsProps {
  canvas: Canvas | null;
  currentSlide: number;
}

export const useEnhancedCanvasActions = ({ canvas, currentSlide }: UseEnhancedCanvasActionsProps) => {
  const { addSlideElement, removeSlideElement } = useSlideStore();
  const { addElementWithAnimation, removeElementWithAnimation } = useCanvasAnimations({ canvas });
  const { copySelected, paste, duplicate, hasClipboard } = useCanvasClipboard({ canvas });
  const { bringToFront, sendToBack, rotateObject } = useCanvasLayering({ canvas });

  const addText = useCallback(() => {
    if (!canvas) return;

    const text = new FabricText('テキストを入力', {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#000000',
      originX: 'center',
      originY: 'center',
    });

    addElementWithAnimation(text);

    const element: SlideElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      position: { x: canvas.width! / 2, y: canvas.height! / 2 },
      size: { width: 120, height: 30 },
      props: {
        content: 'テキストを入力',
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#000000'
      }
    };

    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement, addElementWithAnimation]);

  const addRectangle = useCallback(() => {
    if (!canvas) return;

    const rect = new Rect({
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      width: 150,
      height: 100,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    addElementWithAnimation(rect);

    const element: SlideElement = {
      id: `rect-${Date.now()}`,
      type: 'rectangle',
      position: { x: canvas.width! / 2, y: canvas.height! / 2 },
      size: { width: 150, height: 100 },
      props: {
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2
      }
    };

    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement, addElementWithAnimation]);

  const addCircle = useCallback(() => {
    if (!canvas) return;

    const circle = new Circle({
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      radius: 60,
      fill: '#ef4444',
      stroke: '#dc2626',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    addElementWithAnimation(circle);

    const element: SlideElement = {
      id: `circle-${Date.now()}`,
      type: 'circle',
      position: { x: canvas.width! / 2, y: canvas.height! / 2 },
      size: { width: 120, height: 120 },
      props: {
        radius: 60,
        fill: '#ef4444',
        stroke: '#dc2626',
        strokeWidth: 2
      }
    };

    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement, addElementWithAnimation]);

  const deleteSelected = useCallback(() => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    removeElementWithAnimation(activeObject);

    // Remove from store if it has an ID
    const elementId = (activeObject as any).customData?.id;
    if (elementId) {
      removeSlideElement(currentSlide, elementId);
    }
  }, [canvas, currentSlide, removeSlideElement, removeElementWithAnimation]);

  return {
    addText,
    addRectangle,
    addCircle,
    deleteSelected,
    copySelected,
    paste,
    duplicate,
    bringToFront,
    sendToBack,
    rotateObject: () => rotateObject(90),
    hasClipboard
  };
};
