
import React from "react";
import { useResizablePanels } from "@/hooks/useResizablePanels";

interface ResizablePanelProps {
  children: React.ReactNode;
  initialWidth: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  resizePosition?: 'left' | 'right' | 'top' | 'bottom';
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  initialWidth,
  minWidth = 200,
  maxWidth = 400,
  onWidthChange,
  className = "",
  orientation = 'vertical',
  resizePosition = 'right',
}) => {
  const { width, ResizeHandle } = useResizablePanels({
    initialWidth,
    minWidth,
    maxWidth,
    onWidthChange,
    orientation,
  });

  const style = orientation === 'vertical' 
    ? { width: `${width}px` }
    : { height: `${width}px` };

  return (
    <div className={`relative ${className}`} style={style}>
      {resizePosition === 'left' && (
        <ResizeHandle 
          className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 z-10" 
          position="left" 
        />
      )}
      {resizePosition === 'top' && (
        <ResizeHandle 
          className="absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500 z-10" 
          position="top" 
        />
      )}
      
      <div className="h-full w-full">
        {children}
      </div>
      
      {resizePosition === 'right' && (
        <ResizeHandle 
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 z-10" 
          position="right" 
        />
      )}
      {resizePosition === 'bottom' && (
        <ResizeHandle 
          className="absolute bottom-0 left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500 z-10" 
          position="bottom" 
        />
      )}
    </div>
  );
};
