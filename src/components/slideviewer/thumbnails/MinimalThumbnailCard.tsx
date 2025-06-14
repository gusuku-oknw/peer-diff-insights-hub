
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
}

const MinimalThumbnailCard = ({ 
  slide, 
  slideIndex, 
  isActive, 
  thumbnailWidth, 
  onClick,
  userType = "enterprise"
}: MinimalThumbnailCardProps) => {
  const slideTitle = slide.title || `スライド ${slideIndex}`;
  const showStudentFeatures = userType === "student";
  
  // Improved size classification
  const isSmall = thumbnailWidth < 160;
  const isMedium = thumbnailWidth >= 160 && thumbnailWidth < 200;
  const isLarge = thumbnailWidth >= 200;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`thumbnail-card cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            isActive 
              ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50 shadow-lg scale-105' 
              : 'hover:shadow-lg hover:ring-1 hover:ring-blue-300 hover:ring-offset-1'
          } relative flex-shrink-0 group bg-white rounded-lg`} 
          style={{ width: `${thumbnailWidth}px` }}
          onClick={() => onClick(slideIndex)}
        >
          {/* Thumbnail image with better aspect ratio */}
          <div className="w-full aspect-video bg-white rounded-t-lg border border-gray-200 overflow-hidden shadow-sm">
            {slide.thumbnail ? (
              <img 
                src={slide.thumbnail} 
                alt={`スライド ${slideIndex}`} 
                className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <svg 
                    className={`${
                      isSmall ? 'w-8 h-8' : 
                      isMedium ? 'w-10 h-10' : 
                      'w-12 h-12'
                    } text-gray-300 mx-auto`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isLarge && (
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                      スライド {slideIndex}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Slide information section */}
          <div className="p-3 text-center">
            {/* Slide number badge */}
            <div className={`inline-flex items-center justify-center rounded-full font-bold mb-2 transition-colors duration-200 ${
              isSmall ? 'w-6 h-6 text-xs' : 
              isMedium ? 'w-7 h-7 text-sm' : 
              'w-8 h-8 text-sm'
            } ${
              isActive 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-500 text-white group-hover:bg-blue-400'
            }`}>
              {slideIndex}
            </div>
            
            {/* Title */}
            <p className={`font-medium truncate transition-colors duration-200 ${
              isSmall ? 'text-xs' :
              isMedium ? 'text-sm' :
              'text-sm'
            } ${
              isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
            }`} title={slideTitle}>
              {slideTitle}
            </p>
            
            {/* Status indicators for larger sizes */}
            {(isMedium || isLarge) && (showStudentFeatures || slide.hasComments) && (
              <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                {showStudentFeatures && slide.isReviewed && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    済
                  </span>
                )}
                {slide.hasComments && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    ※
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Compact status indicators for small sizes */}
          {isSmall && (
            <div className="absolute top-2 right-2 flex gap-1">
              {showStudentFeatures && slide.isReviewed && (
                <div className="w-3 h-3 bg-green-500 rounded-full opacity-90 shadow-sm"></div>
              )}
              {slide.hasComments && (
                <div className="w-3 h-3 bg-purple-500 rounded-full opacity-90 shadow-sm"></div>
              )}
            </div>
          )}
          
          {/* Active indicator */}
          {isActive && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg"></div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <div className="text-center">
          <p className="font-medium">{slideTitle}</p>
          <div className="text-xs text-gray-400 mt-1 space-y-1">
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
