
import React from 'react';
import { MessageSquare, CheckCircle, Clock, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import type { ThumbnailViewMode } from "@/types/slide-viewer/thumbnail.types";

interface SlideData {
  id: number;
  title?: string;
  thumbnail?: string;
  elements?: any[];
  hasComments?: boolean;
  commentCount?: number;
  isReviewed?: boolean;
  progress?: number;
  lastUpdated?: string;
  isImportant?: boolean;
  status?: 'draft' | 'review' | 'approved';
}

interface EnhancedThumbnailCardProps {
  slide: SlideData;
  slideIndex: number;
  isActive: boolean;
  viewMode: ThumbnailViewMode;
  thumbnailSize: 'small' | 'medium' | 'large';
  showDetails: boolean;
  onClick: (slideIndex: number) => void;
  userType?: "student" | "enterprise";
}

const EnhancedThumbnailCard = ({ 
  slide, 
  slideIndex, 
  isActive, 
  viewMode,
  thumbnailSize,
  showDetails,
  onClick,
  userType = "enterprise"
}: EnhancedThumbnailCardProps) => {
  const slideTitle = slide.title || `スライド ${slideIndex}`;
  const progress = slide.progress || Math.floor(Math.random() * 100);
  const commentCount = slide.commentCount || Math.floor(Math.random() * 5);
  const isStudent = userType === "student";

  // サイズ設定
  const sizeConfig = {
    small: { width: 120, height: 68, textSize: 'text-xs' },
    medium: { width: 160, height: 90, textSize: 'text-sm' },
    large: { width: 200, height: 113, textSize: 'text-base' }
  };

  const config = sizeConfig[thumbnailSize];

  // ビューモード別レイアウト
  const isListView = viewMode === 'list';
  const isCompactView = viewMode === 'compact';
  const isGridView = viewMode === 'grid';

  if (isListView) {
    return (
      <div 
        className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
          isActive 
            ? 'border-blue-400 bg-blue-50 shadow-md' 
            : 'border-gray-200 hover:border-blue-200 hover:shadow-sm bg-white'
        }`}
        onClick={() => onClick(slideIndex)}
      >
        {/* サムネイル */}
        <div 
          className="flex-shrink-0 bg-white rounded-lg border overflow-hidden"
          style={{ width: config.width * 0.7, height: config.height * 0.7 }}
        >
          {slide.thumbnail ? (
            <img 
              src={slide.thumbnail} 
              alt={`スライド ${slideIndex}`} 
              className="object-cover w-full h-full" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <span className="text-gray-400 font-bold">{slideIndex}</span>
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
              {slideIndex}
            </span>
            {slide.isImportant && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
            {slide.isReviewed && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
          
          <h4 className={`font-medium ${config.textSize} text-gray-800 truncate mb-1`}>
            {slideTitle}
          </h4>
          
          {showDetails && (
            <div className="space-y-2">
              {isStudent && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">進捗:</span>
                  <Progress value={progress} className="h-2 flex-1" />
                  <span className="text-xs text-gray-600 font-medium">{progress}%</span>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {commentCount > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{commentCount}</span>
                  </div>
                )}
                {slide.lastUpdated && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{slide.lastUpdated}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isCompactView) {
    return (
      <div 
        className={`flex items-center gap-3 p-2 rounded-md transition-all duration-200 cursor-pointer ${
          isActive 
            ? 'bg-blue-50 text-blue-700' 
            : 'hover:bg-gray-50'
        }`}
        onClick={() => onClick(slideIndex)}
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
          {slideIndex}
        </div>
        <span className="text-sm font-medium truncate flex-1">{slideTitle}</span>
        <div className="flex items-center gap-1">
          {slide.isReviewed && <CheckCircle className="w-3 h-3 text-green-500" />}
          {commentCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare className="w-3 h-3" />
              <span>{commentCount}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid/Horizontal view (default)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`thumbnail-card cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            isActive 
              ? 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50 shadow-lg scale-105' 
              : 'hover:shadow-md hover:ring-1 hover:ring-blue-200 hover:ring-offset-1'
          } relative flex-shrink-0 group bg-white rounded-lg border-2 border-gray-200 overflow-hidden`} 
          style={{ width: `${config.width}px` }}
          onClick={() => onClick(slideIndex)}
        >
          {/* サムネイル */}
          <div className="w-full aspect-video bg-gray-50 overflow-hidden">
            {slide.thumbnail ? (
              <img 
                src={slide.thumbnail} 
                alt={`スライド ${slideIndex}`} 
                className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-lg font-bold">{slideIndex}</span>
              </div>
            )}
          </div>
          
          {/* コンテンツ */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                isActive 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-400 text-white group-hover:bg-blue-400'
              }`}>
                {slideIndex}
              </span>
              
              <div className="flex items-center gap-1">
                {slide.isImportant && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                {slide.isReviewed && <CheckCircle className="w-3 h-3 text-green-500" />}
                {commentCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-purple-500">
                    <MessageSquare className="w-3 h-3" />
                    <span>{commentCount}</span>
                  </div>
                )}
              </div>
            </div>
            
            <h4 className={`font-medium ${config.textSize} text-gray-800 truncate mb-2`}>
              {slideTitle}
            </h4>
            
            {showDetails && isStudent && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>進捗</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            )}
          </div>
          
          {/* アクティブインジケーター */}
          {isActive && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <div className="text-center">
          <p className="font-medium">{slideTitle}</p>
          {showDetails && (
            <div className="text-xs text-gray-400 mt-1 space-y-1">
              {isStudent && <div>進捗: {progress}%</div>}
              {commentCount > 0 && <div>{commentCount}コメント</div>}
              {slide.lastUpdated && <div>更新: {slide.lastUpdated}</div>}
              <div>クリックして表示</div>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default EnhancedThumbnailCard;
