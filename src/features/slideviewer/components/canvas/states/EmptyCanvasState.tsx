
import React from "react";
import { Plus, Type, Square, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="text-gray-400 text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          スライド {slideNumber}
        </h3>
        <p className="text-gray-500">
          このスライドにはコンテンツがありません
        </p>
      </div>
    );
  }

  return (
    <div className="text-center p-8 max-w-md">
      <div className="text-gray-300 text-6xl mb-6">✨</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        スライド {slideNumber} を作成しましょう
      </h3>
      <p className="text-gray-500 mb-6">
        要素を追加してスライドを作成してください
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={onAddText}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <Type className="h-4 w-4" />
          テキスト
        </Button>
        
        <Button
          onClick={onAddShape}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
        >
          <Square className="h-4 w-4" />
          図形
        </Button>
        
        <Button
          onClick={onAddImage}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
        >
          <Image className="h-4 w-4" />
          画像
        </Button>
      </div>
    </div>
  );
};

export default EmptyCanvasState;
