
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
      className={`flex flex-col bg-white border-t border-gray-200 transition-all duration-300 ease-in-out shadow-lg ${
        isCollapsed ? 'overflow-hidden' : ''
      }`}
      style={{ height: `${currentHeight}px` }}
      tabIndex={0}
      role="region"
      aria-label="スライド一覧"
      aria-expanded={!isCollapsed}
    >
      {children}
      
      <div className="absolute bottom-4 right-4 z-30">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              onClick={onToggleCollapse}
              className={`h-12 w-12 p-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-gray-300 rounded-full ${
                isCollapsed ? 'hover:scale-110 ring-2 ring-blue-200' : 'hover:scale-105'
              }`}
              aria-label={isCollapsed ? "スライド一覧を表示" : "スライド一覧を隠す"}
            >
              {isCollapsed ? (
                <ChevronUp className="h-6 w-6 transition-transform duration-300 text-blue-600" />
              ) : (
                <ChevronDown className="h-6 w-6 transition-transform duration-300 text-gray-600" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white text-sm">
            {isCollapsed ? "スライド一覧を表示" : "スライド一覧を隠す"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default UnifiedSlideThumbnailsContainer;
