
import React from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LeftFloatingButtonProps {
  onToggle: () => void;
}

const LeftFloatingButton: React.FC<LeftFloatingButtonProps> = ({ onToggle }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="fixed top-1/2 left-4 z-50 shadow-lg bg-white hover:bg-gray-50 border-2 transition-all duration-200 hover:scale-105 h-10 w-10 p-0"
          title="左サイドバーを表示"
        >
          <PanelLeftOpen className="h-4 w-4 text-gray-600" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>左サイドバーを表示</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default LeftFloatingButton;
