
import { useState, useRef, useCallback, useEffect } from 'react';
import ResizeHandle from '@/components/ui/ResizeHandle';

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
  const startPositionRef = useRef(0);
  const startWidthRef = useRef(0);
  
  console.log('useResizablePanels: Hook initialized', { width, initialWidth, isResizing });

  // Enhanced mouse up handler
  const handleMouseUp = useCallback(() => {
    console.log('useResizablePanels: Mouse up event - ending resize');
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.body.style.pointerEvents = '';
  }, []);

  // Fixed mouse move handler with correct delta calculation for right-anchored panels
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const currentPosition = orientation === 'vertical' ? e.clientX : e.clientY;
    // For right-anchored panels with left handle, moving left increases width, moving right decreases width
    const delta = startPositionRef.current - currentPosition;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + delta));
    
    console.log('useResizablePanels: Mouse move', { 
      currentPosition, 
      startPosition: startPositionRef.current,
      delta,
      startWidth: startWidthRef.current,
      newWidth,
      isResizing
    });
    
    if (newWidth !== width) {
      setWidth(newWidth);
      onWidthChange?.(newWidth);
    }
  }, [isResizing, minWidth, maxWidth, onWidthChange, orientation, width]);

  // Add event listeners when resizing starts
  useEffect(() => {
    if (isResizing) {
      console.log('useResizablePanels: Adding global mouse event listeners');
      
      // Prevent text selection and pointer events during resize
      document.body.style.userSelect = 'none';
      document.body.style.pointerEvents = 'none';
      document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize';
      
      // Add global event listeners
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      
      return () => {
        console.log('useResizablePanels: Cleaning up mouse event listeners');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.pointerEvents = '';
        document.body.style.cursor = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp, orientation]);

  const createResizeHandle = useCallback(({ className = '', position = 'right' }: { 
    className?: string; 
    position?: 'left' | 'right' | 'top' | 'bottom';
  }) => {
    const handleMouseDown = (e: React.MouseEvent) => {
      console.log('useResizablePanels: Mouse down on resize handle', { position, isVertical: orientation === 'vertical' });
      e.preventDefault();
      e.stopPropagation();
      
      const currentPos = orientation === 'vertical' ? e.clientX : e.clientY;
      startPositionRef.current = currentPos;
      startWidthRef.current = width;
      
      setIsResizing(true);
      
      console.log('useResizablePanels: Resize started', { 
        startPosition: currentPos, 
        startWidth: width,
        position
      });
    };
    
    return (
      <ResizeHandle
        className={className}
        position={position}
        orientation={orientation}
        isResizing={isResizing}
        onMouseDown={handleMouseDown}
      />
    );
  }, [width, isResizing, orientation]);

  return {
    width,
    isResizing,
    ResizeHandle: createResizeHandle,
    setWidth: (newWidth: number) => {
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      console.log('useResizablePanels: Setting width programmatically', { newWidth, clampedWidth });
      setWidth(clampedWidth);
      onWidthChange?.(clampedWidth);
    }
  };
};
