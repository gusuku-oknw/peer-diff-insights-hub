
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutGrid, List, Layers, Filter, SortAsc } from "lucide-react";
import type { ThumbnailControlsProps, ThumbnailViewMode } from "@/types/slide-viewer/thumbnail.types";

const ThumbnailControls: React.FC<ThumbnailControlsProps> = ({
  displaySettings,
  searchFilters,
  onDisplaySettingsChange,
  onSearchFiltersChange,
  slideCount,
  userType = "enterprise"
}) => {
  const viewModeIcons = {
    horizontal: Layers,
    grid: LayoutGrid,
    list: List,
    compact: LayoutGrid
  };

  const handleViewModeChange = (mode: ThumbnailViewMode) => {
    onDisplaySettingsChange({ ...displaySettings, viewMode: mode });
  };

  const handleFilterChange = (field: string, value: string) => {
    onSearchFiltersChange({ ...searchFilters, [field]: value });
  };

  return (
    <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {Object.entries(viewModeIcons).map(([mode, Icon]) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant={displaySettings.viewMode === mode ? "default" : "ghost"}
                size="sm"
                className={`h-8 w-8 p-0 ${
                  displaySettings.viewMode === mode
                    ? "bg-white shadow-sm text-blue-600"
                    : "hover:bg-white/50"
                }`}
                onClick={() => handleViewModeChange(mode as ThumbnailViewMode)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {mode === 'horizontal' && '水平スクロール'}
              {mode === 'grid' && 'グリッドビュー'}
              {mode === 'list' && 'リストビュー'}
              {mode === 'compact' && 'コンパクト'}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex items-center gap-2">
        {/* Status Filter */}
        <Select
          value={searchFilters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-32 h-8">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="reviewed">レビュー済み</SelectItem>
            <SelectItem value="unreviewed">未レビュー</SelectItem>
            <SelectItem value="commented">コメント有り</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={`${searchFilters.sortBy}-${searchFilters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-');
            onSearchFiltersChange({
              ...searchFilters,
              sortBy: sortBy as any,
              sortOrder: sortOrder as any
            });
          }}
        >
          <SelectTrigger className="w-32 h-8">
            <SortAsc className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created-desc">作成日(新)</SelectItem>
            <SelectItem value="created-asc">作成日(旧)</SelectItem>
            <SelectItem value="updated-desc">更新日(新)</SelectItem>
            <SelectItem value="updated-asc">更新日(旧)</SelectItem>
            <SelectItem value="title-asc">タイトル(A-Z)</SelectItem>
            <SelectItem value="title-desc">タイトル(Z-A)</SelectItem>
            {userType === "student" && (
              <SelectItem value="progress-desc">進捗(高)</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ThumbnailControls;
