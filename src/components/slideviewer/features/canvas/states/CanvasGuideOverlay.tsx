
import React from "react";
import { Button } from "@/components/ui/button";
import { X, MousePointer, Touch, Keyboard } from "lucide-react";

interface CanvasGuideOverlayProps {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  onClose: () => void;
}

const CanvasGuideOverlay: React.FC<CanvasGuideOverlayProps> = ({
  deviceType,
  onClose
}) => {
  const getGuideContent = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          icon: <Touch className="h-6 w-6" />,
          title: "タッチ操作ガイド",
          instructions: [
            "タップして要素を選択",
            "ピンチで拡大・縮小",
            "ドラッグで移動"
          ]
        };
      case 'tablet':
        return {
          icon: <Touch className="h-6 w-6" />,
          title: "タブレット操作ガイド",
          instructions: [
            "タップまたはクリックで選択",
            "ピンチまたはマウスホイールで拡大",
            "ドラッグで移動"
          ]
        };
      default:
        return {
          icon: <MousePointer className="h-6 w-6" />,
          title: "デスクトップ操作ガイド",
          instructions: [
            "クリックで要素を選択",
            "Ctrl + マウスホイールで拡大",
            "ドラッグで移動",
            "右クリックでコンテキストメニュー"
          ]
        };
    }
  };

  const guide = getGuideContent();

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {guide.icon}
            <h3 className="text-lg font-medium">{guide.title}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ul className="space-y-2 mb-6">
          {guide.instructions.map((instruction, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              {instruction}
            </li>
          ))}
        </ul>
        
        <Button onClick={onClose} className="w-full">
          始める
        </Button>
      </div>
    </div>
  );
};

export default CanvasGuideOverlay;
