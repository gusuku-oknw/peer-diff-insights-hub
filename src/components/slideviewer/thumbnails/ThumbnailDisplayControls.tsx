
import React from 'react';
import { Filter, SortAsc, Grid3X3, List, LayoutGrid, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ThumbnailDisplayOptions, ThumbnailSize, ThumbnailFilter, ThumbnailSort } from "@/types/slide.types";

interface ThumbnailDisplayControlsProps {
  options: ThumbnailDisplayOptions;
  onOptionsChange: (options: ThumbnailDisplayOptions) => void;
  slideCount: number;
  filteredCount: number;
  userType?: "student" | "enterprise";
}

const ThumbnailDisplayControls = ({ 
  options, 
  onOptionsChange, 
  slideCount, 
  filteredCount,
  userType = "enterprise"
}: ThumbnailDisplayControlsProps) => {
  const isStudent = userType === "student";

  const updateOptions = (updates: Partial<ThumbnailDisplayOptions>) => {
    onOptionsChange({ ...options, ...updates });
  };

  const sizeIcons = {
    compact: Grid3X3,
    normal: LayoutGrid,
    large: List
  };

  const filterLabels = {
    all: 'すべて',
    reviewed: 'レビュー済み',
    unreviewed: '未レビュー',
    commented: 'コメント有り',
    important: '重要'
  };

  const sortLabels = {
    created: '作成日',
    updated: '更新日',
    title: 'タイトル',
    progress: '進捗',
    status: 'ステータス'
  };

  return (
    <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200">
      {/* サイズ切り替え */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {Object.entries(sizeIcons).map(([size, Icon]) => (
          <Tooltip key={size}>
            <TooltipTrigger asChild>
              <Button
                variant={options.size === size ? "default" : "ghost"}
                size="sm"
                className={`h-8 w-8 p-0 ${
                  options.size === size
                    ? "bg-white shadow-sm text-blue-600"
                    : "hover:bg-white/50"
                }`}
                onClick={() => updateOptions({ size: size as ThumbnailSize })}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {size === 'compact' && 'コンパクト表示'}
              {size === 'normal' && '標準表示'}
              {size === 'large' && '大きい表示'}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* フィルターとソート */}
      <div className="flex items-center gap-2">
        {/* フィルター */}
        <Select
          value={options.filter}
          onValueChange={(value) => updateOptions({ filter: value as ThumbnailFilter })}
        >
          <SelectTrigger className="w-32 h-8">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(filterLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ソート */}
        <Select
          value={`${options.sort}-${options.sortOrder}`}
          onValueChange={(value) => {
            const [sort, sortOrder] = value.split('-');
            updateOptions({ 
              sort: sort as ThumbnailSort, 
              sortOrder: sortOrder as 'asc' | 'desc' 
            });
          }}
        >
          <SelectTrigger className="w-32 h-8">
            <SortAsc className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sortLabels).map(([value, label]) => (
              <React.Fragment key={value}>
                <SelectItem value={`${value}-desc`}>{label}(新)</SelectItem>
                <SelectItem value={`${value}-asc`}>{label}(旧)</SelectItem>
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>

        {/* 重要なスライドのみ表示 */}
        {!isStudent && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={options.filter === 'important' ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateOptions({ 
                  filter: options.filter === 'important' ? 'all' : 'important' 
                })}
              >
                <Star className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>重要なスライドのみ表示</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default ThumbnailDisplayControls;
