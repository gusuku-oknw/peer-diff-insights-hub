
import React from "react";
import { Button } from "@/components/ui/button";
import { X, GitBranch } from "lucide-react";

interface LeftPanelHeaderProps {
  currentBranch: string;
  isMobile: boolean;
  onClose: () => void;
}

const LeftPanelHeader: React.FC<LeftPanelHeaderProps> = ({
  currentBranch,
  isMobile,
  onClose
}) => {
  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-gray-800">
            {isMobile ? "履歴" : "プロジェクト履歴"}
          </h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
          aria-label="サイドバーを閉じる"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-2">
        <span className="text-xs text-gray-600">
          現在のブランチ: <span className="font-medium text-blue-700">{currentBranch}</span>
        </span>
      </div>
    </div>
  );
};

export default LeftPanelHeader;
