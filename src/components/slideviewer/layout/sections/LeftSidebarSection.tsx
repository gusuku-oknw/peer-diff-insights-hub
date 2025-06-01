
import React from "react";
import SplitPane from "react-split-pane";
import { LeftSidebarWrapper } from "../LeftSidebarWrapper";

interface LeftSidebarSectionProps {
  leftSidebarOpen: boolean;
  currentBranch: string;
  branches: string[];
  commitHistory: any[];
  onBranchChange: (branch: string) => void;
  onToggleLeftSidebar: () => void;
  children: React.ReactElement;
}

export const LeftSidebarSection: React.FC<LeftSidebarSectionProps> = ({
  leftSidebarOpen,
  currentBranch,
  branches,
  commitHistory,
  onBranchChange,
  onToggleLeftSidebar,
  children,
}) => {
  if (!leftSidebarOpen) {
    return (
      <div className="flex-1 min-w-0">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <SplitPane
        split="vertical"
        minSize={180}
        maxSize={400}
        defaultSize={300}
        style={{ position: 'relative' }}
      >
        <LeftSidebarWrapper
          currentBranch={currentBranch}
          branches={branches}
          commitHistory={commitHistory}
          leftSidebarOpen={leftSidebarOpen}
          onBranchChange={onBranchChange}
          onToggleLeftSidebar={onToggleLeftSidebar}
        />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </SplitPane>
    </div>
  );
};
