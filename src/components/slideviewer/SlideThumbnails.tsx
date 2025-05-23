
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSlideStore } from "@/stores/slideStore";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare } from "lucide-react";

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
    <div className="bg-white shadow-sm h-full flex flex-col border-t border-gray-200">
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium flex items-center text-sm text-blue-800">
          スライド一覧
        </h3>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <div className="space-y-3">
            {slides.map((slide, index) => {
              const slideIndex = slide.id;
              const slideTitle = slide.title || `スライド ${slideIndex}`;
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`border rounded-lg cursor-pointer transition-all duration-200 ${
                        currentSlide === slideIndex 
                          ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      } relative`} 
                      onClick={() => onSlideClick(slideIndex)}
                    >
                      <div className="w-full aspect-video bg-white rounded-t-md flex items-center justify-center overflow-hidden">
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
                        <p className={`text-sm font-medium truncate ${currentSlide === slideIndex ? 'text-blue-700' : ''}`}>
                          {slideTitle}
                        </p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">{slideTitle}</p>
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
