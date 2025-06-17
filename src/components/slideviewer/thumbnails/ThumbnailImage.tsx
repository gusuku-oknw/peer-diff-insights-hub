
import React, { useEffect } from 'react';
import ThumbnailHoverOverlay from './ThumbnailHoverOverlay';
import { useSlideStore } from '@/stores/slide.store';
import { ThumbnailSizeInfo } from './types';

interface ThumbnailImageProps {
  slide: { id: number; thumbnail?: string; html?: string; title?: string };
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
  const { thumbnails, updateThumbnail } = useSlideStore();
  
  // 現在のスライドのサムネイルを取得
  const currentThumbnail = thumbnails[slide.id] || slide.thumbnail;
  
  // サムネイルが存在しない場合に生成
  useEffect(() => {
    if (!currentThumbnail && (slide.html || slide.title)) {
      import('@/utils/slideviewer/thumbnailGenerator').then(({ generateThumbnailFromHTML }) => {
        let htmlContent = slide.html || '';
        
        if (!htmlContent && slide.title) {
          htmlContent = `
            <div style="text-align: center; padding: 40px;">
              <h1 style="color: #333; font-size: 48px; margin-bottom: 20px;">${slide.title}</h1>
              <p style="color: #666; font-size: 24px;">スライド ${slide.id}</p>
            </div>
          `;
        }
        
        if (htmlContent) {
          generateThumbnailFromHTML(htmlContent, {
            width: 320,
            height: 180,
            quality: 0.8
          }).then((thumbnail) => {
            updateThumbnail(slide.id, thumbnail);
          }).catch((error) => {
            console.warn(`Failed to generate thumbnail for slide ${slide.id}:`, error);
          });
        }
      });
    }
  }, [slide.id, slide.html, slide.title, currentThumbnail, updateThumbnail]);

  return (
    <div className="w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl border-b-2 border-gray-100 overflow-hidden shadow-sm relative">
      {currentThumbnail ? (
        <img 
          src={currentThumbnail} 
          alt={`スライド ${slideIndex}`} 
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" 
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            {/* Loading indicator when generating thumbnail */}
            {!currentThumbnail && (slide.html || slide.title) ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-xs text-gray-400 font-medium">
                  生成中...
                </p>
              </div>
            ) : (
              <>
                <svg 
                  className={`${
                    isSmall ? 'w-8 h-8' : 
                    isMedium ? 'w-10 h-10' : 
                    'w-12 h-12'
                  } text-gray-300 mx-auto mb-2`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {(isMedium || isLarge) && (
                  <p className="text-xs text-gray-400 font-medium">
                    スライド {slideIndex}
                  </p>
                )}
              </>
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
