
import { useCallback } from 'react';
import { useSlideStore } from '@/stores/slide.store';
import { IText, Rect, Circle } from 'fabric';
import { Canvas } from 'fabric';
import type { SlideElement } from '@/types/slide.types';

interface UseCanvasActionsProps {
  canvas: Canvas | null;
  currentSlide: number;
}

export const useCanvasActions = ({ canvas, currentSlide }: UseCanvasActionsProps) => {
  const { addSlideElement } = useSlideStore();

  const addText = useCallback(() => {
    if (!canvas) return;

    const text = new IText('Click to edit', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000',
    });

    canvas.add(text);
    canvas.setActiveObject(text);

    const element: SlideElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      position: { x: 100, y: 100 },
      size: { width: 120, height: 25 },
      props: {
        content: 'Click to edit',
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#000000'
      }
    };

    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement]);

  const addRectangle = useCallback(() => {
    if (!canvas) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'blue',
      stroke: 'darkblue',
      strokeWidth: 2,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);

    const element: SlideElement = {
      id: `rect-${Date.now()}`,
      type: 'rectangle',
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      props: {
        fill: 'blue',
        stroke: 'darkblue',
        strokeWidth: 2
      }
    };

    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement]);

  const addCircle = useCallback(() => {
    if (!canvas) return;

    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: 'green',
      stroke: 'darkgreen',
      strokeWidth: 2,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);

    const element: SlideElement = {
      id: `circle-${Date.now()}`,
      type: 'circle',
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      props: {
        radius: 50,
        fill: 'green',
        stroke: 'darkgreen',
        strokeWidth: 2
      }
    };

    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement]);

  // Add shape method for compatibility
  const addShape = useCallback(() => {
    addRectangle(); // Default to rectangle
  }, [addRectangle]);

  // Add image method for compatibility
  const addImage = useCallback(() => {
    // Simple placeholder implementation
    console.log('Add image functionality not implemented yet');
  }, []);

  return {
    addText,
    addRectangle,
    addCircle,
    addShape,
    addImage
  };
};
