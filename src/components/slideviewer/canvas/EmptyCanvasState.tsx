
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Type, Square, Circle, Image, Upload } from "lucide-react";

interface EmptyCanvasStateProps {
  onAddText: () => void;
  onAddShape: (shape: 'rect' | 'circle') => void;
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
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="text-6xl mb-6 opacity-20">📄</div>
        <h3 className="text-2xl font-light mb-2">スライド {slideNumber}</h3>
        <p className="text-sm text-gray-400">このスライドは空です</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <Plus className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          スライドを作成しましょう
        </h3>
        <p className="text-gray-500 text-sm max-w-md">
          テキスト、図形、画像を追加してプレゼンテーションを始めましょう
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md">
        <Card 
          className="p-4 hover:shadow-md transition-all cursor-pointer border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
          onClick={onAddText}
        >
          <div className="flex flex-col items-center text-center">
            <Type className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-xs font-medium text-gray-600">テキスト</span>
          </div>
        </Card>

        <Card 
          className="p-4 hover:shadow-md transition-all cursor-pointer border-dashed border-2 hover:border-green-300 hover:bg-green-50"
          onClick={() => onAddShape('rect')}
        >
          <div className="flex flex-col items-center text-center">
            <Square className="w-6 h-6 text-green-500 mb-2" />
            <span className="text-xs font-medium text-gray-600">四角形</span>
          </div>
        </Card>

        <Card 
          className="p-4 hover:shadow-md transition-all cursor-pointer border-dashed border-2 hover:border-purple-300 hover:bg-purple-50"
          onClick={() => onAddShape('circle')}
        >
          <div className="flex flex-col items-center text-center">
            <Circle className="w-6 h-6 text-purple-500 mb-2" />
            <span className="text-xs font-medium text-gray-600">円形</span>
          </div>
        </Card>

        <Card 
          className="p-4 hover:shadow-md transition-all cursor-pointer border-dashed border-2 hover:border-orange-300 hover:bg-orange-50"
          onClick={onAddImage}
        >
          <div className="flex flex-col items-center text-center">
            <Image className="w-6 h-6 text-orange-500 mb-2" />
            <span className="text-xs font-medium text-gray-600">画像</span>
          </div>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
          <div className="flex items-center">
            <Upload className="w-4 h-4 mr-1" />
            ドラッグ&ドロップ対応
          </div>
          <div>キーボードショートカット: T (テキスト), R (四角), C (円)</div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCanvasState;
