import { useState, useRef, useEffect } from 'react';
import { Canvas } from 'fabric';
import { useSlideStore } from '@/stores/slide.store';

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
  
  const { slides } = useSlideStore();
  
  // Get current slide data
  const currentSlideData = slides[currentSlide - 1];
  const elements = currentSlideData?.elements || [];
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;
    
    try {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        selection: editable,
        allowTouchScrolling: false,
        enableRetinaScaling: true
      });
      
      fabricCanvasRef.current = canvas;
      setIsReady(true);
      
      console.log('Canvas initialized');
    } catch (err) {
      console.error('Canvas initialization failed:', err);
      setError('キャンバスの初期化に失敗しました');
    }
  }, [editable]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);
  
  return {
    canvasRef,
    fabricCanvasRef,
    isReady,
    error,
    elements,
    slides
  };
};
