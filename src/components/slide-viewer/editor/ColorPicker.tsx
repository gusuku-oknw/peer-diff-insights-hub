
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

// 色のパレットを定義
const colorPalette = [
  // メインカラー
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
  // 青系
  "#1e40af", "#3b82f6", "#93c5fd", "#dbeafe",
  // 緑系
  "#15803d", "#22c55e", "#86efac", "#dcfce7",
  // 赤系
  "#b91c1c", "#ef4444", "#fca5a5", "#fee2e2",
  // 黄色系
  "#a16207", "#eab308", "#fde047", "#fef9c3",
  // 紫系
  "#7e22ce", "#a855f7", "#d8b4fe", "#f3e8ff",
  // グレー系
  "#1f2937", "#6b7280", "#d1d5db", "#f3f4f6",
];

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  
  // ヘックスカラーが有効かどうか検証
  const isValidHex = (hex: string) => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
  };

  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    onChange(newColor);
    // 選択後は閉じない
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputColor = e.target.value;
    setCurrentColor(inputColor);
    
    // 有効なカラーコードの場合のみ更新
    if (isValidHex(inputColor)) {
      onChange(inputColor);
    }
  };
  
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange(newColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between px-3 h-9"
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded-md border border-gray-300" 
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-xs font-mono">{currentColor}</span>
          </div>
          <Palette className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div>
            <Label className="text-xs mb-1.5 block">カラーパレット</Label>
            <div className="grid grid-cols-8 gap-1">
              {colorPalette.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`
                    w-6 h-6 rounded-md border 
                    ${colorOption === currentColor 
                      ? 'ring-2 ring-blue-500 ring-offset-2' 
                      : 'hover:ring-1 hover:ring-gray-300'
                    }
                    ${colorOption === '#ffffff' ? 'border-gray-200' : 'border-transparent'}
                  `}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => handleColorChange(colorOption)}
                  aria-label={`色を選択: ${colorOption}`}
                >
                  {colorOption === currentColor && (
                    <Check 
                      className={`h-3 w-3 mx-auto ${
                        colorOption === '#ffffff' || colorOption === '#fef9c3' || colorOption === '#dcfce7' 
                          || colorOption === '#dbeafe' || colorOption === '#f3e8ff' || colorOption === '#f3f4f6'
                          ? 'text-gray-800' : 'text-white'
                      }`} 
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="hex-input" className="text-xs mb-1.5 block">カスタムカラー</Label>
            <div className="flex gap-2">
              <div className="flex-grow">
                <input
                  id="hex-input"
                  type="text"
                  value={currentColor}
                  onChange={handleInputChange}
                  maxLength={7}
                  className="w-full h-9 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="color"
                  value={currentColor}
                  onChange={handleCustomColorChange}
                  className="w-9 h-9 p-1 border-0 rounded-md cursor-pointer"
                  id="color-picker-input"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              完了
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
