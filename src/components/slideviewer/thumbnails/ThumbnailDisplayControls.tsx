
import React from 'react';
import { Search, Filter, SortAsc, Grid3X3, List, LayoutGrid, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex flex-col gap-4 p-4 bg-white border-b border-gray-200">
      {/* ヘッダー行 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800">スライド一覧</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {filteredCount === slideCount ? slideCount : `${filteredCount}/${slideCount}`}
          </Badge>
          {filteredCount !== slideCount && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              フィルタ中
            </Badge>
          )}
        </div>

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
      </div>

      {/* コントロール行 */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* 検索 */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="スライドを検索..."
            value={options.searchQuery}
            onChange={(e) => updateOptions({ searchQuery: e.target.value })}
            className="pl-10 h-9"
          />
          {options.searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => updateOptions({ searchQuery: '' })}
            >
              ×
            </Button>
          )}
        </div>

        {/* フィルター */}
        <Select
          value={options.filter}
          onValueChange={(value) => updateOptions({ filter: value as ThumbnailFilter })}
        >
          <SelectTrigger className="w-40 h-9">
            <Filter className="h-4 w-4 mr-2" />
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
          <SelectTrigger className="w-40 h-9">
            <SortAsc className="h-4 w-4 mr-2" />
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
                className="h-9"
                onClick={() => updateOptions({ 
                  filter: options.filter === 'important' ? 'all' : 'important' 
                })}
              >
                <Star className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>重要なスライドのみ表示</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* アクティブフィルターの表示 */}
      {(options.filter !== 'all' || options.searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">アクティブフィルター:</span>
          
          {options.filter !== 'all' && (
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200"
              onClick={() => updateOptions({ filter: 'all' })}
            >
              {filterLabels[options.filter]} ×
            </Badge>
          )}
          
          {options.searchQuery && (
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-700 cursor-pointer hover:bg-green-200"
              onClick={() => updateOptions({ searchQuery: '' })}
            >
              検索: "{options.searchQuery}" ×
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-gray-500 hover:text-gray-700"
            onClick={() => updateOptions({ filter: 'all', searchQuery: '' })}
          >
            すべてクリア
          </Button>
        </div>
      )}
    </div>
  );
};

export default ThumbnailDisplayControls;
