
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

  // Enhanced mouse move handler with improved delta calculation
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const currentPosition = orientation === 'vertical' ? e.clientX : e.clientY;
    const delta = startPositionRef.current - currentPosition; // For left handle, reversed delta
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

  const ResizeHandle = useCallback(({ className = '', position = 'right' }: { 
    className?: string; 
    position?: 'left' | 'right' | 'top' | 'bottom';
  }) => {
    const isVertical = orientation === 'vertical';
    
    const handleMouseDown = (e: React.MouseEvent) => {
      console.log('useResizablePanels: Mouse down on resize handle', { position, isVertical });
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
      <div
        className={`
          ${isVertical ? 'w-1 cursor-col-resize hover:w-2' : 'h-1 cursor-row-resize hover:h-2'}
          ${position === 'right' ? 'absolute right-0 top-0 bottom-0' :
            position === 'left' ? 'absolute left-0 top-0 bottom-0' :
            position === 'top' ? 'absolute top-0 left-0 right-0' :
            'absolute bottom-0 left-0 right-0'}
          bg-transparent hover:bg-blue-400 transition-all duration-200 z-50 group
          ${isResizing ? 'bg-blue-500 shadow-lg w-2' : ''}
          ${className}
        `}
        onMouseDown={handleMouseDown}
        title={orientation === 'vertical' ? 'ドラッグして幅を調整' : 'ドラッグして高さを調整'}
      >
        {/* Visual grip indicator */}
        <div className={`
          ${isVertical ? 'w-full h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'h-full w-8 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}
          absolute flex items-center justify-center
          ${isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          transition-opacity duration-200 pointer-events-none
        `}>
          <div className={`
            ${isVertical ? 'w-0.5 h-4' : 'h-0.5 w-4'}
            bg-blue-600 rounded-full shadow-sm
          `} />
        </div>
        
        {/* Extended hit area for easier grabbing */}
        <div className={`
          ${isVertical ? 'w-4 -left-1' : 'h-4 -top-1'}
          absolute inset-0 
        `} />
      </div>
    );
  }, [width, isResizing, orientation]);

  return {
    width,
    isResizing,
    ResizeHandle,
    setWidth: (newWidth: number) => {
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      console.log('useResizablePanels: Setting width programmatically', { newWidth, clampedWidth });
      setWidth(clampedWidth);
      onWidthChange?.(clampedWidth);
    }
  };
};
