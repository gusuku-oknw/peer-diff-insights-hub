
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RightFloatingButtonProps {
  onToggle: () => void;
}

const RightFloatingButton: React.FC<RightFloatingButtonProps> = ({ onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="fixed right-0 top-32 z-50 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className={`
              h-16 bg-white hover:bg-gray-50 border-2 border-r-0 
              shadow-lg transition-all duration-300 ease-out
              rounded-r-none rounded-l-lg
              flex flex-col items-center justify-center gap-1
              ${isHovered ? 'w-20 px-2' : 'w-8 px-1'}
            `}
            title="右パネルを表示"
          >
            <PanelRightOpen className="h-4 w-4 text-gray-600" />
            {isHovered && (
              <span className="text-xs text-gray-600 font-medium leading-tight">
                パネル
              </span>
            )}
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>右パネルを表示</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RightFloatingButton;
