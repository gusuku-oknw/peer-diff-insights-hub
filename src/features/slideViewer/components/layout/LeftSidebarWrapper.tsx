
import React from "react";
import { ResizablePanel } from "@/components/slide-viewer/layout/ResizablePanel";
import LeftSidebar from "./LeftSidebar";
import { useSlideStore } from "@/stores/slide-store";

interface LeftSidebarWrapperProps {
  currentBranch: string;
  branches: string[];
  commitHistory: any[];
  leftSidebarOpen: boolean;
  onBranchChange: (branch: string) => void;
  onToggleLeftSidebar: () => void;
}

export const LeftSidebarWrapper: React.FC<LeftSidebarWrapperProps> = ({
  currentBranch,
  branches,
  commitHistory,
  leftSidebarOpen,
  onBranchChange,
  onToggleLeftSidebar,
}) => {
  const { leftSidebarWidth, setLeftSidebarWidth } = useSlideStore();

  if (!leftSidebarOpen) return null;

  return (
    <ResizablePanel
      initialWidth={leftSidebarWidth}
      minWidth={180}
      maxWidth={400}
      onWidthChange={setLeftSidebarWidth}
      className="bg-gray-50 border-r border-gray-200"
      resizePosition="right"
    >
      <LeftSidebar
        currentBranch={currentBranch}
        branches={branches}
        commitHistory={commitHistory}
        leftSidebarOpen={leftSidebarOpen}
        onBranchChange={onBranchChange}
        onToggleLeftSidebar={onToggleLeftSidebar}
      />
    </ResizablePanel>
  );
};
