import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { CustomFabricObject } from '@/components/slideviewer/editor/FabricObjects';
import { SlideElement } from '@/stores/slideStore';

interface UseFabricCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  elements?: SlideElement[];
  onUpdateElement?: (elementId: string, updates: Partial<SlideElement>) => void;
}

interface UseFabricCanvasResult {
  canvas: fabric.Canvas | null;
  initialized: boolean;
  renderElements: (elements: SlideElement[]) => void;
  reset: () => void;
}

export const useFabricCanvas = ({
  canvasRef,
  currentSlide,
  zoomLevel = 100,
  editable = false,
  elements = [],
  onUpdateElement
}: UseFabricCanvasProps): UseFabricCanvasResult => {
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const [initialized, setInitialized] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const initialRenderRef = useRef(false);

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

        const canvas = new fabric.Canvas(canvasRef.current, {
          backgroundColor: '#ffffff',
          width: 1600,
          height: 900,
          selection: editable, // Allow selection only in editable mode
          preserveObjectStacking: true,
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
  }, [canvasRef, editable]);

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
      
      // No need to call setZoom which would affect internal coordinates
      canvas.renderAll();
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }, [zoomLevel, initialized]);

  // Set up object modification events when editable
  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas || !initialized || !editable || !onUpdateElement) return;

    try {
      // Use a more generic type for the event handler that works with fabric.js v6
      const handleObjectModified = (options: fabric.TOptions<fabric.TEvent>) => {
        // Get the modified object either from the target or first selected object
        const modifiedObject = options.target as CustomFabricObject;
        if (!modifiedObject || !modifiedObject.customData?.id) return;
        
        // Calculate real dimensions accounting for scaling
        const width = modifiedObject.width! * (modifiedObject.scaleX || 1);
        const height = modifiedObject.height! * (modifiedObject.scaleY || 1);
        
        // Update the object in our store
        onUpdateElement(modifiedObject.customData.id, {
          position: { 
            x: modifiedObject.left || 0, 
            y: modifiedObject.top || 0 
          },
          size: { width, height },
          angle: modifiedObject.angle || 0,
        });
      };

      canvas.on('object:modified', handleObjectModified);
      
      return () => {
        canvas.off('object:modified', handleObjectModified);
      };
    } catch (error) {
      console.error("Error setting up modification events:", error);
    }
  }, [initialized, editable, onUpdateElement]);

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
              const text = new fabric.IText(props.text || "New Text", {
                left: position.x,
                top: position.y,
                width: size.width,
                fontSize: props.fontSize || 24,
                fill: props.color || '#000000',
                fontFamily: props.fontFamily || 'Arial',
                fontWeight: props.fontWeight || 'normal',
                angle: angle || 0,
                originX: 'center',
                originY: 'center',
                selectable: editable,
              }) as CustomFabricObject;
              
              text.customData = { id };
              canvas.add(text);
              break;
              
            case 'shape':
              if (props.shape === 'rect') {
                const rect = new fabric.Rect({
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
                }) as CustomFabricObject;
                
                rect.customData = { id };
                canvas.add(rect);
              } else if (props.shape === 'circle') {
                const circle = new fabric.Circle({
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
                }) as CustomFabricObject;
                
                circle.customData = { id };
                canvas.add(circle);
              }
              break;
              
            case 'image':
              fabric.Image.fromURL(
                props.src, 
                { crossOrigin: 'anonymous' }
              ).then((img) => {
                if (!canvas) return;

                img.set({
                  left: position.x,
                  top: position.y,
                  scaleX: size.width / img.width! || 1,
                  scaleY: size.height / img.height! || 1,
                  angle: angle || 0,
                  selectable: editable,
                  originX: 'center',
                  originY: 'center',
                });
                
                // Add custom data
                (img as CustomFabricObject).customData = { id };
                
                canvas.add(img);
                canvas.renderAll();
              }).catch(error => console.error("Error loading image:", error));
              break;
          }
        }
      } else {
        // If there are no elements, use a placeholder text
        const slideNumberText = new fabric.Text(`スライド ${currentSlide}`, {
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
    } catch (error) {
      console.error("Error resetting canvas:", error);
    }
  }, [initialized]);

  return { 
    canvas: canvasInstance.current, 
    initialized,
    renderElements,
    reset
  };
};

export default useFabricCanvas;
