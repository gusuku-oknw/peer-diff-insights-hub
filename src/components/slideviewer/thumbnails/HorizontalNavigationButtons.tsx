
import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ThumbnailViewMode } from '@/types/slide-viewer/thumbnail.types';

interface HorizontalNavigationButtonsProps {
  viewMode: ThumbnailViewMode;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const HorizontalNavigationButtons = ({ 
  viewMode, 
  onScrollLeft, 
  onScrollRight 
}: HorizontalNavigationButtonsProps) => {
  if (viewMode !== 'horizontal') return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
        onClick={onScrollLeft}
        aria-label="前のスライドへスクロール"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
        onClick={onScrollRight}
        aria-label="次のスライドへスクロール"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
};

export default HorizontalNavigationButtons;
