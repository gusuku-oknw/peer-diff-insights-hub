
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavigationControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
}

const NavigationControls = ({
  currentSlide,
  totalSlides,
  onPreviousSlide,
  onNextSlide
}: NavigationControlsProps) => {
  return (
    <div className="flex items-center space-x-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onPreviousSlide} 
            disabled={currentSlide === 1} 
            className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>前のスライド (←)</TooltipContent>
      </Tooltip>
      
      <span className="text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md border border-blue-100 min-w-[50px] sm:min-w-[60px] text-center">
        {currentSlide} / {totalSlides}
      </span>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNextSlide} 
            disabled={currentSlide === totalSlides} 
            className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>次のスライド (→)</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default NavigationControls;
