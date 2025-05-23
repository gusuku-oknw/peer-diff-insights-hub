
import { ScrollArea } from "@/components/ui/scroll-area";

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
            {Array.from({length: totalSlides}).map((_, index) => {
              const slideIndex = index + 1;
              const hasComments = (mockComments[slideIndex] || []).length > 0;
              const needsComment = userType === "student" && !commentedSlides?.includes(slideIndex);
              
              return (
                <div 
                  key={index} 
                  className={`border rounded-lg cursor-pointer transition-all duration-200 ${
                    currentSlide === slideIndex 
                      ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 shadow-md scale-105' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  } relative`} 
                  onClick={() => onSlideSelect(slideIndex)}
                >
                  <div className="w-36 aspect-video bg-white rounded-t-md flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://placehold.co/1600x900/e2e8f0/1e293b?text=Slide+${slideIndex}`} 
                      alt={`スライド ${slideIndex}`} 
                      className="object-cover w-full h-full" 
                    />
                  </div>
                  <div className="p-3">
                    <p className={`text-sm font-medium truncate w-32 ${currentSlide === slideIndex ? 'text-blue-700' : ''}`}>
                      {slideIndex === 1 ? 'Q4 Presentation' : `Slide ${slideIndex}`}
                    </p>
                  </div>
                  
                  {/* コメント数バッジ */}
                  {hasComments && (
                    <div className="absolute top-1 right-1 bg-purple-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {(mockComments[slideIndex] || []).length}
                    </div>
                  )}
                  
                  {/* 学生向け：未コメントバッジ */}
                  {needsComment && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs border-2 border-white">
                      !
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SlideThumbnails;
