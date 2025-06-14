
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThumbnailNavigationButtonsProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const ThumbnailNavigationButtons = ({
  onScrollLeft,
  onScrollRight
}: ThumbnailNavigationButtonsProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
        onClick={onScrollLeft}
        aria-label="前のスライドへスクロール"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
        onClick={onScrollRight}
        aria-label="次のスライドへスクロール"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </>
  );
};

export default ThumbnailNavigationButtons;
