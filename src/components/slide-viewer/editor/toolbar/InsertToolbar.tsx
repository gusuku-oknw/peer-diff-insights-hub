
import React from "react";
import { Button } from "@/components/ui/button";
import { Type, Square, Circle, Image } from "lucide-react";

interface InsertToolbarProps {
  onAddText: () => void;
  onAddRect: () => void;
  onAddCircle: () => void;
  onNotImplemented: (feature: string) => void;
}

const InsertToolbar = ({
  onAddText,
  onAddRect,
  onAddCircle,
  onNotImplemented
}: InsertToolbarProps) => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={onAddText}
        className="h-8 flex items-center gap-1"
      >
        <Type className="h-4 w-4" />
        <span className="text-xs">テキスト</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onAddRect}
        className="h-8 flex items-center gap-1"
      >
        <Square className="h-4 w-4" />
        <span className="text-xs">四角形</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onAddCircle}
        className="h-8 flex items-center gap-1"
      >
        <Circle className="h-4 w-4" />
        <span className="text-xs">円形</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNotImplemented("画像追加")}
        className="h-8 flex items-center gap-1"
      >
        <Image className="h-4 w-4" />
        <span className="text-xs">画像</span>
      </Button>
    </>
  );
};

export default InsertToolbar;
