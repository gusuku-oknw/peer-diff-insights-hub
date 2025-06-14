
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapseThumbnailsButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const CollapseThumbnailsButton: React.FC<CollapseThumbnailsButtonProps> = ({
  isCollapsed,
  onToggle
}) => {
  return (
    <div className="absolute bottom-2 right-4 z-10">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 bg-white shadow-md hover:shadow-lg transition-all duration-200 border-gray-300"
            aria-label={isCollapsed ? "スライド一覧を表示" : "スライド一覧を隠す"}
          >
            {isCollapsed ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {isCollapsed ? "スライド一覧を表示" : "スライド一覧を隠す"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default CollapseThumbnailsButton;
