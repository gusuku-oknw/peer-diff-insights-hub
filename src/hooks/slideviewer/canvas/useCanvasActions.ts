
import { useCallback } from 'react';
import { useSlideStore } from "@/stores/slide.store";
import { IText, Rect, Circle } from 'fabric';
import { Canvas } from 'fabric';

interface UseCanvasActionsProps {
  currentSlide: number;
  canvas: Canvas | null;
}

export const useCanvasActions = ({ currentSlide, canvas }: UseCanvasActionsProps) => {
  const addSlideElement = useSlideStore(state => state.addSlideElement);

  const addText = useCallback(() => {
    if (!canvas) return;

    const text = new IText('新しいテキスト', {
      left: canvas.width ? canvas.width / 2 : 400,
      top: canvas.height ? canvas.height / 2 : 200,
      fontSize: 24,
      fill: '#000000',
      fontFamily: 'Arial',
      originX: 'center',
      originY: 'center',
      selectable: true,
      editable: true,
    });

    const elementId = `text-${Date.now()}`;
    (text as any).customData = { id: elementId };

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    // Store the element data
    addSlideElement(currentSlide, {
      id: elementId,
      type: 'text',
      position: { x: text.left || 0, y: text.top || 0 },
      size: { width: text.width || 100, height: text.height || 50 },
      props: {
        text: '新しいテキスト',
        fontSize: 24,
        color: '#000000',
        fontFamily: 'Arial'
      },
      zIndex: Date.now()
    });
  }, [canvas, currentSlide, addSlideElement]);

  const addShape = useCallback((shapeType: 'rect' | 'circle') => {
    if (!canvas) return;

    const centerX = canvas.width ? canvas.width / 2 : 400;
    const centerY = canvas.height ? canvas.height / 2 : 200;
    
    let shape;
    const elementId = `${shapeType}-${Date.now()}`;

    if (shapeType === 'rect') {
      shape = new Rect({
        left: centerX,
        top: centerY,
        width: 100,
        height: 100,
        fill: '#3b82f6',
        originX: 'center',
        originY: 'center',
        selectable: true,
      });
    } else {
      shape = new Circle({
        left: centerX,
        top: centerY,
        radius: 50,
        fill: '#8b5cf6',
        originX: 'center',
        originY: 'center',
        selectable: true,
      });
    }

    (shape as any).customData = { id: elementId };

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();

    // Store the element data
    addSlideElement(currentSlide, {
      id: elementId,
      type: 'shape',
      position: { x: shape.left || 0, y: shape.top || 0 },
      size: { 
        width: shapeType === 'rect' ? 100 : 100,
        height: shapeType === 'rect' ? 100 : 100
      },
      props: {
        shape: shapeType,
        fill: shapeType === 'rect' ? '#3b82f6' : '#8b5cf6'
      },
      zIndex: Date.now()
    });
  }, [canvas, currentSlide, addSlideElement]);

  const addImage = useCallback(() => {
    if (!canvas) return;
    
    // Create a file input for image upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const imgSrc = event.target?.result as string;
        
        // This would need to be implemented with proper image handling
        console.log('Image upload functionality would be implemented here:', imgSrc);
      };
      reader.readAsDataURL(file);
    };
    
    input.click();
  }, [canvas]);

  return {
    addText,
    addShape,
    addImage
  };
};
