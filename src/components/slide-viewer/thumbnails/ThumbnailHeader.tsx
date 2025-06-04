
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, MoreVertical, CheckCircle, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ThumbnailHeaderProps {
  slideCount: number;
  userType?: "student" | "enterprise";
  reviewedCount?: number;
  totalComments?: number;
}

const ThumbnailHeader = ({ 
  slideCount, 
  userType = "enterprise",
  reviewedCount = 0,
  totalComments = 0
}: ThumbnailHeaderProps) => {
  const progressPercentage = slideCount > 0 ? Math.round((reviewedCount / slideCount) * 100) : 0;
  const isStudent = userType === "student";

  return (
    <div className="flex justify-between items-center px-4 lg:px-6 py-2 lg:py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold flex items-center text-sm text-gray-800 mb-1">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {isStudent ? "レビュー進捗" : "スライド一覧"}
        </h3>
        
        {/* Progress information for students */}
        {isStudent ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-gray-600">
                  {reviewedCount}/{slideCount} 完了
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3 text-purple-500" />
                <span className="text-gray-600">
                  {totalComments}コメント
                </span>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        ) : (
          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
            {slideCount}
          </span>
        )}
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

export default ThumbnailHeader;
