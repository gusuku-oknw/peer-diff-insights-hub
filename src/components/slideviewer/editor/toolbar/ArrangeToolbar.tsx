
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Group, Ungroup, LockKeyhole, Unlock, ArrowBigUp, ArrowBigDown } from "lucide-react";

interface ArrangeToolbarProps {
  onNotImplemented: (feature: string) => void;
}

const ArrangeToolbar = ({
  onNotImplemented
}: ArrangeToolbarProps) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onNotImplemented("グループ化")}
            >
              <Group className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>グループ化</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onNotImplemented("グループ解除")}
            >
              <Ungroup className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>グループ解除</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="h-8 border-r border-gray-200 mx-1" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onNotImplemented("ロック")}
            >
              <LockKeyhole className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>ロック</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onNotImplemented("ロック解除")}
            >
              <Unlock className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>ロック解除</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="h-8 border-r border-gray-200 mx-1" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onNotImplemented("前面へ移動")}
            >
              <ArrowBigUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>前面へ移動</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onNotImplemented("背面へ移動")}
            >
              <ArrowBigDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>背面へ移動</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default ArrangeToolbar;
