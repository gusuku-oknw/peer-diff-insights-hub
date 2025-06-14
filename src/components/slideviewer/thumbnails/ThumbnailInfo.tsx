
import React from 'react';
import ThumbnailStatusIndicators from './ThumbnailStatusIndicators';
import { ThumbnailSizeInfo } from './types';

interface ThumbnailInfoProps {
  slide: {
    title?: string;
    hasComments?: boolean;
    isReviewed?: boolean;
  };
  slideIndex: number;
  isActive: boolean;
  sizeInfo: ThumbnailSizeInfo;
  userType: "student" | "enterprise";
}

const ThumbnailInfo = ({
  slide,
  slideIndex,
  isActive,
  sizeInfo,
  userType
}: ThumbnailInfoProps) => {
  const { isSmall, isMedium, isLarge } = sizeInfo;
  const slideTitle = slide.title || `スライド ${slideIndex}`;

  return (
    <div className="p-1.5 text-center bg-white">
      {/* Smaller slide number badge */}
      <div className={`inline-flex items-center justify-center rounded-full font-bold mb-1 transition-all duration-300 shadow-sm ${
        isSmall ? 'w-4 h-4 text-xs' : 
        isMedium ? 'w-5 h-5 text-xs' : 
        'w-5 h-5 text-xs'
      } ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md ring-2 ring-blue-200' 
          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white group-hover:from-blue-400 group-hover:to-blue-500'
      }`}>
        {slideIndex}
      </div>
      
      {/* Smaller title with compact typography */}
      <p className={`font-medium truncate transition-colors duration-300 text-xs ${
        isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
      }`} title={slideTitle}>
        {slideTitle}
      </p>
      
      {/* Status indicators for medium and large sizes */}
      <ThumbnailStatusIndicators
        slide={slide}
        sizeInfo={sizeInfo}
        userType={userType}
      />
    </div>
  );
};

export default ThumbnailInfo;
