
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSlideStore } from "@/stores/slideStore";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare } from "lucide-react";

interface SlideThumbnailsProps {
  currentSlide: number;
  totalSlides: number;
  commentedSlides: number[];
  mockComments: Record<number, any[]>;
  userType: "student" | "enterprise";
  onSlideSelect: (slideIndex: number) => void;
}

const SlideThumbnails = ({
  currentSlide,
  totalSlides,
  commentedSlides,
  mockComments,
  userType,
  onSlideSelect
}: SlideThumbnailsProps) => {
  const slides = useSlideStore(state => state.slides);
  const generateThumbnails = useSlideStore(state => state.generateThumbnails);
  
  // Generate thumbnails when component mounts
  useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails]);
  
  return (
    <div className="bg-white shadow-sm h-full flex flex-col border-t border-gray-200">
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium flex items-center text-sm text-blue-800">
          スライド一覧
        </h3>
      </div>
      
      <ScrollArea className="flex-grow h-[calc(100%-3rem)]" orientation="horizontal">
        <div className="p-4 h-full flex items-center">
          <div className="flex flex-row gap-4">
            {slides.map((slide, index) => {
              const slideIndex = slide.id;
              const hasComments = (mockComments[slideIndex] || []).length > 0;
              const needsComment = userType === "student" && !commentedSlides?.includes(slideIndex);
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`border rounded-lg cursor-pointer transition-all duration-200 ${
                        currentSlide === slideIndex 
                          ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 shadow-md scale-105' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      } relative`} 
                      onClick={() => onSlideSelect(slideIndex)}
                    >
                      <div className="w-36 aspect-video bg-white rounded-t-md flex items-center justify-center overflow-hidden">
                        {slide.thumbnail ? (
                          <img 
                            src={slide.thumbnail} 
                            alt={`スライド ${slideIndex}`} 
                            className="object-cover w-full h-full" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No Preview</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className={`text-sm font-medium truncate w-32 ${currentSlide === slideIndex ? 'text-blue-700' : ''}`}>
                          {slide.title || `スライド ${slideIndex}`}
                        </p>
                      </div>
                      
                      {/* Comment count badge */}
                      {hasComments && (
                        <div className="absolute top-1 right-1 bg-purple-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                          {(mockComments[slideIndex] || []).length}
                        </div>
                      )}
                      
                      {/* Indicator for student: uncommented slide */}
                      {needsComment && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs border-2 border-white">
                          !
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{slide.title || `スライド ${slideIndex}`}</p>
                      {hasComments && (
                        <div className="flex items-center text-xs text-purple-600">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {(mockComments[slideIndex] || []).length}件のコメント
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SlideThumbnails;
