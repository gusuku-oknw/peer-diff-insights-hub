
import React from "react";
import { X, Mouse, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasGuideOverlayProps {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  onClose: () => void;
}

const CanvasGuideOverlay: React.FC<CanvasGuideOverlayProps> = ({
  deviceType,
  onClose
}) => {
  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-8 w-8 text-blue-500" />;
      case 'tablet':
        return <Tablet className="h-8 w-8 text-blue-500" />;
      default:
        return <Mouse className="h-8 w-8 text-blue-500" />;
    }
  };

  const getInstructions = () => {
    switch (deviceType) {
      case 'mobile':
        return [
          "タップして要素を選択",
          "ピンチして拡大/縮小",
          "ドラッグして移動",
          "左右スワイプでスライド変更"
        ];
      case 'tablet':
        return [
          "タップして要素を選択",
          "ピンチして拡大/縮小",
          "ドラッグして移動",
          "マルチタッチジェスチャー対応"
        ];
      default:
        return [
          "クリックして要素を選択",
          "マウスホイールで拡大/縮小",
          "ドラッグして移動",
          "右クリックでコンテキストメニュー"
        ];
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getDeviceIcon()}
            <h3 className="text-lg font-semibold text-gray-800">
              キャンバスの使い方
            </h3>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ul className="space-y-2 mb-4">
          {getInstructions().map((instruction, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              {instruction}
            </li>
          ))}
        </ul>
        
        <Button
          onClick={onClose}
          className="w-full"
          size="sm"
        >
          始める
        </Button>
      </div>
    </div>
  );
};

export default CanvasGuideOverlay;
