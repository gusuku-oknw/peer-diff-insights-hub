
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, MoreVertical, Layers } from "lucide-react";

interface SimplifiedThumbnailHeaderProps {
  slideCount: number;
  userType?: "student" | "enterprise";
}

const SimplifiedThumbnailHeader = ({ 
  slideCount, 
  userType = "enterprise"
}: SimplifiedThumbnailHeaderProps) => {
  const isStudent = userType === "student";

  return (
    <div className="flex justify-between items-center px-4 lg:px-6 py-2 lg:py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold flex items-center text-sm text-gray-800">
          <Layers className="w-4 h-4 mr-2 text-blue-500" />
          {isStudent ? "スライド" : "スライド一覧"}
        </h3>
        
        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium mt-1">
          {slideCount} スライド
        </span>
      </div>
      
      {/* Action buttons - only show for enterprise users */}
      {!isStudent && (
        <div className="flex items-center gap-2 flex-shrink-0">
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
      )}
    </div>
  );
};

export default SimplifiedThumbnailHeader;
