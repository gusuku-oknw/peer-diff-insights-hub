
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
    <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
      <div className="flex items-center gap-4">
        <h3 className="font-bold text-xl text-gray-800">
          スライド一覧
        </h3>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">
            {slidesCount} スライド
          </span>
          <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-full font-medium">
            現在: {currentSlide}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 hidden sm:block">
          ESCキーでも閉じます
        </span>
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-12 p-0 hover:bg-red-50 hover:border-red-200 transition-all duration-200 shadow-md hover:shadow-lg"
          onClick={onClose}
          aria-label="スライド一覧を閉じる"
        >
          <X className="h-6 w-6 text-gray-600 hover:text-red-600 transition-colors" />
        </Button>
      </div>
    </div>
  );
};

export default SimplifiedSlideThumbnailsHeader;
