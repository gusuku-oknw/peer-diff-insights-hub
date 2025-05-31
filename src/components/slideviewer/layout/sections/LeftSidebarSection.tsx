
import React from "react";
import { SplitPaneLayout } from "./SplitPaneLayout";
import { LeftSidebarWrapper } from "../LeftSidebarWrapper";
import { useSlideStore } from "@/stores/slide-store";

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
  const { leftSidebarWidth, setLeftSidebarWidth } = useSlideStore();

  return (
    <SplitPaneLayout
      split="vertical"
      minSize={leftSidebarOpen ? 180 : 0}
      maxSize={leftSidebarOpen ? 400 : 0}
      defaultSize={leftSidebarOpen ? leftSidebarWidth : 0}
      size={leftSidebarOpen ? leftSidebarWidth : 0}
      onDragFinished={(size) => {
        if (leftSidebarOpen) {
          setLeftSidebarWidth(size);
        }
      }}
      allowResize={leftSidebarOpen}
      resizerStyle={leftSidebarOpen ? { 
        backgroundColor: '#e5e7eb', 
        width: '4px',
        cursor: 'col-resize'
      } : { display: 'none' }}
      firstPane={
        leftSidebarOpen ? (
          <LeftSidebarWrapper
            currentBranch={currentBranch}
            branches={branches}
            commitHistory={commitHistory}
            leftSidebarOpen={leftSidebarOpen}
            onBranchChange={onBranchChange}
            onToggleLeftSidebar={onToggleLeftSidebar}
          />
        ) : (
          <div style={{ width: 0 }} />
        )
      }
      secondPane={children}
    />
  );
};
