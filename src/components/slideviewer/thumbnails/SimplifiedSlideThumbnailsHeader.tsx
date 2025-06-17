
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimplifiedSlideThumbnailsHeaderProps {
  slidesCount: number;
  currentSlide: number;
  onClose: () => void;
}

const SimplifiedSlideThumbnailsHeader = ({ 
  slidesCount, 
  currentSlide, 
  onClose 
}: SimplifiedSlideThumbnailsHeaderProps) => {
  return (
    <div className="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center min-w-0">
          <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="hidden sm:inline">スライド一覧</span>
          <span className="sm:hidden">一覧</span>
        </h3>
        <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 text-green-700 text-xs sm:text-sm rounded-full font-medium flex-shrink-0">
          <span className="hidden sm:inline">現在: </span>
          {currentSlide} / {slidesCount}
        </span>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <span className="text-xs text-gray-500 hidden md:block bg-white/60 px-2 py-1 rounded-md">
          ESCキーでも閉じます
        </span>
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-12 sm:h-11 sm:w-11 p-0 hover:bg-red-50 hover:border-red-200 transition-all duration-200 shadow-md hover:shadow-lg bg-white border-2 border-gray-300 hover:border-red-300 touch-manipulation"
          onClick={onClose}
          aria-label="スライド一覧を閉じる"
        >
          <X className="h-6 w-6 sm:h-5 sm:w-5 text-gray-700 hover:text-red-600 transition-colors font-bold" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
};

export default SimplifiedSlideThumbnailsHeader;
