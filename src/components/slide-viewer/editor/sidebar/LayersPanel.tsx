
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowBigUp, ArrowBigDown, Layers, Type, Square, Circle, Image } from "lucide-react";
import { SlideElement } from "@/stores/slide";

interface LayersPanelProps {
  elements: SlideElement[];
  onElementSelect: (element: SlideElement) => void;
  selectedElement: SlideElement | null;
}

const LayersPanel = ({
  elements,
  onElementSelect,
  selectedElement
}: LayersPanelProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Layers className="h-4 w-4" />
          レイヤー管理
        </h3>
        
        {elements.length === 0 ? (
          <div className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-lg mt-3">
            このスライドには要素がありません
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {/* Sort by zIndex for layer display */}
            {[...elements]
              .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
              .map((element, index) => (
                <div 
                  key={element.id} 
                  className={`
                    p-2 border rounded-md cursor-pointer flex items-center gap-2
                    ${selectedElement?.id === element.id ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}
                  `}
                  onClick={() => onElementSelect(element)}
                >
                  <div className="bg-gray-200 text-gray-600 w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {elements.length - index}
                  </div>
                  
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
                  
                  <span className="text-xs truncate flex-grow">
                    {element.type === 'text' 
                      ? (element.props.text || '').substring(0, 15) + (element.props.text?.length > 15 ? '...' : '') 
                      : element.type === 'shape' 
                      ? `${element.props.shape === 'rect' ? '四角形' : '円形'} ${element.id.split('-')[1]}` 
                      : `画像 ${element.id.split('-')[1]}`}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ArrowBigUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ArrowBigDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default LayersPanel;
