
import React from "react";
import LeftSidebar from "./LeftSidebar";

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
  if (!leftSidebarOpen) return null;

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out">
      <LeftSidebar
        currentBranch={currentBranch}
        branches={branches}
        commitHistory={commitHistory}
        leftSidebarOpen={leftSidebarOpen}
        onBranchChange={onBranchChange}
        onToggleLeftSidebar={onToggleLeftSidebar}
      />
    </div>
  );
};
