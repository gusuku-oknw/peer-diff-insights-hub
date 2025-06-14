
import React from "react";
import { Button } from "@/components/ui/button";
import { Type, Square, Image } from "lucide-react";

interface EmptyCanvasStateProps {
  onAddText: () => void;
  onAddShape: () => void;
  onAddImage: () => void;
  slideNumber: number;
  editable: boolean;
}

const EmptyCanvasState: React.FC<EmptyCanvasStateProps> = ({
  onAddText,
  onAddShape,
  onAddImage,
  slideNumber,
  editable
}) => {
  if (!editable) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 text-lg">スライド {slideNumber}</p>
        <p className="text-gray-400 text-sm mt-2">コンテンツなし</p>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <h3 className="text-lg font-medium text-gray-700 mb-4">
        スライド {slideNumber} を編集
      </h3>
      <div className="flex gap-4 justify-center">
        <Button onClick={onAddText} variant="outline" size="sm">
          <Type className="h-4 w-4 mr-2" />
          テキスト追加
        </Button>
        <Button onClick={onAddShape} variant="outline" size="sm">
          <Square className="h-4 w-4 mr-2" />
          図形追加
        </Button>
        <Button onClick={onAddImage} variant="outline" size="sm">
          <Image className="h-4 w-4 mr-2" />
          画像追加
        </Button>
      </div>
    </div>
  );
};

export default EmptyCanvasState;
