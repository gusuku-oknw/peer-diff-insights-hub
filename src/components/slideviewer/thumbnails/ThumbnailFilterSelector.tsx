
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

type FilterMode = 'all' | 'reviewed' | 'unreviewed' | 'commented';

interface ThumbnailFilterSelectorProps {
  filterMode: FilterMode;
  onFilterChange: (filter: FilterMode) => void;
}

const ThumbnailFilterSelector = ({
  filterMode,
  onFilterChange
}: ThumbnailFilterSelectorProps) => {
  return (
    <Select value={filterMode} onValueChange={(value) => onFilterChange(value as FilterMode)}>
      <SelectTrigger className="w-20 h-6 text-xs border-gray-300">
        <Filter className="h-2.5 w-2.5 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">全て</SelectItem>
        <SelectItem value="reviewed">済</SelectItem>
        <SelectItem value="unreviewed">未</SelectItem>
        <SelectItem value="commented">※</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ThumbnailFilterSelector;
