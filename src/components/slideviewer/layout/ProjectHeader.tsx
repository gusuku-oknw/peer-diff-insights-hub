
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

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLeftSidebar}
          title={leftSidebarOpen ? "Close left sidebar" : "Open left sidebar"}
        >
          {leftSidebarOpen ? <PanelLeftOpen className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Slide Viewer</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleRightPanel}
          title={isRightPanelVisible() ? "Close right panel" : "Open right panel"}
        >
          {isRightPanelVisible() ? <X className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
};

export default ProjectHeader;
