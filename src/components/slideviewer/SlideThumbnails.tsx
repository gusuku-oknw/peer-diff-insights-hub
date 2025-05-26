
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSlideStore } from "@/stores/slideStore";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideThumbnailsProps {
  slides?: any[];
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
}

const SlideThumbnails = ({
  slides: propSlides,
  currentSlide,
  onSlideClick
}: SlideThumbnailsProps) => {
  const storeSlides = useSlideStore(state => state.slides);
  const generateThumbnails = useSlideStore(state => state.generateThumbnails);
  
  // Use props slides if provided, otherwise use store slides
  const slides = propSlides || storeSlides;
  
  // Generate thumbnails when component mounts
  useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails]);
  
  return (
    <div className="modern-thumbnails bg-white h-full flex flex-col border-t border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
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
      
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <div className="flex gap-4 items-start">
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
                      onClick={() => onSlideClick(slideIndex)}
                    >
                      {/* Slide number badge */}
                      <div className={`absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-gray-400 text-white group-hover:bg-blue-400'
                      } transition-colors duration-200`}>
                        {slideIndex}
                      </div>
                      
                      {/* Thumbnail container */}
                      <div className="w-32 aspect-video bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm">
                        {slide.thumbnail ? (
                          <img 
                            src={slide.thumbnail} 
                            alt={`スライド ${slideIndex}`} 
                            className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-8 h-8 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-gray-400 text-xs">No Preview</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Slide info */}
                      <div className="p-3">
                        <p className={`text-xs font-medium truncate transition-colors duration-200 ${
                          isActive ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-800'
                        }`}>
                          {slideTitle}
                        </p>
                        
                        {/* Status indicators */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            {slide.elements && slide.elements.length > 0 && (
                              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                                {slide.elements.length} 要素
                              </span>
                            )}
                          </div>
                          
                          {slide.hasComments && (
                            <div className="flex items-center text-purple-500">
                              <MessageSquare className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg"></div>
                        </div>
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
            <div className="thumbnail-card flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50">
              <div className="w-32 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-xs text-gray-500">新規スライド</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SlideThumbnails;
