
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import ColorPicker from "@/components/slide-viewer/editor/ColorPicker";
import { SlideElement } from "@/stores/slide";

interface ShapePropertiesPanelProps {
  element: SlideElement;
  onFillColorChange: (color: string) => void;
  onStrokeColorChange: (color: string) => void;
  onStrokeWidthChange: (value: number[]) => void;
}

const ShapePropertiesPanel = ({
  element,
  onFillColorChange,
  onStrokeColorChange,
  onStrokeWidthChange
}: ShapePropertiesPanelProps) => {
  return (
    <AccordionItem value="shape-style">
      <AccordionTrigger className="text-sm py-2">図形スタイル</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <div className="grid w-full gap-1.5">
            <Label className="text-xs">塗りつぶし色</Label>
            <ColorPicker 
              color={element.props.fill || '#4287f5'}
              onChange={onFillColorChange}
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label className="text-xs">枠線色</Label>
            <ColorPicker 
              color={element.props.stroke || '#2054a8'}
              onChange={onStrokeColorChange}
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="stroke-width" className="text-xs">枠線の太さ</Label>
              <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                {element.props.strokeWidth || 0}px
              </span>
            </div>
            <Slider 
              id="stroke-width"
              value={[element.props.strokeWidth || 0]}
              min={0}
              max={20}
              step={1}
              onValueChange={onStrokeWidthChange}
              className="py-1"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ShapePropertiesPanel;
