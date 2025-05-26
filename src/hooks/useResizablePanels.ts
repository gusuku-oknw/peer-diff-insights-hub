
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseResizablePanelsProps {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
  orientation?: 'vertical' | 'horizontal';
}

export const useResizablePanels = ({
  initialWidth = 256,
  minWidth = 200,
  maxWidth = 400,
  onWidthChange,
  orientation = 'vertical'
}: UseResizablePanelsProps) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  
  const handleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setStartPosition(orientation === 'vertical' ? e.clientX : e.clientY);
    setStartWidth(width);
    
    document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }, [width, orientation]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const currentPosition = orientation === 'vertical' ? e.clientX : e.clientY;
    const delta = currentPosition - startPosition;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + delta));
    
    setWidth(newWidth);
    onWidthChange?.(newWidth);
  }, [isResizing, startPosition, startWidth, minWidth, maxWidth, onWidthChange, orientation]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const ResizeHandle = useCallback(({ className = '', position = 'right' }: { 
    className?: string; 
    position?: 'left' | 'right' | 'top' | 'bottom';
  }) => (
    <div
      ref={handleRef}
      className={`
        ${orientation === 'vertical' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'}
        ${position === 'right' ? 'absolute right-0 top-0 bottom-0' :
          position === 'left' ? 'absolute left-0 top-0 bottom-0' :
          position === 'top' ? 'absolute top-0 left-0 right-0' :
          'absolute bottom-0 left-0 right-0'}
        bg-gray-300 hover:bg-blue-400 transition-colors duration-200 z-10
        ${isResizing ? 'bg-blue-500' : ''}
        ${className}
      `}
      onMouseDown={handleMouseDown}
      title={orientation === 'vertical' ? 'サイズを調整' : '高さを調整'}
    />
  ), [handleMouseDown, isResizing, orientation]);

  return {
    width,
    isResizing,
    ResizeHandle,
    setWidth: (newWidth: number) => {
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(clampedWidth);
      onWidthChange?.(clampedWidth);
    }
  };
};
