
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitBranch } from "lucide-react";

interface BranchSelectorProps {
  currentBranch: string;
  branches: string[];
  onBranchChange: (branch: string) => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({
  currentBranch,
  branches,
  onBranchChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">ブランチ</span>
      </div>
      <Select value={currentBranch} onValueChange={onBranchChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="ブランチを選択" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch} value={branch}>
              {branch}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelector;
