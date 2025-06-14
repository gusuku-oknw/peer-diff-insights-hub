
import React from 'react';
import { ThumbnailSizeInfo } from './types';

interface ThumbnailStatusIndicatorsProps {
  slide: {
    hasComments?: boolean;
    isReviewed?: boolean;
  };
  sizeInfo: ThumbnailSizeInfo;
  userType: "student" | "enterprise";
}

const ThumbnailStatusIndicators = ({
  slide,
  sizeInfo,
  userType
}: ThumbnailStatusIndicatorsProps) => {
  const { isSmall, isMedium, isLarge } = sizeInfo;
  const showStudentFeatures = userType === "student";

  // For medium and large sizes, show inline indicators
  if ((isMedium || isLarge) && (showStudentFeatures || slide.hasComments)) {
    return (
      <div className="mt-1 flex items-center justify-center gap-1 text-xs">
        {showStudentFeatures && slide.isReviewed && (
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full shadow-sm border border-green-200">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-sm animate-pulse"></div>
            <span className="text-xs">済</span>
          </span>
        )}
        {slide.hasComments && (
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full shadow-sm border border-purple-200">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-sm"></div>
            <span className="text-xs">※</span>
          </span>
        )}
      </div>
    );
  }

  // For small sizes, show compact absolute positioned indicators
  if (isSmall) {
    return (
      <div className="absolute top-1.5 right-1.5 flex gap-0.5">
        {showStudentFeatures && slide.isReviewed && (
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-md border border-white animate-pulse"></div>
        )}
        {slide.hasComments && (
          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full shadow-md border border-white"></div>
        )}
      </div>
    );
  }

  return null;
};

export default ThumbnailStatusIndicators;
