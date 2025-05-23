
import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, IText, Rect, Circle, Image, Object as FabricObject } from 'fabric';
import { SlideElement } from '@/stores/slideStore';
import { CustomFabricObject } from '@/components/slideviewer/editor/FabricObjects';

interface UseFabricCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  elements?: SlideElement[];
  onUpdateElement?: (elementId: string, updates: Partial<SlideElement>) => void;
  onSelectElement?: (element: CustomFabricObject | null) => void;
}

interface UseFabricCanvasResult {
  canvas: Canvas | null;
  initialized: boolean;
  renderElements: (elements: SlideElement[]) => void;
  reset: () => void;
  selectedObject: CustomFabricObject | null;
}

export const useFabricCanvas = ({
  canvasRef,
  currentSlide,
  zoomLevel = 100,
  editable = false,
  elements = [],
  onUpdateElement,
  onSelectElement
}: UseFabricCanvasProps): UseFabricCanvasResult => {
  const canvasInstance = useRef<Canvas | null>(null);
  const [initialized, setInitialized] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const initialRenderRef = useRef(false);
  const selectedObjectRef = useRef<CustomFabricObject | null>(null);

  // Initialize Fabric canvas with better error handling
  useEffect(() => {
    // Clean up previous canvas instance if it exists
    if (canvasInstance.current) {
      try {
        canvasInstance.current.dispose();
      } catch (e) {
        console.error("Error disposing canvas:", e);
      }
      canvasInstance.current = null;
    }

    // Important: Make sure the canvas element is available before initialization
    if (!canvasRef.current) {
      setInitialized(false);
      initialRenderRef.current = false;
      return;
    }

    // Store the parent container for scaling calculations
    containerRef.current = canvasRef.current.parentElement;

    // Add a small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      try {
        // Check if the element still exists before initializing
        if (!canvasRef.current || !document.body.contains(canvasRef.current)) {
          console.log("Canvas element is no longer in the DOM");
          return;
        }

        const canvas = new Canvas(canvasRef.current, {
          backgroundColor: '#ffffff',
          width: 1600,
          height: 900,
          selection: editable, // Allow selection only in editable mode
          preserveObjectStacking: true,
          selectionBorderColor: '#2563eb', // 青色のボーダー
          selectionLineWidth: 2,
        });

        // Set proper dimensions based on parent container
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;
          
          // We'll still use 1600x900 internally for consistent coordinates,
          // but scale the display with CSS
          canvas.setWidth(1600);
          canvas.setHeight(900);
        }
        
        // Setup selection events if in edit mode
        if (editable) {
          canvas.on('selection:created', (e) => {
            if (e.selected && e.selected.length > 0) {
              const obj = e.selected[0] as unknown as CustomFabricObject;
              selectedObjectRef.current = obj;
              if (onSelectElement) onSelectElement(obj);
            }
          });
          
          canvas.on('selection:updated', (e) => {
            if (e.selected && e.selected.length > 0) {
              const obj = e.selected[0] as unknown as CustomFabricObject;
              selectedObjectRef.current = obj;
              if (onSelectElement) onSelectElement(obj);
            }
          });
          
          canvas.on('selection:cleared', () => {
            selectedObjectRef.current = null;
            if (onSelectElement) onSelectElement(null);
          });
          
          // Enhanced object modification events
          canvas.on('object:modified', (e) => {
            const obj = e.target as unknown as CustomFabricObject;
            if (!obj || !obj.customData?.id) return;
            
            const updates: any = {};
            
            // Calculate real dimensions accounting for scaling
            let width, height;
            
            if (obj.type === 'rect') {
              const rect = obj as unknown as Rect;
              width = (rect.width || 0) * (obj.scaleX || 1);
              height = (rect.height || 0) * (obj.scaleY || 1);
              
              // Reset scale to avoid double scaling
              obj.set({
                width: width,
                height: height,
                scaleX: 1,
                scaleY: 1
              });
            } else if (obj.type === 'circle') {
              const circle = obj as unknown as Circle;
              const radius = (circle as any).radius || 0;
              const scale = obj.scaleX || 1; // アスペクト比を維持するため、X軸のみを考慮
              width = radius * 2 * scale;
              height = radius * 2 * scale;
              
              // Reset scale to avoid double scaling
              obj.set({
                radius: width / 2,
                scaleX: 1,
                scaleY: 1
              });
            } else if (obj.type === 'text') {
              const text = obj as unknown as IText;
              width = (text.width || 0) * (obj.scaleX || 1);
              height = (text.height || 0) * (obj.scaleY || 1);
              
              // Reset scale to avoid double scaling
              obj.set({
                width: width,
                scaleX: 1,
                scaleY: 1
              });
            } else if (obj.type === 'image') {
              const img = obj as unknown as Image;
              width = (img.width || 0) * (obj.scaleX || 1);
              height = (img.height || 0) * (obj.scaleY || 1);
            } else {
              width = obj.width || 0;
              height = obj.height || 0;
            }
            
            updates.position = { 
              x: obj.left || 0, 
              y: obj.top || 0 
            };
            
            updates.size = { width, height };
            updates.angle = obj.angle || 0;
            
            // Update the object in our store
            if (onUpdateElement) {
              onUpdateElement(obj.customData.id, updates);
            }
            
            canvas.renderAll();
          });
          
          // Text editing events
          canvas.on('text:changed', (e) => {
            const textObj = e.target as unknown as IText & CustomFabricObject;
            if (!textObj || !textObj.customData?.id) return;
            
            if (onUpdateElement) {
              onUpdateElement(textObj.customData.id, {
                props: {
                  text: textObj.text
                }
              });
            }
          });
        }

        canvasInstance.current = canvas;
        setInitialized(true);
        initialRenderRef.current = true;
        console.log("Canvas initialized successfully");
      } catch (error) {
        console.error("Error initializing canvas:", error);
      }
    }, 150); // Increased delay to ensure DOM is stable

    // Clean up
    return () => {
      clearTimeout(initTimer);
      if (canvasInstance.current) {
        try {
          canvasInstance.current.dispose();
        } catch (e) {
          console.error("Error disposing canvas:", e);
        }
        canvasInstance.current = null;
        setInitialized(false);
      }
    };
  }, [canvasRef, editable, onUpdateElement, onSelectElement]);

  // Improved zoom implementation using CSS transforms instead of canvas scaling
  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas || !initialized || !containerRef.current) return;
    
    try {
      const scaleFactor = zoomLevel / 100;
      
      // Keep the internal canvas size constant for consistent coordinates
      const originalWidth = 1600;
      const originalHeight = 900;
      
      // Apply CSS transform on the canvas wrapper for visual scaling
      if (canvas.wrapperEl) {
        canvas.wrapperEl.style.transform = `scale(${scaleFactor})`;
        canvas.wrapperEl.style.transformOrigin = 'top left';
        canvas.wrapperEl.style.width = `${originalWidth}px`;
        canvas.wrapperEl.style.height = `${originalHeight}px`;
        
        // Update the container size to accommodate the scaled canvas
        containerRef.current.style.width = `${originalWidth * scaleFactor}px`;
        containerRef.current.style.height = `${originalHeight * scaleFactor}px`;
      }
      
      canvas.renderAll();
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, [zoomLevel, initialized]);

  // Function to render elements to the canvas
  const renderElements = useCallback((elementsToRender: SlideElement[]) => {
    const canvas = canvasInstance.current;
    if (!canvas || !initialized) {
      console.warn("Cannot render elements: Canvas not initialized");
      return;
    }

    try {
      // Clear the canvas first
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      
      if (elementsToRender && elementsToRender.length > 0) {
        // Sort elements by zIndex
        const sortedElements = [...elementsToRender].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        
        // Add elements to canvas
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
              Image.fromURL(
                props.src, 
                (img) => {
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
                  
                  // Add custom data
                  (img as unknown as CustomFabricObject).customData = { id };
                  
                  canvas.add(img);
                  canvas.renderAll();
                }
              );
              break;
          }
        }
      } else {
        // If there are no elements, use a placeholder text
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
  }, [initialized, editable, currentSlide]);

  // Reset function to clear the canvas
  const reset = useCallback(() => {
    const canvas = canvasInstance.current;
    if (!canvas || !initialized) return;
    
    try {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
      selectedObjectRef.current = null;
    } catch (error) {
      console.error("Error resetting canvas:", error);
    }
  }, [initialized]);

  return { 
    canvas: canvasInstance.current, 
    initialized,
    renderElements,
    reset,
    selectedObject: selectedObjectRef.current
  };
};

export default useFabricCanvas;
