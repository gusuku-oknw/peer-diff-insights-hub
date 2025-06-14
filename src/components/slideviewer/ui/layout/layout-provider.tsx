
import React from "react";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  return (
      <div className="flex h-full w-full bg-gray-50 relative min-w-0">
        {children}
      </div>
  );
};
