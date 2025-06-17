
import React from 'react';

interface SidePanelProps {
  children: React.ReactNode;
  className?: string;
  width?: number;
}

const SidePanel: React.FC<SidePanelProps> = ({ children, className = "", width }) => {
  return (
    <div 
      className={`h-full bg-white border-l border-gray-200 ${className}`}
      style={width ? { width: `${width}px` } : {}}
    >
      {children}
    </div>
  );
};

export default SidePanel;
