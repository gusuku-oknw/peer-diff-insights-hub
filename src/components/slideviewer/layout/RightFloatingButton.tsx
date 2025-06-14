
import React from "react";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RightFloatingButtonProps {
  onToggle: () => void;
}

const RightFloatingButton: React.FC<RightFloatingButtonProps> = ({ onToggle }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="fixed top-1/2 right-4 z-50 shadow-lg bg-white hover:bg-gray-50 border-2 transition-all duration-200 hover:scale-105 h-10 w-10 p-0"
          title="右パネルを表示"
        >
          <PanelRightOpen className="h-4 w-4 text-gray-600" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>右パネルを表示</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RightFloatingButton;
