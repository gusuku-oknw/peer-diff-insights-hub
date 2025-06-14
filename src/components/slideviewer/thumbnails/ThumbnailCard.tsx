
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ThumbnailImage from './ThumbnailImage';
import ThumbnailInfo from './ThumbnailInfo';
import ThumbnailStatusIndicators from './ThumbnailStatusIndicators';
import { ThumbnailCardProps, ThumbnailSizeInfo } from './types';

const ThumbnailCard = ({ 
  slide, 
  slideIndex, 
  isActive, 
  thumbnailWidth, 
  onClick,
  userType = "enterprise",
  showHoverActions = true
}: ThumbnailCardProps) => {
  const slideTitle = slide.title || `スライド ${slideIndex}`;
  const showStudentFeatures = userType === "student";
  
  // Improved size classification with better thresholds
  const sizeInfo: ThumbnailSizeInfo = {
    isSmall: thumbnailWidth < 140,
    isMedium: thumbnailWidth >= 140 && thumbnailWidth < 180,
    isLarge: thumbnailWidth >= 180
  };

  const handlePreview = (slideIndex: number) => {
    console.log(`Preview slide ${slideIndex}`);
    // Implement preview logic
  };

  const handleComment = (slideIndex: number) => {
    console.log(`Comment on slide ${slideIndex}`);
    // Implement comment logic
  };

  const handleEdit = (slideIndex: number) => {
    console.log(`Edit slide ${slideIndex}`);
    // Implement edit logic
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`thumbnail-card cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-10 ${
            isActive 
              ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50 shadow-xl scale-105 z-10' 
              : 'hover:shadow-xl hover:ring-2 hover:ring-blue-300 hover:ring-offset-2'
          } relative flex-shrink-0 group bg-white rounded-xl overflow-hidden`} 
          style={{ width: `${thumbnailWidth}px` }}
          onClick={() => onClick(slideIndex)}
          role="button"
          tabIndex={0}
          aria-label={`${slideTitle}に移動`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick(slideIndex);
            }
          }}
        >
          {/* Enhanced thumbnail image container */}
          <ThumbnailImage
            slide={slide}
            slideIndex={slideIndex}
            sizeInfo={sizeInfo}
            showHoverActions={showHoverActions}
            userType={userType}
            onPreview={handlePreview}
            onComment={handleComment}
            onEdit={handleEdit}
          />
          
          {/* Compact slide information section with reduced padding */}
          <ThumbnailInfo
            slide={slide}
            slideIndex={slideIndex}
            isActive={isActive}
            sizeInfo={sizeInfo}
            userType={userType}
          />
          
          {/* Smaller compact status indicators for small sizes */}
          {sizeInfo.isSmall && (
            <ThumbnailStatusIndicators
              slide={slide}
              sizeInfo={sizeInfo}
              userType={userType}
            />
          )}
          
          {/* Enhanced active indicator with gradient */}
          {isActive && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-t-xl shadow-sm"></div>
          )}
          
          {/* Focus ring for accessibility */}
          <div className="absolute inset-0 rounded-xl ring-2 ring-offset-2 ring-transparent transition-all duration-200 focus-within:ring-blue-500"></div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-gray-900 text-white border-gray-700">
        <div className="text-center">
          <p className="font-medium">{slideTitle}</p>
          <div className="text-xs text-gray-300 mt-1 space-y-1">
            {slide.hasComments && <div>コメントあり</div>}
            {showStudentFeatures && slide.isReviewed && <div>レビュー完了</div>}
            <div>クリックして表示</div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThumbnailCard;
