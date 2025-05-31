
import React from "react";
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
  return (
    <div className="flex h-full w-full">
      {leftSidebarOpen && (
        <LeftSidebarWrapper
          currentBranch={currentBranch}
          branches={branches}
          commitHistory={commitHistory}
          leftSidebarOpen={leftSidebarOpen}
          onBranchChange={onBranchChange}
          onToggleLeftSidebar={onToggleLeftSidebar}
        />
      )}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
};
