
import { useCallback, useRef } from 'react';
import { Canvas, IText, Rect, Circle, Image } from 'fabric';
import { SlideElement } from '@/utils/types/slide.types';
import { CustomFabricObject } from '@/utils/types/canvas.types';

interface UseElementsRendererProps {
  canvas: Canvas | null;
  initialized: boolean;
  editable: boolean;
  currentSlide: number;
  instanceId?: string; // Added instanceId parameter
}

interface UseElementsRendererResult {
  renderElements: (elements: SlideElement[]) => void;
  reset: () => void;
}

export const useElementsRenderer = ({
  canvas,
  initialized,
  editable,
  currentSlide,
  instanceId = 'default' // Default value for backward compatibility
}: UseElementsRendererProps): UseElementsRendererResult => {
  // Keep track of elements to avoid unnecessary re-renders
  const elementsRef = useRef<SlideElement[]>([]);
  // Batch render flag to minimize canvas.renderAll() calls
  const pendingRenderRef = useRef<boolean>(false);
  // Timer for batched rendering
  const renderTimerRef = useRef<number | null>(null);

  // Schedule a batched render
  const scheduleBatchRender = useCallback(() => {
    if (!canvas || pendingRenderRef.current) return;
    
    pendingRenderRef.current = true;
    
    // Clear any existing timer
    if (renderTimerRef.current !== null) {
      window.clearTimeout(renderTimerRef.current);
    }
    
    // Schedule render for next frame
    renderTimerRef.current = window.setTimeout(() => {
      if (canvas) {
        canvas.renderAll();
        console.log(`[Instance ${instanceId}] Batch rendering executed`);
      }
      pendingRenderRef.current = false;
      renderTimerRef.current = null;
    }, 16); // ~60fps
  }, [canvas, instanceId]);

  // 要素をキャンバスにレンダリングする関数
  const renderElements = useCallback((elementsToRender: SlideElement[]) => {
    if (!canvas || !initialized) {
      console.warn(`[Instance ${instanceId}] Cannot render elements: Canvas not initialized`);
      return;
    }

    // Skip if elements are the same (deep comparison could be added for more accuracy)
    if (elementsRef.current === elementsToRender) {
      return;
    }
    
    elementsRef.current = elementsToRender;
    console.log(`[Instance ${instanceId}] Rendering ${elementsToRender.length} elements on slide ${currentSlide}`);

    try {
      // キャンバスをクリア
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      
      if (elementsToRender && elementsToRender.length > 0) {
        // zIndexでソート
        const sortedElements = [...elementsToRender].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        
        // Add all objects without rendering between each addition
        canvas.renderOnAddRemove = false;
        
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
              // Use a promise-based approach with better error handling
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
                
                // Schedule a render after image is loaded
                scheduleBatchRender();
              }).catch(err => {
                console.error(`[Instance ${instanceId}] Error loading image:`, err);
              });
              break;
          }
        }
        
        // Re-enable rendering for future operations
        canvas.renderOnAddRemove = true;
        
        // Render everything at once
        scheduleBatchRender();
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
        canvas.renderAll();
      }
    } catch (error) {
      console.error(`[Instance ${instanceId}] Error rendering elements to canvas:`, error);
    }
  }, [canvas, initialized, editable, currentSlide, scheduleBatchRender, instanceId]);

  // キャンバスをリセットする関数
  const reset = useCallback(() => {
    if (!canvas || !initialized) return;
    
    try {
      console.log(`[Instance ${instanceId}] Resetting canvas`);
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
      elementsRef.current = [];
    } catch (error) {
      console.error(`[Instance ${instanceId}] Error resetting canvas:`, error);
    }
  }, [canvas, initialized, instanceId]);
  
  // Clean up on unmount
  useCallback(() => {
    if (renderTimerRef.current !== null) {
      window.clearTimeout(renderTimerRef.current);
      console.log(`[Instance ${instanceId}] Cleaned up batch render timer`);
    }
  }, [instanceId]);

  return { renderElements, reset };
};
