
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, MoreVertical } from "lucide-react";

interface ThumbnailHeaderProps {
  slideCount: number;
}

const ThumbnailHeader = ({ slideCount }: ThumbnailHeaderProps) => {
  return (
    <div className="flex justify-between items-center px-4 lg:px-6 py-2 lg:py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <h3 className="font-semibold flex items-center text-sm text-gray-800">
        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        スライド一覧
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
          {slideCount}
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
  );
};

export default ThumbnailHeader;
