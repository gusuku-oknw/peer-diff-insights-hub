
import { useCallback } from 'react';
import { Canvas, FabricText, Rect, Circle } from 'fabric';
import { useSlideStore } from '@/stores/slide.store';
import type { SlideElement } from '@/types/slide.types';

interface UseCanvasActionsProps {
  canvas: Canvas | null;
  currentSlide: number;
}

export const useCanvasActions = ({ canvas, currentSlide }: UseCanvasActionsProps) => {
  const { addSlideElement, updateSlideElement, removeSlideElement } = useSlideStore();

  const addText = useCallback(() => {
    if (!canvas) return;

    const text = new FabricText('テキストを入力', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 16,
      fill: '#000000',
    });

    canvas.add(text);
    canvas.setActiveObject(text);

    const element: SlideElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      position: { x: 100, y: 100 },
      size: { width: 120, height: 20 },
      props: {
        content: 'テキストを入力',
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000000'
      }
    };

    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement]);

  const addRectangle = useCallback(() => {
    if (!canvas) return;

    const shape = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
    });

    const element: SlideElement = {
      id: `rect-${Date.now()}`,
      type: 'rectangle',
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      props: {
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2
      }
    };

    canvas.add(shape);
    canvas.setActiveObject(shape);
    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement]);

  const addCircle = useCallback(() => {
    if (!canvas) return;

    const shape = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
    });

    const element: SlideElement = {
      id: `circle-${Date.now()}`,
      type: 'circle',
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      props: {
        radius: 50,
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2
      }
    };

    canvas.add(shape);
    canvas.setActiveObject(shape);
    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement]);

  // Add shape method for compatibility
  const addShape = useCallback(() => {
    addRectangle(); // Default to rectangle
  }, [addRectangle]);

  // Add image method for compatibility
  const addImage = useCallback(() => {
    console.log('Add image functionality not implemented yet');
  }, []);

  const deleteSelected = useCallback(() => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  }, [canvas]);

  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
  }, [canvas]);

  return {
    addText,
    addRectangle,
    addCircle,
    addShape,
    addImage,
    deleteSelected,
    clearCanvas
  };
};
