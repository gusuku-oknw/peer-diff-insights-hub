
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AddSlideCardProps {
  thumbnailWidth: number;
}

const AddSlideCard = ({ thumbnailWidth }: AddSlideCardProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="thumbnail-card flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50" 
          style={{ width: `${thumbnailWidth}px` }}
        >
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
  );
};

export default AddSlideCard;
