
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface SlideData {
  id: number;
  title?: string;
  thumbnail?: string;
  elements?: any[];
  hasComments?: boolean;
  commentCount?: number;
  isReviewed?: boolean;
}

interface ThumbnailCardProps {
  slide: SlideData;
  slideIndex: number;
  isActive: boolean;
  thumbnailWidth: number;
  onClick: (slideIndex: number) => void;
  userType?: "student" | "enterprise";
}

const ThumbnailCard = ({ 
  slide, 
  slideIndex, 
  isActive, 
  thumbnailWidth, 
  onClick,
  userType = "enterprise"
}: ThumbnailCardProps) => {
  const slideTitle = slide.title || `スライド ${slideIndex}`;
  const commentCount = slide.commentCount || 0;
  const isReviewed = slide.isReviewed || false;
  const showStudentFeatures = userType === "student";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`thumbnail-card cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            isActive 
              ? 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50 shadow-lg scale-105' 
              : 'hover:shadow-md hover:ring-1 hover:ring-blue-200 hover:ring-offset-1'
          } relative flex-shrink-0 group`} 
          style={{ width: `${thumbnailWidth}px` }}
          onClick={() => onClick(slideIndex)}
        >
          {/* Uncommented badge for students */}
          {showStudentFeatures && !isReviewed && (
            <div className="absolute -top-2 -right-2 z-10">
              <Badge variant="destructive" className="rounded-full h-6 w-6 p-0 flex items-center justify-center text-xs font-bold animate-pulse">
                未
              </Badge>
            </div>
          )}

          {/* Reviewed badge for students */}
          {showStudentFeatures && isReviewed && (
            <div className="absolute -top-2 -right-2 z-10">
              <Badge className="bg-green-500 rounded-full h-6 w-6 p-0 flex items-center justify-center text-white">
                <CheckCircle className="h-3 w-3" />
              </Badge>
            </div>
          )}

          {/* Thumbnail container */}
          <div className="w-full aspect-video bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm mb-3">
            {slide.thumbnail ? (
              <img 
                src={slide.thumbnail} 
                alt={`スライド ${slideIndex}`} 
                className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-400 text-xs">No Preview</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Slide info and number at bottom */}
          <div className="text-center">
            {/* Slide number badge */}
            <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mb-2 ${
              isActive 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-400 text-white group-hover:bg-blue-400'
            } transition-colors duration-200`}>
              {slideIndex}
            </div>
            
            <p className={`text-xs font-medium truncate transition-colors duration-200 ${
              isActive ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-800'
            }`}>
              {slideTitle}
            </p>
            
            {/* Status indicators */}
            <div className="flex items-center justify-center gap-2 mt-2">
              {slide.elements && slide.elements.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                  {slide.elements.length}
                </span>
              )}
              
              {/* Comment count for students */}
              {showStudentFeatures && commentCount > 0 && (
                <div className="flex items-center text-purple-500">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">{commentCount}</span>
                </div>
              )}

              {/* Generic comment indicator for enterprise */}
              {!showStudentFeatures && slide.hasComments && (
                <div className="flex items-center text-purple-500">
                  <MessageSquare className="h-3 w-3" />
                </div>
              )}
            </div>
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
          {showStudentFeatures && (
            <div className="text-xs text-gray-400 mt-1">
              {isReviewed ? `完了 (${commentCount}コメント)` : "未レビュー"}
            </div>
          )}
          <p className="text-xs text-gray-400">クリックして表示</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThumbnailCard;
