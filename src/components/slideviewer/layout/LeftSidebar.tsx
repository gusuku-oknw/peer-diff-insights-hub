
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
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  leftSidebarOpen,
  currentBranch,
  branches,
  commitHistory,
  onBranchChange
}) => {
  const isMobile = useIsMobile();

  return (
    <aside 
      className={`
        w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 
        transition-transform duration-300 ease-in-out
        ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'fixed top-0 left-0 h-full z-40' : 'absolute top-0 left-0 h-full z-10'}
      `}
    >
      <div className="h-full flex flex-col">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">スライド管理</h2>
        </div>

        {/* Branch Selector */}
        <div className="px-4 mb-4">
          <BranchSelector
            currentBranch={currentBranch}
            branches={branches}
            onBranchChange={onBranchChange}
          />
        </div>

        {/* Commit History */}
        <div className="flex-grow p-4">
          <CommitHistory commitHistory={commitHistory} />
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
