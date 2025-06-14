
import { useCallback } from 'react';
import { Canvas, FabricObject } from 'fabric';

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

    // Animate to final state
    element.animate('opacity', 1, {
      duration: 300,
      easing: (t, b, c, d) => c * ((t = t / d - 1) * t * t + 1) + b, // easeOutCubic
    });

    element.animate('scaleX', 1, {
      duration: 300,
      easing: (t, b, c, d) => c * ((t = t / d - 1) * t * t + 1) + b,
    });

    element.animate('scaleY', 1, {
      duration: 300,
      easing: (t, b, c, d) => c * ((t = t / d - 1) * t * t + 1) + b,
      onChange: () => canvas.renderAll(),
      onComplete: () => {
        canvas.setActiveObject(element);
        canvas.renderAll();
      }
    });
  }, [canvas]);

  const removeElementWithAnimation = useCallback((element: FabricObject) => {
    if (!canvas) return;

    element.animate('opacity', 0, {
      duration: 200,
      easing: (t, b, c, d) => c * t * t + b, // easeInQuad
    });

    element.animate('scaleX', 0.1, {
      duration: 200,
      easing: (t, b, c, d) => c * t * t + b,
    });

    element.animate('scaleY', 0.1, {
      duration: 200,
      easing: (t, b, c, d) => c * t * t + b,
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
    
    element.animate('opacity', 0.5, {
      duration: 150,
      easing: (t, b, c, d) => c * t * t + b,
      onChange: () => canvas.renderAll(),
      onComplete: () => {
        element.animate('opacity', originalOpacity, {
          duration: 150,
          easing: (t, b, c, d) => c * ((t = t / d - 1) * t * t + 1) + b,
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
        canvas.zoomToPoint({ x: centerPoint.x, y: centerPoint.y }, newZoom);
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
