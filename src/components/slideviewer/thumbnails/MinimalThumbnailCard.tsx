
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
  
  // Dynamic scaling based on thumbnail width
  const isSmall = thumbnailWidth < 120;
  const isMedium = thumbnailWidth >= 120 && thumbnailWidth < 160;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`thumbnail-card cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            isActive 
              ? 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50 shadow-lg scale-105' 
              : 'hover:shadow-md hover:ring-1 hover:ring-blue-200 hover:ring-offset-1'
          } relative flex-shrink-0 group`} 
          style={{ width: `${thumbnailWidth}px` }}
          onClick={() => onClick(slideIndex)}
        >
          {/* Thumbnail container with responsive aspect ratio */}
          <div className="w-full aspect-video bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm mb-2">
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
                    className={`${isSmall ? 'w-4 h-4' : isMedium ? 'w-6 h-6' : 'w-8 h-8'} text-gray-300 mx-auto`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {/* Minimalist slide info */}
          <div className="text-center">
            {/* Slide number badge - clean and minimal */}
            <div className={`inline-flex items-center justify-center rounded-full font-bold mb-1 transition-colors duration-200 ${
              isSmall ? 'w-5 h-5 text-xs' : isMedium ? 'w-6 h-6 text-xs' : 'w-7 h-7 text-sm'
            } ${
              isActive 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-400 text-white group-hover:bg-blue-400'
            }`}>
              {slideIndex}
            </div>
            
            {/* Title - minimal and clean */}
            {!isSmall && (
              <p className={`font-medium truncate transition-colors duration-200 text-xs ${
                isActive ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-800'
              }`} title={slideTitle}>
                {slideTitle}
              </p>
            )}
          </div>
          
          {/* Minimal status indicators */}
          <div className="absolute top-1 right-1 flex gap-1">
            {/* Review status for students - minimal dot indicator */}
            {showStudentFeatures && slide.isReviewed && (
              <div className="w-2 h-2 bg-green-500 rounded-full opacity-80"></div>
            )}
            
            {/* Comment indicator - minimal dot */}
            {slide.hasComments && (
              <div className="w-2 h-2 bg-purple-500 rounded-full opacity-80"></div>
            )}
          </div>
          
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
