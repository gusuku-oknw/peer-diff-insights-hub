
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
    setRightPanelHidden(currentVisible);
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLeftSidebar}
          className="flex items-center gap-2"
          title={leftSidebarOpen ? "左パネルを閉じる" : "左パネルを開く"}
        >
          {leftSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span className="hidden sm:inline">履歴</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-gray-900">スライドビューワー</h1>
          <span className="text-sm text-gray-500">プロジェクト</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleRightPanel}
          className="flex items-center gap-2"
          title={isRightPanelVisible() ? "右パネルを閉じる" : "右パネルを開く"}
        >
          <span className="hidden sm:inline">パネル</span>
          {isRightPanelVisible() ? <PanelRightOpen className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
};

export default ProjectHeader;
