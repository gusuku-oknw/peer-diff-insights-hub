
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Type, Square, Circle, Image, Layers, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SlideElement } from "@/stores/slide";

interface ElementsPanelProps {
  elements: SlideElement[];
  onAddText: () => void;
  onAddShape: (shape: 'rect' | 'circle') => void;
  onAddImage: () => void;
  onElementSelect: (element: SlideElement) => void;
  selectedElement: SlideElement | null;
}

const ElementsPanel = ({ 
  elements, 
  onAddText, 
  onAddShape, 
  onAddImage, 
  onElementSelect,
  selectedElement
}: ElementsPanelProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Settings className="h-4 w-4" />
          要素追加
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={onAddText}
          >
            <Type className="h-6 w-6 mb-1 text-blue-600" />
            <span className="text-xs">テキスト</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => onAddShape('rect')}
          >
            <Square className="h-6 w-6 mb-1 text-blue-600" />
            <span className="text-xs">四角形</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => onAddShape('circle')}
          >
            <Circle className="h-6 w-6 mb-1 text-blue-600" />
            <span className="text-xs">円形</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={onAddImage}
          >
            <Image className="h-6 w-6 mb-1 text-blue-600" />
            <span className="text-xs">画像</span>
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1 mt-6">
          <Layers className="h-4 w-4" />
          要素一覧
        </h3>
        
        {elements.length === 0 ? (
          <div className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
            要素がありません
          </div>
        ) : (
          <div className="space-y-2 mt-2">
            {elements.map((element) => (
              <Button 
                key={element.id} 
                variant="outline" 
                className={`w-full justify-start gap-2 ${
                  selectedElement?.id === element.id ? 'bg-blue-50 border-blue-300' : ''
                }`}
                onClick={() => onElementSelect(element)}
              >
                {element.type === 'text' ? (
                  <Type className="h-4 w-4" />
                ) : element.type === 'shape' && element.props.shape === 'rect' ? (
                  <Square className="h-4 w-4" />
                ) : element.type === 'shape' && element.props.shape === 'circle' ? (
                  <Circle className="h-4 w-4" />
                ) : element.type === 'image' ? (
                  <Image className="h-4 w-4" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <span className="text-xs truncate">
                  {element.type === 'text' 
                    ? (element.props.text || '').substring(0, 20) + (element.props.text?.length > 20 ? '...' : '') 
                    : element.type === 'shape' 
                    ? `${element.props.shape === 'rect' ? '四角形' : '円形'} ${element.id.split('-')[1]}` 
                    : `画像 ${element.id.split('-')[1]}`}
                </span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ElementsPanel;
