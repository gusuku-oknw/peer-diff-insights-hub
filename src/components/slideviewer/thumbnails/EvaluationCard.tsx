
import { Info, Star, FileText, BarChart3 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AIReviewSummary } from "@/components/slideviewer/panels/AIReviewSummary";
import React from "react";

interface EvaluationCardProps {
  thumbnailWidth: number;
}

const EvaluationCard = ({ thumbnailWidth }: EvaluationCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <div 
              className="thumbnail-card flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 border-2 border-dashed border-purple-300 hover:border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100"
              style={{ width: `${thumbnailWidth}px` }}
              // onClick={handleClick} // onClick is handled by DialogTrigger
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
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">プレゼンテーション評価</p>
            <p className="text-xs text-gray-400">全体の評価とコメントを記録</p>
          </div>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
      <DialogHeader>
        <DialogTitle>AI Review Summary</DialogTitle>
        <DialogDescription>
          This is a summary of the AI review for the selected slide.
        </DialogDescription>
      </DialogHeader>
        <AIReviewSummary slideId={1} />
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationCard;
