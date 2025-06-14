
import React from "react";
import SidePanel from "../panels/core/SidePanel";

interface RightSidebarProps {
  isOpen: boolean;
  width: number;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  userType: "student" | "enterprise";
  onToggle: () => void;
  isMobile: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  width,
  currentSlide,
  totalSlides,
  presenterNotes,
  userType,
  onToggle,
  isMobile
}) => {
  const shouldShowNotes = Object.keys(presenterNotes).length > 0;
  const shouldShowReviewPanel = userType === "enterprise" || userType === "student";

  return (
    <SidePanel
      shouldShowNotes={shouldShowNotes}
      shouldShowReviewPanel={shouldShowReviewPanel}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      presenterNotes={presenterNotes}
      userType={userType}
      isHidden={!isOpen}
      onToggleHide={onToggle}
      initialWidth={width}
    />
  );
};

export default RightSidebar;
