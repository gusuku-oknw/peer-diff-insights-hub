import { useCallback, useRef } from 'react';
import { Canvas, IText, Rect, Circle, Image } from 'fabric';
import { SlideElement } from '@/utils/types/slide.types';
import { CustomFabricObject } from '@/utils/types/canvas.types';

interface UseElementsRendererProps {
  canvas: Canvas | null;
  initialized: boolean;
  editable: boolean;
  currentSlide: number;
  instanceId?: string;
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
  instanceId = 'default'
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
      if (canvas && !canvas.disposed) {
        canvas.renderAll();
        console.log(`[Instance ${instanceId}] Batch rendering executed for slide ${currentSlide}`);
      }
      pendingRenderRef.current = false;
      renderTimerRef.current = null;
    }, 16); // ~60fps
  }, [canvas, instanceId, currentSlide]);

  // 要素をキャンバスにレンダリングする関数
  const renderElements = useCallback((elementsToRender: SlideElement[]) => {
    if (!canvas || !initialized) {
      console.warn(`[Instance ${instanceId}] Cannot render elements: Canvas not initialized`);
      return;
    }

    if (canvas.disposed) {
      console.warn(`[Instance ${instanceId}] Cannot render elements: Canvas is disposed`);
      return;
    }

    console.log(`[Instance ${instanceId}] Rendering ${elementsToRender.length} elements on slide ${currentSlide}`);
    
    try {
      // キャンバスをクリア
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      
      // Disable rendering during batch operations
      canvas.renderOnAddRemove = false;
      
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
              // Use a promise-based approach with better error handling
              Image.fromURL(props.src, {
                crossOrigin: 'anonymous',
              }).then((img) => {
                if (!canvas || canvas.disposed) return;

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
      } else {
        // 要素がない場合、プレースホルダーテキストを確実に表示
        console.log(`[Instance ${instanceId}] No elements found for slide ${currentSlide}, showing placeholder`);
        const slideNumberText = new IText(`スライド ${currentSlide}`, {
          left: (canvas.width || 800) / 2,
          top: (canvas.height || 600) / 2,
          fontSize: 36,
          fill: '#64748b',
          fontFamily: 'Arial',
          originX: 'center',
          originY: 'center',
          selectable: false,
          editable: false,
        });
        canvas.add(slideNumberText);
        console.log(`[Instance ${instanceId}] Placeholder text added for slide ${currentSlide}`);
      }
      
      // Re-enable rendering and force render
      canvas.renderOnAddRemove = true;
      scheduleBatchRender();
      
      // Update elements reference
      elementsRef.current = elementsToRender;
      console.log(`[Instance ${instanceId}] Successfully rendered slide ${currentSlide} with ${elementsToRender.length} elements`);
      
    } catch (error) {
      console.error(`[Instance ${instanceId}] Error rendering elements to canvas:`, error);
      
      // Fallback: show error message on canvas
      try {
        canvas.clear();
        const errorText = new IText(`エラー: スライド ${currentSlide} を読み込めませんでした`, {
          left: (canvas.width || 800) / 2,
          top: (canvas.height || 600) / 2,
          fontSize: 24,
          fill: '#ef4444',
          fontFamily: 'Arial',
          originX: 'center',
          originY: 'center',
          selectable: false,
          editable: false,
        });
        canvas.add(errorText);
        canvas.renderAll();
      } catch (fallbackError) {
        console.error(`[Instance ${instanceId}] Fallback rendering also failed:`, fallbackError);
      }
    }
  }, [canvas, initialized, editable, currentSlide, scheduleBatchRender, instanceId]);

  // キャンバスをリセットする関数
  const reset = useCallback(() => {
    if (!canvas || !initialized || canvas.disposed) return;
    
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
