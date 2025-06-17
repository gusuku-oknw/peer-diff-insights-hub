
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { AlignCenter, AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter } from "lucide-react";
import { SlideElement } from "@/types/slide.types";

interface PositionSizePanelProps {
  element: SlideElement;
  onPositionChange: (axis: 'x' | 'y', value: number) => void;
  onSizeChange: (dimension: 'width' | 'height', value: number) => void;
  onAngleChange: (value: number[]) => void;
  onAlignCenter: () => void;
  onAlignMiddle: () => void;
  onAlignBoth: () => void;
}

const PositionSizePanel = ({
  element,
  onPositionChange,
  onSizeChange,
  onAngleChange,
  onAlignCenter,
  onAlignMiddle,
  onAlignBoth
}: PositionSizePanelProps) => {
  return (
    <AccordionItem value="position-size">
      <AccordionTrigger className="text-sm py-2">位置とサイズ</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="position-x" className="text-xs">X位置</Label>
              <Input 
                id="position-x" 
                type="number"
                value={Math.round(element.position.x)}
                onChange={(e) => onPositionChange('x', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="position-y" className="text-xs">Y位置</Label>
              <Input 
                id="position-y" 
                type="number"
                value={Math.round(element.position.y)}
                onChange={(e) => onPositionChange('y', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="size-width" className="text-xs">幅</Label>
              <Input 
                id="size-width" 
                type="number"
                value={Math.round(element.size.width)}
                onChange={(e) => onSizeChange('width', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="size-height" className="text-xs">高さ</Label>
              <Input 
                id="size-height" 
                type="number"
                value={Math.round(element.size.height)}
                onChange={(e) => onSizeChange('height', Number(e.target.value))}
                disabled={element.type === 'shape' && element.props.shape === 'circle'}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="angle" className="text-xs">回転角度</Label>
              <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                {Math.round(element.angle || 0)}°
              </span>
            </div>
            <Slider 
              id="angle"
              value={[element.angle || 0]}
              min={0}
              max={360}
              step={1}
              onValueChange={onAngleChange}
              className="py-1"
            />
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8"
              onClick={onAlignCenter}
            >
              <AlignCenter className="h-3 w-3 mr-1" />
              <span className="text-xs">水平中央</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8"
              onClick={onAlignMiddle}
            >
              <AlignVerticalJustifyCenter className="h-3 w-3 mr-1" />
              <span className="text-xs">垂直中央</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8"
              onClick={onAlignBoth}
            >
              <AlignHorizontalJustifyCenter className="h-3 w-3 mr-1" />
              <span className="text-xs">中央揃え</span>
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PositionSizePanel;
