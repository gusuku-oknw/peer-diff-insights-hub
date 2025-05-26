
import React from "react";
import { ResizablePanel } from "@/components/slide-viewer/layout/ResizablePanel";
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

  return (
    <ResizablePanel
      initialWidth={editSidebarWidth}
      minWidth={220}
      maxWidth={400}
      onWidthChange={setEditSidebarWidth}
      className="border-r border-gray-200 bg-white"
      resizePosition="right"
    >
      <EditSidebar currentSlide={currentSlide} />
    </ResizablePanel>
  );
};
