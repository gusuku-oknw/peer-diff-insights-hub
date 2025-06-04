
import React from "react";
import EditSidebar from "../editor/EditSidebar";
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
  if (!(viewerMode === "edit" && userType === "enterprise")) {
    return null;
  }

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <EditSidebar currentSlide={currentSlide} />
    </div>
  );
};
