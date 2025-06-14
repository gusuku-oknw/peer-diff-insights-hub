
import { useCallback } from 'react';
import { Canvas, FabricObject, Point } from 'fabric';

interface UseCanvasAnimationsProps {
  canvas: Canvas | null;
}

export const useCanvasAnimations = ({ canvas }: UseCanvasAnimationsProps) => {

  const addElementWithAnimation = useCallback((element: FabricObject) => {
    if (!canvas) return;

    // Set initial state for animation
    element.set({
      opacity: 0,
      scaleX: 0.1,
      scaleY: 0.1,
    });

    canvas.add(element);

    // Animate to final state using Fabric.js v6 API - updated syntax
    element.animate('opacity', {
      to: 1,
      duration: 300,
      easing: 'easeOutCubic',
    });

    element.animate('scaleX', {
      to: 1,
      duration: 300,
      easing: 'easeOutCubic',
    });

    element.animate('scaleY', {
      to: 1,
      duration: 300,
      easing: 'easeOutCubic',
      onChange: () => canvas.renderAll(),
      onComplete: () => {
        canvas.setActiveObject(element);
        canvas.renderAll();
      }
    });
  }, [canvas]);

  const removeElementWithAnimation = useCallback((element: FabricObject) => {
    if (!canvas) return;

    element.animate('opacity', {
      to: 0,
      duration: 200,
      easing: 'easeInQuad',
    });

    element.animate('scaleX', {
      to: 0.1,
      duration: 200,
      easing: 'easeInQuad',
    });

    element.animate('scaleY', {
      to: 0.1,
      duration: 200,
      easing: 'easeInQuad',
      onChange: () => canvas.renderAll(),
      onComplete: () => {
        canvas.remove(element);
        canvas.renderAll();
      }
    });
  }, [canvas]);

  const highlightElement = useCallback((element: FabricObject) => {
    if (!canvas) return;

    const originalOpacity = element.opacity || 1;
    
    element.animate('opacity', {
      to: 0.5,
      duration: 150,
      easing: 'easeInQuad',
      onChange: () => canvas.renderAll(),
      onComplete: () => {
        element.animate('opacity', {
          to: originalOpacity,
          duration: 150,
          easing: 'easeOutCubic',
          onChange: () => canvas.renderAll()
        });
      }
    });
  }, [canvas]);

  const smoothZoom = useCallback((targetZoom: number, centerPoint?: { x: number; y: number }) => {
    if (!canvas) return;

    const currentZoom = canvas.getZoom();
    const steps = 10;
    const stepSize = (targetZoom - currentZoom) / steps;
    let currentStep = 0;

    const animate = () => {
      if (currentStep >= steps) return;
      
      currentStep++;
      const newZoom = currentZoom + (stepSize * currentStep);
      
      if (centerPoint) {
        // Use proper Point constructor for Fabric.js v6
        const point = new Point(centerPoint.x, centerPoint.y);
        canvas.zoomToPoint(point, newZoom);
      } else {
        canvas.setZoom(newZoom);
      }
      
      canvas.renderAll();
      
      if (currentStep < steps) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [canvas]);

  return {
    addElementWithAnimation,
    removeElementWithAnimation,
    highlightElement,
    smoothZoom
  };
};
