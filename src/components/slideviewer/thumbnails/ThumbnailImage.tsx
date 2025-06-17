
import React from 'react';
import ThumbnailHoverOverlay from './ThumbnailHoverOverlay';
import { ThumbnailSizeInfo } from './types';

interface ThumbnailImageProps {
  slide: { thumbnail?: string };
  slideIndex: number;
  sizeInfo: ThumbnailSizeInfo;
  showHoverActions: boolean;
  userType: "student" | "enterprise";
  onPreview: (slideIndex: number) => void;
  onComment: (slideIndex: number) => void;
  onEdit: (slideIndex: number) => void;
}

const ThumbnailImage = ({
  slide,
  slideIndex,
  sizeInfo,
  showHoverActions,
  userType,
  onPreview,
  onComment,
  onEdit
}: ThumbnailImageProps) => {
  const { isSmall, isMedium, isLarge } = sizeInfo;

  return (
    <div className="w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl border-b-2 border-gray-100 overflow-hidden shadow-sm relative">
      {slide.thumbnail ? (
        <img 
          src={slide.thumbnail} 
          alt={`スライド ${slideIndex}`} 
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" 
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <svg 
              className={`${
                isSmall ? 'w-6 h-6' : 
                isMedium ? 'w-8 h-8' : 
                'w-10 h-10'
              } text-gray-300 mx-auto mb-1`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isLarge && (
              <p className="text-xs text-gray-400 font-medium">
                スライド {slideIndex}
              </p>
            )}
          </div>
        </div>
      )}
      
      {showHoverActions && (
        <ThumbnailHoverOverlay
          slideIndex={slideIndex}
          onPreview={onPreview}
          onComment={onComment}
          onEdit={onEdit}
          userType={userType}
        />
      )}
    </div>
  );
};

export default ThumbnailImage;
