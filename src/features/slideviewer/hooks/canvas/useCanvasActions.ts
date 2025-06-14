
import { useCallback } from 'react';
import { Canvas, FabricText, Rect } from 'fabric';
import { useSlideStore } from '@/stores/slide.store';
import type { SlideElement } from '@/types/slide.types';

interface UseCanvasActionsProps {
  canvas: Canvas | null;
  currentSlide: number;
}

export const useCanvasActions = ({ canvas, currentSlide }: UseCanvasActionsProps) => {
  const { addSlideElement, updateSlideElement, removeSlideElement } = useSlideStore();

  const addText = useCallback((x: number = 100, y: number = 100) => {
    if (!canvas) return;

    const text = new FabricText('テキストを入力', {
      left: x,
      top: y,
      fontFamily: 'Arial',
      fontSize: 16,
      fill: '#000000',
    });

    canvas.add(text);
    canvas.setActiveObject(text);

    // Create SlideElement conforming to the interface
    const element: SlideElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      position: { x, y },
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

  const addShape = useCallback((shapeType: 'rectangle' | 'circle', x: number = 100, y: number = 100) => {
    if (!canvas) return;

    let shape;
    let element: SlideElement;

    if (shapeType === 'rectangle') {
      shape = new Rect({
        left: x,
        top: y,
        width: 100,
        height: 100,
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2,
      });

      element = {
        id: `rect-${Date.now()}`,
        type: 'rectangle',
        position: { x, y },
        size: { width: 100, height: 100 },
        props: {
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2
        }
      };
    } else {
      // Circle implementation would go here
      return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement]);

  const addImage = useCallback((imageUrl: string, x: number = 100, y: number = 100) => {
    if (!canvas) return;

    // Image loading logic would be implemented here
    const element: SlideElement = {
      id: `image-${Date.now()}`,
      type: 'image',
      position: { x, y },
      size: { width: 200, height: 150 },
      props: {
        src: imageUrl,
        alt: 'Uploaded image'
      }
    };

    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement]);

  const deleteSelected = useCallback(() => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      // Remove from store would be implemented here based on object ID
    }
  }, [canvas]);

  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
  }, [canvas]);

  return {
    addText,
    addShape,
    addImage,
    deleteSelected,
    clearCanvas
  };
};
