
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
    if (!canvasRef.current || canvasInstance.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#ffffff',
      width: 1600,
      height: 900,
      selection: editable, // Allow selection only in editable mode
      preserveObjectStacking: true,
    });

    canvasInstance.current = canvas;
    setInitialized(true);

    // Clean up
    return () => {
      canvas.dispose();
      canvasInstance.current = null;
      setInitialized(false);
    };
  }, [editable, canvasRef]);

  // Apply the zoom level
  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas) return;
    
    const scaleFactor = zoomLevel / 100;
    canvas.setZoom(scaleFactor);
    
    // Update canvas dimensions based on zoom while maintaining aspect ratio
    const originalWidth = 1600; // Original width
    const originalHeight = 900; // Original height
    
    canvas.setDimensions({
      width: originalWidth * scaleFactor,
      height: originalHeight * scaleFactor,
    });
    
    canvas.renderAll();
  }, [zoomLevel]);

  // Set up object modification events when editable
  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas || !initialized || !editable || !onUpdateElement) return;

    const handleObjectModified = (e: fabric.TEvent<Event>) => {
      const modifiedObject = e.target as CustomFabricObject;
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
  }, [initialized, editable, onUpdateElement]);

  return { 
    canvas: canvasInstance.current, 
    initialized 
  };
};

export default useFabricCanvas;
