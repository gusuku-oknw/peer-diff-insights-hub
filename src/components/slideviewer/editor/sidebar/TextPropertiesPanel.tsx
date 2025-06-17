
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import ColorPicker from "@/components/slideviewer/editor/ColorPicker";
import { SlideElement } from "@/types/slide.types";

interface TextPropertiesPanelProps {
  element: SlideElement;
  onTextValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFontSizeChange: (value: number[]) => void;
  onFontFamilyChange: (value: string) => void;
  onTextColorChange: (color: string) => void;
}

const TextPropertiesPanel = ({
  element,
  onTextValueChange,
  onFontSizeChange,
  onFontFamilyChange,
  onTextColorChange
}: TextPropertiesPanelProps) => {
  return (
    <>
      <AccordionItem value="text-content">
        <AccordionTrigger className="text-sm py-2">テキスト内容</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="text" className="text-xs">テキスト</Label>
              <Input 
                id="text" 
                value={element.props.text || ''}
                onChange={onTextValueChange}
                className="h-20"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="text-style">
        <AccordionTrigger className="text-sm py-2">テキストスタイル</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="grid w-full gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="font-size" className="text-xs">フォントサイズ</Label>
                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {element.props.fontSize || 24}px
                </span>
              </div>
              <Slider 
                id="font-size"
                value={[element.props.fontSize || 24]}
                min={8}
                max={72}
                step={1}
                onValueChange={onFontSizeChange}
                className="py-1"
              />
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="font-family" className="text-xs">フォント</Label>
              <Select 
                value={element.props.fontFamily || 'Arial'} 
                onValueChange={onFontFamilyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="フォントを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Impact">Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label className="text-xs">テキスト色</Label>
              <ColorPicker 
                color={element.props.color || '#000000'}
                onChange={onTextColorChange}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default TextPropertiesPanel;
