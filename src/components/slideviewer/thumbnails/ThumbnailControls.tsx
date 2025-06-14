
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutGrid, List, Layers, Search, Filter, SortAsc, Settings } from "lucide-react";
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
    compact: Settings
  };

  const handleViewModeChange = (mode: ThumbnailViewMode) => {
    onDisplaySettingsChange({ ...displaySettings, viewMode: mode });
  };

  const handleSearchChange = (value: string) => {
    onSearchFiltersChange({ ...searchFilters, searchText: value });
  };

  const handleFilterChange = (field: string, value: string) => {
    onSearchFiltersChange({ ...searchFilters, [field]: value });
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border-b border-gray-200">
      {/* Header with view mode toggles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            スライド一覧
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
              {slideCount}
            </span>
          </h3>
        </div>

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
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="スライドを検索..."
            value={searchFilters.searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={searchFilters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-40 h-9">
            <Filter className="h-4 w-4 mr-2" />
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
          <SelectTrigger className="w-40 h-9">
            <SortAsc className="h-4 w-4 mr-2" />
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
