
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSlideStore } from "@/stores/slideStore";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, Plus, MoreVertical, Info, Star, FileText, BarChart3, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideThumbnailsProps {
  slides?: any[];
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview?: () => void;
  height?: number;
  onHeightChange?: (height: number) => void;
  containerWidth?: number;
}

const SlideThumbnails = ({
  slides: propSlides,
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height = 128,
  onHeightChange,
  containerWidth
}: SlideThumbnailsProps) => {
  const storeSlides = useSlideStore(state => state.slides);
  const generateThumbnails = useSlideStore(state => state.generateThumbnails);
  const [isResizing, setIsResizing] = useState(false);
  
  // Use props slides if provided, otherwise use store slides
  const slides = propSlides || storeSlides;
  
  // Generate thumbnails when component mounts
  useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onHeightChange) return;
    
    setIsResizing(true);
    const startY = e.clientY;
    const startHeight = height;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startY - e.clientY; // Inverted because we want to drag up to increase height
      const newHeight = Math.max(80, Math.min(400, startHeight + deltaY));
      onHeightChange(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Calculate dynamic width based on container
  const getContainerWidth = () => {
    if (containerWidth) return containerWidth;
    return typeof window !== 'undefined' ? window.innerWidth - 100 : 1200; // Fallback with padding
  };

  const thumbnailWidth = height > 150 ? 160 : 120;
  const gap = height > 150 ? 24 : 16;
  const totalItemsWidth = (slides.length + 2) * (thumbnailWidth + gap);
  const dynamicWidth = Math.max(getContainerWidth(), totalItemsWidth);
  
  return (
    <div className="modern-thumbnails bg-white flex flex-col border-t border-gray-200 shadow-sm w-full" style={{ height: `${height}px` }}>
      {/* Resize handle */}
      {onHeightChange && (
        <div 
          className={`flex items-center justify-center h-2 bg-gray-100 border-b border-gray-200 cursor-row-resize hover:bg-gray-200 transition-colors ${isResizing ? 'bg-blue-100' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <GripVertical className="h-3 w-3 text-gray-400 rotate-90" />
        </div>
      )}

      <div className="flex justify-between items-center px-4 lg:px-6 py-2 lg:py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="font-semibold flex items-center text-sm text-gray-800">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          スライド一覧
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
            {slides.length}
          </span>
        </h3>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>新しいスライドを追加</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>その他のオプション</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {/* 横スクロール対応のスライド一覧 */}
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full w-full" orientation="horizontal">
          <div 
            className="flex gap-4 lg:gap-6 p-4 lg:p-6 pb-4" 
            style={{ width: `${dynamicWidth}px`, minWidth: '100%' }}
          >
            {slides.map((slide, index) => {
              const slideIndex = slide.id;
              const slideTitle = slide.title || `スライド ${slideIndex}`;
              const isActive = currentSlide === slideIndex;
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`thumbnail-card cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        isActive 
                          ? 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50 shadow-lg scale-105' 
                          : 'hover:shadow-md hover:ring-1 hover:ring-blue-200 hover:ring-offset-1'
                      } relative flex-shrink-0 group`} 
                      style={{ width: `${thumbnailWidth}px` }}
                      onClick={() => onSlideClick(slideIndex)}
                    >
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
                        {/* Slide number badge - now at bottom */}
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
                          
                          {slide.hasComments && (
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
                      <p className="text-xs text-gray-400">クリックして表示</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            
            {/* Add new slide button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="thumbnail-card flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50" style={{ width: `${thumbnailWidth}px` }}>
                  <div className="w-full aspect-video flex items-center justify-center mb-3">
                    <div className="text-center">
                      <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-500">新規スライド</span>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>新しいスライドを追加</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Info slide for presentation evaluation */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="thumbnail-card flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 border-2 border-dashed border-purple-300 hover:border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100"
                  style={{ width: `${thumbnailWidth}px` }}
                  onClick={() => {
                    console.log("Opening presentation evaluation");
                    onOpenOverallReview?.();
                  }}
                >
                  <div className="w-full aspect-video flex items-center justify-center p-3 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="w-3 h-3 lg:w-4 lg:h-4 text-purple-500 mr-1" />
                        <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4 text-purple-500 mr-1" />
                        <FileText className="w-3 h-3 lg:w-4 lg:h-4 text-purple-500" />
                      </div>
                      <span className="text-xs text-purple-700 font-medium">プレゼン評価</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mb-2 bg-purple-500 text-white shadow-md">
                      <Info className="h-3 w-3" />
                    </div>
                    <p className="text-xs font-medium text-purple-700">
                      全体評価・コメント
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-medium">プレゼンテーション評価</p>
                  <p className="text-xs text-gray-400">全体の評価とコメントを記録</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SlideThumbnails;
