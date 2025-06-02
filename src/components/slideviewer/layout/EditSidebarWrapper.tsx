
import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import EditSidebar from "../editor/EditSidebar";
import { useSlideStore } from "@/stores/slide-store";
import type { ViewerMode } from "@/types/slide.types";

interface EditSidebarWrapperProps {
  viewerMode: ViewerMode;
  userType: "student" | "enterprise";
  currentSlide: number;
}

export const EditSidebarWrapper: React.FC<EditSidebarWrapperProps> = ({
  viewerMode,
  userType,
  currentSlide,
}) => {
  const { editSidebarWidth, setEditSidebarWidth } = useSlideStore();

  if (!(viewerMode === "edit" && userType === "enterprise")) {
    return null;
  }

  // Calculate size percentage based on editSidebarWidth
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const sizePercentage = Math.min(35, Math.max(15, (editSidebarWidth / windowWidth) * 100));

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        defaultSize={sizePercentage}
        minSize={15}
        maxSize={35}
        className="border-r border-gray-200 bg-white"
        onResize={(size) => {
          const newWidth = (size / 100) * windowWidth;
          setEditSidebarWidth(Math.max(220, Math.min(400, newWidth)));
        }}
      >
        <EditSidebar currentSlide={currentSlide} />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel
        defaultSize={100 - sizePercentage}
        minSize={65}
        maxSize={85}
      >
        {/* This panel is handled by the parent component */}
        <div className="w-full h-full" />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
