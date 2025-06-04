
import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from 'fabric';
import { useSlideStore } from "@/stores/slide";

interface UseSlideCanvasProps {
  currentSlide: number;
  editable: boolean;
  containerWidth: number;
  containerHeight: number;
}

export const useSlideCanvas = ({ 
  currentSlide, 
  editable, 
  containerWidth, 
  containerHeight 
}: UseSlideCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1600, height: 900 });
  
  const slides = useSlideStore(state => state.slides);
  const updateSlideElement = useSlideStore(state => state.updateSlideElement);
  
  const currentSlideData = slides.find(slide => slide.id === currentSlide);
  const elements = currentSlideData?.elements || [];
  
  // Calculate optimal canvas size with better fallback handling
  const calculateOptimalCanvasSize = useCallback(() => {
    // Use fallback values if container dimensions are not available yet
    const fallbackWidth = 1600;
    const fallbackHeight = 900;
    
    const availableWidth = containerWidth > 0 ? containerWidth - 32 : fallbackWidth * 0.8;
    const availableHeight = containerHeight > 0 ? containerHeight - 32 : fallbackHeight * 0.8;
    
    const aspectRatio = 16 / 9;
    let canvasWidth = availableWidth * 0.9; // Slightly reduce to ensure proper fit
    let canvasHeight = canvasWidth / aspectRatio;
    
    if (canvasHeight > availableHeight * 0.9) {
      canvasHeight = availableHeight * 0.9;
      canvasWidth = canvasHeight * aspectRatio;
    }
    
    // Ensure minimum and maximum bounds
    canvasWidth = Math.max(400, Math.min(1920, canvasWidth));
    canvasHeight = Math.max(225, Math.min(1080, canvasHeight));
    
    return { width: Math.round(canvasWidth), height: Math.round(canvasHeight) };
  }, [containerWidth, containerHeight]);
  
  // Update canvas size when container size changes
  useEffect(() => {
    const newSize = calculateOptimalCanvasSize();
    setCanvasSize(newSize);
    console.log('Canvas size calculated:', newSize, 'from container:', { containerWidth, containerHeight });
  }, [calculateOptimalCanvasSize, containerWidth, containerHeight]);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
      
      const canvas = new Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: '#ffffff',
        selection: editable,
        preserveObjectStacking: true,
        selectionBorderColor: '#2563eb',
        selectionLineWidth: 2,
      });
      
      fabricCanvasRef.current = canvas;
      setIsReady(true);
      setError(null);
      
      console.log('Canvas initialized with size:', canvasSize);
      
      if (editable) {
        canvas.on('selection:created', (e) => {
          console.log('Object selected:', e.selected?.[0]);
        });
        
        canvas.on('object:modified', (e) => {
          const obj = e.target as any;
          if (obj?.customData?.id) {
            const updates = {
              position: { x: obj.left || 0, y: obj.top || 0 },
              size: { 
                width: (obj.width || 0) * (obj.scaleX || 1),
                height: (obj.height || 0) * (obj.scaleY || 1)
              },
              angle: obj.angle || 0
            };
            updateSlideElement(currentSlide, obj.customData.id, updates);
          }
        });
      }
      
    } catch (err) {
      console.error('Canvas initialization failed:', err);
      setError('キャンバスの初期化に失敗しました');
      setIsReady(false);
    }
    
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [editable, currentSlide, canvasSize, updateSlideElement]);
  
  // Update canvas dimensions when size changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;
    
    canvas.setDimensions({
      width: canvasSize.width,
      height: canvasSize.height
    });
    canvas.renderAll();
    
    console.log('Canvas resized to:', canvasSize);
  }, [canvasSize, isReady]);

  return {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error,
    canvasSize,
    elements,
    slides
  };
};
