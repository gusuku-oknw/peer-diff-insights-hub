
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
  
  // 改善されたサイズ分類（大幅に拡大されたサイズに対応）
  const isSmall = thumbnailWidth < 180;      // 従来の120未満
  const isMedium = thumbnailWidth >= 180 && thumbnailWidth < 240; // 従来の120-160
  const isLarge = thumbnailWidth >= 240;     // 新しいカテゴリ

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
          {/* サムネイル画像（大きめサイズ対応） */}
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
                  <svg 
                    className={`${
                      isSmall ? 'w-6 h-6' : 
                      isMedium ? 'w-8 h-8' : 
                      'w-10 h-10'
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
          
          {/* スライド情報（拡大版対応） */}
          <div className="text-center">
            {/* スライド番号バッジ（大きめ） */}
            <div className={`inline-flex items-center justify-center rounded-full font-bold mb-2 transition-colors duration-200 ${
              isSmall ? 'w-6 h-6 text-xs' : 
              isMedium ? 'w-8 h-8 text-sm' : 
              'w-10 h-10 text-base'
            } ${
              isActive 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-400 text-white group-hover:bg-blue-400'
            }`}>
              {slideIndex}
            </div>
            
            {/* タイトル（大きめサイズで常に表示） */}
            <p className={`font-medium truncate transition-colors duration-200 ${
              isSmall ? 'text-xs' :
              isMedium ? 'text-sm' :
              'text-base'
            } ${
              isActive ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-800'
            }`} title={slideTitle}>
              {slideTitle}
            </p>
            
            {/* 詳細情報（大きめサイズの場合に表示） */}
            {isLarge && (showStudentFeatures || slide.hasComments) && (
              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
                {showStudentFeatures && slide.isReviewed && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    レビュー済
                  </span>
                )}
                {slide.hasComments && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    コメント
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* ステータスインジケーター（小さめサイズ用） */}
          {!isLarge && (
            <div className="absolute top-2 right-2 flex gap-1">
              {showStudentFeatures && slide.isReviewed && (
                <div className="w-3 h-3 bg-green-500 rounded-full opacity-80"></div>
              )}
              {slide.hasComments && (
                <div className="w-3 h-3 bg-purple-500 rounded-full opacity-80"></div>
              )}
            </div>
          )}
          
          {/* アクティブインジケーター */}
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
