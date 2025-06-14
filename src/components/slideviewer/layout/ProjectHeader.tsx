
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
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLeftSidebar}
          className="p-2"
        >
          {leftSidebarOpen ? <PanelLeftOpen className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">スライドビューア</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleRightPanel}
          className="p-2"
        >
          {isRightPanelVisible() ? <X className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ProjectHeader;
