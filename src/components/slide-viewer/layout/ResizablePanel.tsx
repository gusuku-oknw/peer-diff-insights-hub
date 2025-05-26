
import React from 'react';
import { useResizablePanels } from '@/hooks/useResizablePanels';

interface ResizablePanelProps {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
  className?: string;
  resizePosition?: 'left' | 'right';
  orientation?: 'vertical' | 'horizontal';
}

export const ResizablePanel = ({
  children,
  initialWidth = 256,
  minWidth = 200,
  maxWidth = 400,
  onWidthChange,
  className = '',
  resizePosition = 'right',
  orientation = 'vertical'
}: ResizablePanelProps) => {
  const { width, ResizeHandle } = useResizablePanels({
    initialWidth,
    minWidth,
    maxWidth,
    onWidthChange,
    orientation
  });

  return (
    <div 
      className={`relative flex-shrink-0 ${className}`}
      style={{ 
        width: orientation === 'vertical' ? `${width}px` : '100%',
        height: orientation === 'horizontal' ? `${width}px` : '100%'
      }}
    >
      {children}
      <ResizeHandle position={resizePosition} />
    </div>
  );
};
