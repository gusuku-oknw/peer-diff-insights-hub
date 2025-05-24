
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sidebar, Undo, Redo, Copy, Trash, ZoomIn, ZoomOut } from "lucide-react";

interface CommonToolbarProps {
  toggleSidebar: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onNotImplemented: (feature: string) => void;
}

const CommonToolbar = ({
  toggleSidebar,
  zoom,
  onZoomIn,
  onZoomOut,
  onNotImplemented
}: CommonToolbarProps) => {
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={toggleSidebar}
          >
            <Sidebar className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>サイドバー表示/非表示</p>
        </TooltipContent>
      </Tooltip>
      
      <div className="h-8 border-r border-gray-200 mx-1" />
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onNotImplemented("元に戻す")}
          >
            <Undo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>元に戻す</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onNotImplemented("やり直す")}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>やり直す</p>
        </TooltipContent>
      </Tooltip>
      
      <div className="h-8 border-r border-gray-200 mx-1" />
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onNotImplemented("コピー")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>コピー</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onNotImplemented("削除")}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>削除</p>
        </TooltipContent>
      </Tooltip>
      
      <div className="ml-auto flex items-center gap-1">
        <div className="flex items-center bg-gray-100 rounded-md">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>縮小</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="px-2 text-sm font-medium">
            {zoom}%
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>拡大</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default CommonToolbar;
