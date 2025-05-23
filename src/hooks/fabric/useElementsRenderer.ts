
import { useCallback } from 'react';
import { Canvas, IText, Rect, Circle, Image } from 'fabric';
import { SlideElement } from '@/utils/types/slide.types';
import { CustomFabricObject } from '@/utils/types/canvas.types';

interface UseElementsRendererProps {
  canvas: Canvas | null;
  initialized: boolean;
  editable: boolean;
  currentSlide: number;
}

interface UseElementsRendererResult {
  renderElements: (elements: SlideElement[]) => void;
  reset: () => void;
}

export const useElementsRenderer = ({
  canvas,
  initialized,
  editable,
  currentSlide
}: UseElementsRendererProps): UseElementsRendererResult => {
  // 要素をキャンバスにレンダリングする関数
  const renderElements = useCallback((elementsToRender: SlideElement[]) => {
    if (!canvas || !initialized) {
      console.warn("Cannot render elements: Canvas not initialized");
      return;
    }

    try {
      // キャンバスをクリア
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      
      if (elementsToRender && elementsToRender.length > 0) {
        // zIndexでソート
        const sortedElements = [...elementsToRender].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        
        // キャンバスに要素を追加
        for (const element of sortedElements) {
          const { type, position, size, props, id, angle } = element;
          
          switch (type) {
            case 'text':
              const text = new IText(props.text || "New Text", {
                left: position.x,
                top: position.y,
                width: size.width,
                fontSize: props.fontSize || 24,
                fill: props.color || '#000000',
                fontFamily: props.fontFamily || 'Arial',
                fontWeight: props.fontWeight || 'normal',
                fontStyle: props.fontStyle || 'normal',
                textAlign: props.textAlign || 'left',
                underline: props.underline || false,
                angle: angle || 0,
                originX: 'center',
                originY: 'center',
                selectable: editable,
                editable: editable,
              });
              
              (text as unknown as CustomFabricObject).customData = { id };
              canvas.add(text);
              break;
              
            case 'shape':
              if (props.shape === 'rect') {
                const rect = new Rect({
                  left: position.x,
                  top: position.y,
                  width: size.width,
                  height: size.height,
                  fill: props.fill || '#000000',
                  stroke: props.stroke || '',
                  strokeWidth: props.strokeWidth || 0,
                  angle: angle || 0,
                  originX: 'center',
                  originY: 'center',
                  selectable: editable,
                });
                
                (rect as unknown as CustomFabricObject).customData = { id };
                canvas.add(rect);
              } else if (props.shape === 'circle') {
                const circle = new Circle({
                  left: position.x,
                  top: position.y,
                  radius: size.width / 2,
                  fill: props.fill || '#000000',
                  stroke: props.stroke || '',
                  strokeWidth: props.strokeWidth || 0,
                  angle: angle || 0,
                  originX: 'center',
                  originY: 'center',
                  selectable: editable,
                });
                
                (circle as unknown as CustomFabricObject).customData = { id };
                canvas.add(circle);
              }
              break;
              
            case 'image':
              // Fix: Using the proper approach for Image.fromURL with Fabric.js v6
              Image.fromURL(props.src, {
                crossOrigin: 'anonymous',
                // Additional options can be added here
              }).then((img) => {
                if (!canvas) return;

                img.set({
                  left: position.x,
                  top: position.y,
                  scaleX: size.width / (img.width || 1),
                  scaleY: size.height / (img.height || 1),
                  angle: angle || 0,
                  selectable: editable,
                  originX: 'center',
                  originY: 'center',
                });
                
                (img as unknown as CustomFabricObject).customData = { id };
                canvas.add(img);
                canvas.renderAll();
              }).catch(err => {
                console.error("Error loading image:", err);
              });
              break;
          }
        }
      } else {
        // 要素がない場合、プレースホルダーテキストを使用
        const slideNumberText = new IText(`スライド ${currentSlide}`, {
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          fontSize: 36,
          fill: '#1e293b',
          originX: 'center',
          originY: 'center',
          selectable: false,
        });
        canvas.add(slideNumberText);
      }
      
      canvas.renderAll();
    } catch (error) {
      console.error("Error rendering elements to canvas:", error);
    }
  }, [canvas, initialized, editable, currentSlide]);

  // キャンバスをリセットする関数
  const reset = useCallback(() => {
    if (!canvas || !initialized) return;
    
    try {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
    } catch (error) {
      console.error("Error resetting canvas:", error);
    }
  }, [canvas, initialized]);

  return { renderElements, reset };
};
