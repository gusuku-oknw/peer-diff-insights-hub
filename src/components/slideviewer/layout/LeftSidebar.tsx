
import React from "react";
import BranchSelector from "@/components/slideviewer/history/BranchSelector";
import CommitHistory from "@/components/slideviewer/history/CommitHistory";
import LeftPanelHeader from "@/components/slideviewer/panels/components/LeftPanelHeader";
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
    <div className="h-full flex flex-col bg-gray-50 shadow-sm border-r border-gray-200">
      {/* Enhanced Header */}
      <LeftPanelHeader
        currentBranch={currentBranch}
        isMobile={isMobile}
        onClose={onToggleLeftSidebar}
      />

      {/* Compact Branch Selector */}
      <div className="px-3 py-2 border-b border-gray-100 bg-white/50 flex-shrink-0">
        <div className="mb-1">
          <label className="text-xs font-medium text-gray-700 block">
            ブランチ選択
          </label>
        </div>
        <BranchSelector
          currentBranch={currentBranch}
          branches={branches}
          onBranchChange={onBranchChange}
        />
      </div>

      {/* Expanded Commit History */}
      <div className="flex-1 min-h-0 p-3 overflow-hidden bg-gradient-to-b from-white/30 to-gray-50/50">
        <div className="mb-2 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            コミット履歴
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {commitHistory.length} 件のコミット
          </p>
        </div>
        <div className="h-full overflow-hidden">
          <CommitHistory commitHistory={commitHistory} />
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
