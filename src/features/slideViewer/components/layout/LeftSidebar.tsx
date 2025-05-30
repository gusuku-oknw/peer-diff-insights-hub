
import React from "react";
import BranchSelector from "@/components/slideviewer/history/BranchSelector";
import CommitHistory from "@/components/slideviewer/history/CommitHistory";
import { useIsMobile } from "@/hooks/use-mobile";

interface LeftSidebarProps {
  leftSidebarOpen: boolean;
  currentBranch: string;
  branches: string[];
  commitHistory: any[];
  onBranchChange: (branch: string) => void;
  onToggleLeftSidebar: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  leftSidebarOpen,
  currentBranch,
  branches,
  commitHistory,
  onBranchChange,
  onToggleLeftSidebar
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">スライド管理</h2>
      </div>

      {/* Branch Selector */}
      <div className="px-4 py-2 border-b border-gray-100">
        <BranchSelector
          currentBranch={currentBranch}
          branches={branches}
          onBranchChange={onBranchChange}
        />
      </div>

      {/* Commit History */}
      <div className="flex-grow p-4 overflow-auto">
        <CommitHistory commitHistory={commitHistory} />
      </div>
    </div>
  );
};

export default LeftSidebar;
