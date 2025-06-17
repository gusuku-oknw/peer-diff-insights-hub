
import { useCallback } from 'react';
import { Canvas } from 'fabric';

interface UseCanvasInitializationProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  editable: boolean;
  onReady: () => void;
  onError: (error: string) => void;
}

export const useCanvasInitialization = ({
  canvasRef,
  fabricCanvasRef,
  editable,
  onReady,
  onError
}: UseCanvasInitializationProps) => {
  
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) {
      onError('Canvas element not found');
      return;
    }
    
    try {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        selection: editable,
        allowTouchScrolling: false,
        enableRetinaScaling: true,
        renderOnAddRemove: true,
        skipTargetFind: !editable,
        interactive: editable,
        moveCursor: editable ? 'move' : 'default',
        hoverCursor: editable ? 'move' : 'default',
        defaultCursor: editable ? 'default' : 'default'
      });
      
      fabricCanvasRef.current = canvas;
      onReady();
      
      console.log('Canvas initialized successfully');
    } catch (err) {
      console.error('Canvas initialization failed:', err);
      onError('キャンバスの初期化に失敗しました');
    }
  }, [canvasRef, fabricCanvasRef, editable, onReady, onError]);
  
  return { initializeCanvas };
};
