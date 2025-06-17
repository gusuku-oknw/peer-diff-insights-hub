
import React from "react";
import { Button } from "@/components/ui/button";
import { GitBranch, Clock, User, CheckCircle, AlertCircle, X } from "lucide-react";

interface CommitHistoryItem {
  id: string;
  message: string;
  author: string;
  date: string;
  reviewStatus: "approved" | "reviewing" | "rejected";
}

interface HistorySidebarProps {
  currentBranch: string;
  branches: string[];
  commitHistory: CommitHistoryItem[];
  onBranchChange: (branch: string) => void;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  currentBranch,
  branches,
  commitHistory,
  onBranchChange,
  onClose
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "reviewing":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <GitBranch className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
            履歴
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 sm:h-9 sm:w-9 p-0 hover:bg-red-50 hover:border-red-200 transition-all duration-200 shadow-sm hover:shadow-md bg-white touch-manipulation"
            title="履歴パネルを閉じる (ESC)"
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4 text-gray-600 hover:text-red-600 transition-colors" />
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">プロジェクトのバージョン管理</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <GitBranch className="h-4 w-4 mr-2" />
            ブランチ
          </h3>
          <div className="space-y-2">
            {branches.map((branch) => (
              <Button
                key={branch}
                variant={branch === currentBranch ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => onBranchChange(branch)}
              >
                {branch}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            コミット履歴
          </h3>
          <div className="space-y-3">
            {commitHistory.map((commit) => (
              <div key={commit.id} className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 flex-1">
                    {commit.message}
                  </p>
                  {getStatusIcon(commit.reviewStatus)}
                </div>
                <div className="flex items-center text-xs text-gray-500 space-x-3">
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {commit.author}
                  </span>
                  <span>{commit.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySidebar;
