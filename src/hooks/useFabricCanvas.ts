import { useEffect, useRef, useState } from 'react';
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

  // Initialize Fabric canvas
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
      return;
    }

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

        canvasInstance.current = canvas;
        setInitialized(true);
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

  // Apply the zoom level - improved implementation
  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas || !initialized) return;
    
    try {
      const scaleFactor = zoomLevel / 100;
      canvas.setZoom(scaleFactor);
      
      // Keep the original dimensions and let CSS handle the visual scaling
      // This improves performance while maintaining correct internal coordinates
      const originalWidth = 1600;
      const originalHeight = 900;
      
      canvas.setWidth(originalWidth);
      canvas.setHeight(originalHeight);
      
      // Apply CSS transform on the canvas wrapper
      if (canvas.wrapperEl) {
        canvas.wrapperEl.style.transform = `scale(${scaleFactor})`;
        canvas.wrapperEl.style.transformOrigin = 'center center';
      }
      
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
      // Fix: Use a more generic type for the event handler that works with fabric.js v6
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

  return { 
    canvas: canvasInstance.current, 
    initialized 
  };
};

export default useFabricCanvas;
