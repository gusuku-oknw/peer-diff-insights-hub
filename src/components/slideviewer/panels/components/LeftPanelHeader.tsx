
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, History, GitBranch } from "lucide-react";

interface LeftPanelHeaderProps {
  currentBranch: string;
  isVeryNarrow?: boolean;
  isMobile?: boolean;
  onClose: () => void;
}

const LeftPanelHeader: React.FC<LeftPanelHeaderProps> = ({
  currentBranch,
  isVeryNarrow = false,
  isMobile = false,
  onClose
}) => {
  // ESCキーでパネルを閉じる機能
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  return (
    <div className={`${isVeryNarrow ? 'p-2' : 'p-3'} border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className={`${isVeryNarrow ? 'text-sm' : 'text-base'} font-semibold text-gray-800 flex items-center min-w-0`}>
          <History className={`${isVeryNarrow ? 'h-4 w-4 mr-1' : 'h-4 w-4 mr-2'} text-blue-600 flex-shrink-0`} />
          <span className="truncate">{isVeryNarrow ? 'スライド履歴' : 'スライド管理'}</span>
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={`${isVeryNarrow ? 'h-6 w-6 p-0' : 'h-7 w-7 p-0'} flex-shrink-0 hover:bg-white/70 hover:border-gray-300 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 border border-transparent`}
          title="パネルを閉じる (ESC)"
          aria-label="左パネルを閉じる"
        >
          <X className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600 hover:text-gray-800 transition-colors`} />
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <p className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} text-gray-600 flex items-center truncate`}>
          <GitBranch className={`${isVeryNarrow ? 'h-3 w-3 mr-1' : 'h-3 w-3 mr-1'} text-blue-500 flex-shrink-0`} />
          <span className="truncate">{isVeryNarrow ? currentBranch : `現在: ${currentBranch}`}</span>
        </p>
      </div>
      
      <div className={`${isVeryNarrow ? 'mt-1.5' : 'mt-2'} bg-white/60 rounded-md ${isVeryNarrow ? 'p-1.5' : 'p-2'} border border-white/50`}>
        <div className="flex items-center justify-between mb-0.5">
          <span className={`${isVeryNarrow ? 'text-xs' : 'text-xs'} text-blue-700 font-medium`}>
            {isVeryNarrow ? 'ブランチ管理' : 'ブランチとコミット管理'}
          </span>
        </div>
        <div className="text-xs text-gray-600">
          ブランチの切り替えとコミット履歴の確認
        </div>
      </div>
    </div>
  );
};

export default LeftPanelHeader;
