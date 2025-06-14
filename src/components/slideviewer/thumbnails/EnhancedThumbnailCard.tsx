
import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Clock, Star, MoreHorizontal, Copy, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EnhancedSlideData, ThumbnailSize } from "@/types/slide.types";

interface EnhancedThumbnailCardProps {
  slide: EnhancedSlideData;
  slideIndex: number;
  thumbnailSize: ThumbnailSize;
  onClick: (slideIndex: number) => void;
  onContextMenu?: (slideIndex: number, action: string) => void;
  userType?: "student" | "enterprise";
  showPreview?: boolean;
}

const EnhancedThumbnailCard = ({ 
  slide, 
  slideIndex, 
  thumbnailSize,
  onClick,
  onContextMenu,
  userType = "enterprise",
  showPreview = false
}: EnhancedThumbnailCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isStudent = userType === "student";
  const isActive = slide.isActive;

  // サイズ設定
  const sizeConfig = {
    compact: { width: 140, height: 79, textSize: 'text-xs', padding: 'p-2' },
    normal: { width: 200, height: 113, textSize: 'text-sm', padding: 'p-3' },
    large: { width: 280, height: 158, textSize: 'text-base', padding: 'p-4' }
  };

  const config = sizeConfig[thumbnailSize];

  // ステータス色の設定
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'archived': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '承認済み';
      case 'review': return 'レビュー中';
      case 'draft': return '下書き';
      case 'archived': return 'アーカイブ';
      default: return status;
    }
  };

  const handleContextAction = (action: string) => {
    onContextMenu?.(slideIndex, action);
  };

  return (
    <div 
      className={`group relative bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
        isActive 
          ? 'border-blue-400 ring-4 ring-blue-100 shadow-lg scale-105 z-10' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-xl hover:scale-102 hover:z-20'
      } ${
        isHovered ? 'shadow-2xl' : 'shadow-sm'
      }`}
      style={{ width: `${config.width}px` }}
      onClick={() => onClick(slideIndex)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`スライド ${slideIndex}: ${slide.title}`}
    >
      {/* アクティブインジケーター */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
      )}

      {/* サムネイル画像 */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {slide.thumbnail ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={slide.thumbnail} 
              alt={`スライド ${slideIndex}`} 
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center ${
                thumbnailSize === 'compact' ? 'w-8 h-8' : thumbnailSize === 'large' ? 'w-16 h-16' : 'w-12 h-12'
              }`}>
                <span className={`font-bold text-blue-600 ${
                  thumbnailSize === 'compact' ? 'text-xs' : thumbnailSize === 'large' ? 'text-xl' : 'text-lg'
                }`}>
                  {slideIndex}
                </span>
              </div>
              {thumbnailSize !== 'compact' && (
                <p className="text-xs text-gray-500 font-medium">スライド {slideIndex}</p>
              )}
            </div>
          </div>
        )}

        {/* 重要マーク */}
        {slide.isImportant && (
          <div className="absolute top-2 left-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current drop-shadow-sm" />
          </div>
        )}

        {/* ステータスバッジ */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant="secondary"
            className={`text-xs font-medium border ${getStatusColor(slide.status)} backdrop-blur-sm`}
          >
            {getStatusText(slide.status)}
          </Badge>
        </div>

        {/* ホバー時のアクションボタン */}
        {isHovered && !isStudent && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleContextAction('duplicate')}>
                  <Copy className="w-4 h-4 mr-2" />
                  複製
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleContextAction('edit')}>
                  編集
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleContextAction('delete')}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* コンテンツエリア */}
      <div className={config.padding}>
        {/* タイトルとスライド番号 */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-gray-800 truncate ${config.textSize} mb-1`} title={slide.title}>
              {slide.title}
            </h4>
            <p className="text-xs text-gray-500">スライド {slideIndex}</p>
          </div>
          
          {/* スライド番号バッジ */}
          <div className={`flex-shrink-0 ml-2 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            isActive 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
          }`}>
            {slideIndex}
          </div>
        </div>

        {/* プログレスバー（学生用） */}
        {isStudent && thumbnailSize !== 'compact' && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>進捗</span>
              <span className="font-medium">{slide.progress}%</span>
            </div>
            <Progress value={slide.progress} className="h-2" />
          </div>
        )}

        {/* 統計情報 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* コメント */}
            {slide.hasComments && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-purple-600">
                    <MessageSquare className="w-3 h-3" />
                    <span className="text-xs font-medium">{slide.commentCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{slide.commentCount}件のコメント</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* レビュー完了 */}
            {slide.isReviewed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>レビュー完了</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* 最終更新時間 */}
          {thumbnailSize !== 'compact' && (
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{slide.lastUpdated}</span>
            </div>
          )}
        </div>
      </div>

      {/* フォーカスインジケーター */}
      <div className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-200 ${
        isActive ? 'ring-2 ring-blue-400 ring-offset-2' : ''
      }`} />
    </div>
  );
};

export default EnhancedThumbnailCard;
