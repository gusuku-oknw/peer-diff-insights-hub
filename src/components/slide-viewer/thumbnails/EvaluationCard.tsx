
import { Info, Star, FileText, BarChart3 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EvaluationCardProps {
  thumbnailWidth: number;
  onOpenOverallReview?: () => void;
}

const EvaluationCard = ({ thumbnailWidth, onOpenOverallReview }: EvaluationCardProps) => {
  // Dynamic sizing based on thumbnail width
  const isSmall = thumbnailWidth < 120;
  const isMedium = thumbnailWidth >= 120 && thumbnailWidth < 160;
  const isLarge = thumbnailWidth >= 160;

  const handleClick = () => {
    console.log("Opening presentation evaluation");
    onOpenOverallReview?.();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="thumbnail-card flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 border-2 border-dashed border-purple-300 hover:border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100"
          style={{ width: `${thumbnailWidth}px` }}
          onClick={handleClick}
        >
          <div className="w-full aspect-video flex items-center justify-center p-3 mb-3">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className={`${isSmall ? 'w-3 h-3' : isMedium ? 'w-3 h-3' : 'w-4 h-4'} text-purple-500 mr-1`} />
                <BarChart3 className={`${isSmall ? 'w-3 h-3' : isMedium ? 'w-3 h-3' : 'w-4 h-4'} text-purple-500 mr-1`} />
                <FileText className={`${isSmall ? 'w-3 h-3' : isMedium ? 'w-3 h-3' : 'w-4 h-4'} text-purple-500`} />
              </div>
              <span className={`text-purple-700 font-medium ${isSmall ? 'text-xs' : 'text-xs'}`}>
                {isSmall ? 'AI評価' : 'プレゼン評価'}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center justify-center rounded-full font-bold mb-2 bg-purple-500 text-white shadow-md ${
              isSmall ? 'w-5 h-5' : isMedium ? 'w-6 h-6' : 'w-6 h-6'
            }`}>
              <Info className={`${isSmall ? 'h-2 w-2' : 'h-3 w-3'}`} />
            </div>
            <p className={`font-medium text-purple-700 ${isSmall ? 'text-xs' : 'text-xs'}`}>
              {isSmall ? '評価・コメント' : '全体評価・コメント'}
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
  );
};

export default EvaluationCard;
