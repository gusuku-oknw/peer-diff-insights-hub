
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ThumbnailHoverOverlay from './ThumbnailHoverOverlay';

interface SlideData {
  id: number;
  title?: string;
  thumbnail?: string;
  elements?: any[];
  hasComments?: boolean;
  isReviewed?: boolean;
}

interface MinimalThumbnailCardProps {
  slide: SlideData;
  slideIndex: number;
  isActive: boolean;
  thumbnailWidth: number;
  onClick: (slideIndex: number) => void;
  userType?: "student" | "enterprise";
  showHoverActions?: boolean;
}

const MinimalThumbnailCard = ({ 
  slide, 
  slideIndex, 
  isActive, 
  thumbnailWidth, 
  onClick,
  userType = "enterprise",
  showHoverActions = true
}: MinimalThumbnailCardProps) => {
  const slideTitle = slide.title || `スライド ${slideIndex}`;
  const showStudentFeatures = userType === "student";
  
  // Improved size classification with better thresholds
  const isSmall = thumbnailWidth < 140;
  const isMedium = thumbnailWidth >= 140 && thumbnailWidth < 180;
  const isLarge = thumbnailWidth >= 180;

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
            
            {/* Hover overlay for actions */}
            {showHoverActions && (
              <ThumbnailHoverOverlay
                slideIndex={slideIndex}
                onPreview={handlePreview}
                onComment={handleComment}
                onEdit={handleEdit}
                userType={userType}
              />
            )}
          </div>
          
          {/* Compact slide information section with reduced padding */}
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
            
            {/* Compact status indicators for medium and large sizes */}
            {(isMedium || isLarge) && (showStudentFeatures || slide.hasComments) && (
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
            )}
          </div>
          
          {/* Smaller compact status indicators for small sizes */}
          {isSmall && (
            <div className="absolute top-1.5 right-1.5 flex gap-0.5">
              {showStudentFeatures && slide.isReviewed && (
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-md border border-white animate-pulse"></div>
              )}
              {slide.hasComments && (
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full shadow-md border border-white"></div>
              )}
            </div>
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

export default MinimalThumbnailCard;
