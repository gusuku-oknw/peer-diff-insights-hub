
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
  
  const handleRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const ResizeHandle = useCallback(({ className = '', position = 'right' }: { 
    className?: string; 
    position?: 'left' | 'right' | 'top' | 'bottom';
  }) => {
    const isVertical = orientation === 'vertical';
    
    // Local state for this specific resize handle
    const [startPosition, setStartPosition] = useState(0);
    const [startWidth, setStartWidth] = useState(0);
    
    // Debug logging
    const logResize = (action: string, data: any) => {
      console.log(`[Resize ${position}] ${action}:`, data);
    };
    
    // Unified mouse down handler
    const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const currentPos = orientation === 'vertical' ? e.clientX : e.clientY;
      
      setIsResizing(true);
      setStartPosition(currentPos);
      setStartWidth(width);
      
      logResize('MouseDown', { currentPos, width, position });
      
      document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    }, [width, orientation]);

    // Unified mouse move handler
    const handleResizeMouseMove = useCallback((e: MouseEvent) => {
      if (!isResizing) return;
      
      const currentPosition = orientation === 'vertical' ? e.clientX : e.clientY;
      let delta = currentPosition - startPosition;
      
      // For left-positioned handles (right panel), reverse the delta for intuitive behavior
      if (position === 'left') {
        delta = -delta;
      }
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + delta));
      
      logResize('MouseMove', { 
        currentPosition, 
        startPosition, 
        delta: currentPosition - startPosition,
        adjustedDelta: delta,
        startWidth, 
        newWidth,
        position
      });
      
      setWidth(newWidth);
      onWidthChange?.(newWidth);
    }, [isResizing, startPosition, startWidth, minWidth, maxWidth, onWidthChange, orientation, position]);

    // Single useEffect for event listeners
    useEffect(() => {
      if (isResizing) {
        logResize('Adding listeners', { isResizing });
        
        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
          logResize('Removing listeners', { isResizing });
          document.removeEventListener('mousemove', handleResizeMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isResizing, handleResizeMouseMove, handleMouseUp]);
    
    return (
      <div
        ref={handleRef}
        className={`
          ${isVertical ? 'w-2 cursor-col-resize hover:w-3' : 'h-2 cursor-row-resize hover:h-3'}
          ${position === 'right' ? 'absolute right-0 top-0 bottom-0' :
            position === 'left' ? 'absolute left-0 top-0 bottom-0' :
            position === 'top' ? 'absolute top-0 left-0 right-0' :
            'absolute bottom-0 left-0 right-0'}
          bg-gray-200 hover:bg-blue-400 transition-all duration-200 z-20 group
          ${isResizing ? 'bg-blue-500 shadow-lg' : ''}
          ${className}
        `}
        onMouseDown={handleResizeMouseDown}
        title={orientation === 'vertical' ? 'ドラッグして幅を調整' : 'ドラッグして高さを調整'}
      >
        {/* Visual grip indicator */}
        <div className={`
          ${isVertical ? 'w-full h-8 top-1/2 left-0 -translate-y-1/2' : 'h-full w-8 left-1/2 top-0 -translate-x-1/2'}
          absolute flex items-center justify-center
          ${isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          transition-opacity duration-200
        `}>
          <div className={`
            ${isVertical ? 'w-0.5 h-6' : 'h-0.5 w-6'}
            bg-white rounded-full shadow-sm
          `} />
        </div>
        
        {/* Extended hit area */}
        <div className={`
          ${isVertical ? 'w-4 -left-1' : 'h-4 -top-1'}
          absolute inset-0 
        `} />
      </div>
    );
  }, [width, isResizing, orientation, minWidth, maxWidth, onWidthChange, handleMouseUp]);

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
