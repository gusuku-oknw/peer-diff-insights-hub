
import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { LeftSidebarWrapper } from "../LeftSidebarWrapper";

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
  if (!leftSidebarOpen) {
    return (
      <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={25}
          minSize={15}
          maxSize={35}
          className="min-w-[180px] max-w-[400px] transition-all duration-300 ease-in-out"
        >
          <LeftSidebarWrapper
            currentBranch={currentBranch}
            branches={branches}
            commitHistory={commitHistory}
            leftSidebarOpen={leftSidebarOpen}
            onBranchChange={onBranchChange}
            onToggleLeftSidebar={onToggleLeftSidebar}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle className="hover:bg-blue-200 transition-colors duration-200" />
        
        <ResizablePanel defaultSize={75} minSize={65}>
          <div className="flex-1 min-w-0 h-full transition-all duration-300 ease-in-out">
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
