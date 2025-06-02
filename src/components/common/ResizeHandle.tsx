
import React from "react";

interface ResizeHandleProps {
  className?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
  orientation?: 'vertical' | 'horizontal';
  isResizing?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  className = '',
  position = 'right',
  orientation = 'vertical',
  isResizing = false,
  onMouseDown
}) => {
  const isVertical = orientation === 'vertical';
  
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
      onMouseDown={onMouseDown}
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
};

export default ResizeHandle;
