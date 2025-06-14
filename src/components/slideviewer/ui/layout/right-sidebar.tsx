
import React from "react";
import { RightPanelWrapper } from "./right-panel-wrapper";
import type { ViewerMode } from "@/types/slide.types";

interface RightSidebarProps {
  viewerMode: ViewerMode;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  userType: "student" | "enterprise";
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  viewerMode,
  showPresenterNotes,
  isFullScreen,
  currentSlide,
  totalSlides,
  presenterNotes,
  userType,
}) => {
  return (
    <RightPanelWrapper
      viewerMode={viewerMode}
      showPresenterNotes={showPresenterNotes}
      isFullScreen={isFullScreen}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      presenterNotes={presenterNotes}
      userType={userType}
    />
  );
};

export default RightSidebar;
