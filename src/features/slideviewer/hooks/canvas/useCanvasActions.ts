import { useCallback } from 'react';
import { Canvas, FabricText, Rect } from 'fabric';
import { useSlideStore } from '@/stores/slide.store';

interface UseCanvasActionsProps {
  currentSlide: number;
  canvas: Canvas | null;
}

export const useCanvasActions = ({
  currentSlide,
  canvas
}: UseCanvasActionsProps) => {
  const { addSlideElement } = useSlideStore();

  const addText = useCallback(() => {
    if (!canvas) return;

    const text = new FabricText('新しいテキスト', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000'
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    // Add to store
    const element = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: '新しいテキスト',
      x: 100,
      y: 100,
      width: 200,
      height: 50
    };

    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement]);

  const addShape = useCallback(() => {
    if (!canvas) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#007bff',
      stroke: '#0056b3',
      strokeWidth: 2
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();

    // Add to store
    const element = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: 100,
      y: 100,
      width: 100,
      height: 100
    };

    addSlideElement(currentSlide, element);
  }, [canvas, currentSlide, addSlideElement]);

  const addImage = useCallback(() => {
    if (!canvas) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        
        // Add to store
        const element = {
          id: `image-${Date.now()}`,
          type: 'image',
          src: imgUrl,
          x: 100,
          y: 100,
          width: 200,
          height: 150
        };
        
        addSlideElement(currentSlide, element);
      };
      reader.readAsDataURL(file);
    };
    
    input.click();
  }, [canvas, currentSlide, addSlideElement]);

  return {
    addText,
    addShape,
    addImage
  };
};
