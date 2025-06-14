
import React, { useRef } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface UnifiedSlideThumbnailsContainerProps {
  currentHeight: number;
  isCollapsed: boolean;
  children: React.ReactNode;
  onToggleCollapse: () => void;
}

const UnifiedSlideThumbnailsContainer = ({
  currentHeight,
  isCollapsed,
  children,
  onToggleCollapse
}: UnifiedSlideThumbnailsContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col bg-white border-t border-gray-200 transition-all duration-300 ease-in-out shadow-lg ${
        isCollapsed ? 'overflow-hidden' : ''
      }`}
      style={{ height: `${currentHeight}px` }}
      tabIndex={0}
      role="region"
      aria-label="スライド一覧"
      aria-expanded={!isCollapsed}
    >
      {/* Improved toggle button - positioned at top center */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30">
        {isCollapsed ? (
          // Collapsed state: Minimal tab at top
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleCollapse}
                className="h-6 px-4 bg-white shadow-md hover:shadow-lg transition-all duration-300 border-gray-300 rounded-b-lg rounded-t-none border-t-0 hover:scale-105 group"
                aria-label="スライド一覧を表示"
              >
                <ChevronUp className="h-3 w-3 transition-transform duration-300 text-blue-600 group-hover:text-blue-700" />
                <span className="text-xs text-gray-600 group-hover:text-gray-800 ml-1">表示</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-gray-900 text-white text-sm">
              スライド一覧を表示 (スペースキー)
            </TooltipContent>
          </Tooltip>
        ) : (
          // Expanded state: Button at top border
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleCollapse}
                className="h-8 px-4 bg-white shadow-md hover:shadow-lg transition-all duration-300 border-gray-300 rounded-lg -mt-4 hover:scale-105 group"
                aria-label="スライド一覧を隠す"
              >
                <ChevronDown className="h-4 w-4 transition-transform duration-300 text-gray-600 group-hover:text-gray-800" />
                <span className="text-xs text-gray-600 group-hover:text-gray-800 ml-1">隠す</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-gray-900 text-white text-sm">
              スライド一覧を隠す (スペースキー)
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {children}
    </div>
  );
};

export default UnifiedSlideThumbnailsContainer;
