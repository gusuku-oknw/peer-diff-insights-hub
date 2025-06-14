
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Mouse, Keyboard, Smartphone } from "lucide-react";

interface CanvasGuideOverlayProps {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  onClose: () => void;
}

const CanvasGuideOverlay: React.FC<CanvasGuideOverlayProps> = ({
  deviceType,
  onClose
}) => {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = {
    desktop: [
      {
        icon: <Mouse className="w-5 h-5" />,
        title: "マウス操作",
        description: "クリック: 選択 | ドラッグ: 移動 | 右クリック: メニュー"
      },
      {
        icon: <Keyboard className="w-5 h-5" />,
        title: "キーボードショートカット",
        description: "T: テキスト追加 | R: 四角形 | C: 円形 | Del: 削除"
      }
    ],
    tablet: [
      {
        icon: <Smartphone className="w-5 h-5" />,
        title: "タッチ操作",
        description: "タップ: 選択 | ドラッグ: 移動 | ピンチ: ズーム"
      }
    ],
    mobile: [
      {
        icon: <Smartphone className="w-5 h-5" />,
        title: "モバイル操作",
        description: "タップで選択、ドラッグで移動できます"
      }
    ]
  };

  const currentTips = tips[deviceType];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="absolute top-4 left-4 z-20 animate-fade-in">
      <Card className="p-4 bg-black/80 text-white border-none shadow-lg max-w-sm">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-sm">操作ガイド</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-gray-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {currentTips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="text-blue-400 mt-0.5">{tip.icon}</div>
              <div>
                <p className="font-medium text-xs text-blue-200">{tip.title}</p>
                <p className="text-xs text-gray-300 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            {currentTips.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentTip ? 'bg-blue-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CanvasGuideOverlay;
