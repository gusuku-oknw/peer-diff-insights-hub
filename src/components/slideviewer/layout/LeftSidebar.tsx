
import React from "react";
import { Button } from "@/components/ui/button";
import { History, X } from "lucide-react";
import { useSlideStore } from "@/stores/slide.store";
import HistorySidebar from "../HistorySidebar";

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  onToggle,
  isMobile
}) => {
  const { leftSidebarWidth } = useSlideStore();

  if (!isOpen) return null;

  const mockBranches = ["main", "feature/new-slides", "hotfix/typos"];
  const mockCommitHistory = [
    {
      id: "a1b2c3d",
      message: "スライド5-7の内容を更新",
      author: "田中太郎",
      date: "2025年1月14日 15:30",
      reviewStatus: "approved" as const
    },
    {
      id: "e4f5g6h",
      message: "デザインテンプレートを追加",
      author: "佐藤花子",
      date: "2025年1月14日 10:15",
      reviewStatus: "reviewing" as const
    }
  ];

  return (
    <div 
      className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300`}
      style={{ 
        width: isMobile ? 'min(320px, 85vw)' : `${leftSidebarWidth}px`,
        maxWidth: isMobile ? '85vw' : 'none'
      }}
    >
      <HistorySidebar
        currentBranch="main"
        branches={mockBranches}
        commitHistory={mockCommitHistory}
        onBranchChange={(branch) => console.log('Branch changed:', branch)}
        onClose={onToggle}
      />
    </div>
  );
};

export default LeftSidebar;
