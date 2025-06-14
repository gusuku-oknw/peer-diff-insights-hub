import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, PanelLeftOpen, PanelRightOpen, X } from "lucide-react";
import { useSlideStore } from "@/stores/slide.store";
const ProjectHeader: React.FC = () => {
  const {
    leftSidebarOpen,
    toggleLeftSidebar,
    setRightPanelHidden,
    isRightPanelVisible
  } = useSlideStore();
  const handleToggleRightPanel = () => {
    const currentVisible = isRightPanelVisible();
    setRightPanelHidden(currentVisible); // Hide if currently visible, show if currently hidden
  };
  return;
};
export default ProjectHeader;