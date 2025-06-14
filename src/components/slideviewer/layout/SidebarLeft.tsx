
import React from "react";
import { LeftSidebarWrapper } from "./LeftSidebarWrapper";

interface SidebarLeftProps {
  leftSidebarOpen: boolean;
  currentBranch: string;
  branches: string[];
  commitHistory: any[];
  onBranchChange: (branch: string) => void;
  onToggleLeftSidebar: () => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({
  leftSidebarOpen,
  currentBranch,
  branches,
  commitHistory,
  onBranchChange,
  onToggleLeftSidebar,
}) => {
  return (
    <div className={`transition-all duration-300 ease-in-out ${leftSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <LeftSidebarWrapper
        leftSidebarOpen={leftSidebarOpen}
        currentBranch={currentBranch}
        branches={branches}
        commitHistory={commitHistory}
        onBranchChange={onBranchChange}
        onToggleLeftSidebar={onToggleLeftSidebar}
      />
    </div>
  );
};

export default SidebarLeft;
