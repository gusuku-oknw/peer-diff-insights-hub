
import React from "react";
import { useSlideStore } from "@/stores/slide-store";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const {
    leftSidebarWidth,
    rightSidebarWidth,
    editSidebarWidth,
    thumbnailsHeight,
    rightPanelHidden,
    setLeftSidebarWidth,
    setRightSidebarWidth,
    setEditSidebarWidth,
    setThumbnailsHeight,
    setRightPanelHidden,
  } = useSlideStore();

  return (
    <div className="flex h-full bg-gray-50 relative">
      {children}
    </div>
  );
};
