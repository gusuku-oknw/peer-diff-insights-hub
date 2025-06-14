
import React from "react";
import LeftFloatingButton from "./LeftFloatingButton";
import RightFloatingButton from "./RightFloatingButton";

interface FloatingButtonsProps {
  isMobile: boolean;
  leftSidebarOpen: boolean;
  hideRightPanelCompletely: boolean;
  isRightPanelVisible: boolean;
  onToggleLeftSidebar: () => void;
  onToggleRightPanel: () => void;
}

const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  isMobile,
  leftSidebarOpen,
  hideRightPanelCompletely,
  isRightPanelVisible,
  onToggleLeftSidebar,
  onToggleRightPanel,
}) => {
  return (
    <>
      {/* Left Edge Tab - Show when left sidebar is closed and not on mobile */}
      {!isMobile && !leftSidebarOpen && (
        <LeftFloatingButton onToggle={onToggleLeftSidebar} />
      )}

      {/* Right Edge Tab - Show when right panel is closed and not on mobile */}
      {!isMobile && !hideRightPanelCompletely && !isRightPanelVisible && (
        <RightFloatingButton onToggle={onToggleRightPanel} />
      )}
    </>
  );
};

export default FloatingButtons;
