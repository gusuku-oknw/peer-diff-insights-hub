
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface PresentationControlsProps {
  currentSlide: number;
  totalSlides: number;
  isFullScreen: boolean;
  elapsedTime: string;
  presentationStartTime: Date | null;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
}

const PresentationControls = ({
  currentSlide,
  totalSlides,
  isFullScreen,
  elapsedTime,
  presentationStartTime,
  onPreviousSlide,
  onNextSlide
}: PresentationControlsProps) => {
  const slidePosition = `${currentSlide} / ${totalSlides}`;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full bg-black/10 hover:bg-black/20 text-white"
        onClick={onPreviousSlide}
        disabled={currentSlide <= 1}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full bg-black/10 hover:bg-black/20 text-white"
        onClick={onNextSlide}
        disabled={currentSlide >= totalSlides}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      {isFullScreen && (
        <div className="absolute bottom-4 right-4 text-sm text-gray-700 bg-white/80 px-3 py-1 rounded-full flex items-center">
          <span className="mr-2">{slidePosition}</span>
          {presentationStartTime && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{elapsedTime}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PresentationControls;
